// AI Analysis Happy Path Diagnostic - Adapted for FamilyVault API
// Run this in DevTools Console to test the fixed AI pipeline

(async () => {
  const BASE_URL = 'http://localhost:5000';
  const API = BASE_URL + '/api';
  const FAMILY_ID = 'family-1';

  const post = (p,b) => fetch(API+p,{
    method:'POST',
    headers:{'content-type':'application/json'},
    credentials: 'include',
    body: JSON.stringify(b)
  }).then(r=>r.ok?r:r.text().then(t=>Promise.reject(new Error(r.status+' '+t))));

  console.log('▶ Step 1: Presign URL');
  // Pre-calculate the exact content and length for accurate signing
  const testContent = 'diagnostic test ' + new Date().toISOString();
  const contentLength = new TextEncoder().encode(testContent).length;
  
  const pr = await post('/storage/presign', {
    fileName:'diagnostic.txt', 
    contentType:'text/plain', 
    type:'document', 
    familyId: FAMILY_ID,
    contentLength: contentLength
  }).then(r=>r.json());
  console.log('Presign response:', pr);
  if (!pr.uploadUrl || !pr.key) throw new Error('presign missing uploadUrl/key');

  console.log('▶ Step 2: Upload to S3');
  // Use the same content that was used for length calculation
  const testFile = new File([testContent], 'diagnostic.txt', {type: 'text/plain'});
  console.log(`Content: "${testContent}" (${contentLength} bytes)`);
  
  const put = await fetch(pr.uploadUrl, {
    method: 'PUT', 
    mode: 'cors',
    credentials: 'omit', // Critical: do NOT send cookies to S3
    headers: {
      'Content-Type': 'text/plain'
    },
    body: testFile
  });
  if (!put.ok) {
    const errorText = await put.text();
    console.log('S3 Error Response:', errorText);
    throw new Error('S3 PUT failed: '+put.status + ' ' + put.statusText + ' - ' + errorText);
  }
  console.log('✅ S3 upload successful');

  console.log('▶ Step 3: Register with AI inbox');
  const inbox = await post('/inbox/register', { 
    userId: 'current-user',
    fileKey: pr.key,
    fileName: 'diagnostic.txt',
    mime: 'text/plain',
    size: 50
  }).then(r=>r.json());
  console.log('Register response:', inbox);
  if (!inbox.uploadId) throw new Error('no uploadId returned');

  console.log('▶ Step 4: Start analysis');
  const analyze = await post(`/inbox/${inbox.uploadId}/analyze`, {
    userId: 'current-user',
    fileName: 'diagnostic.txt'
  }).then(r=>r.json());
  console.log('Analysis start response:', analyze);

  console.log('▶ Step 5: Poll for results');
  const wait = ms => new Promise(r=>setTimeout(r,ms));
  for (let i=0; i<20; i++){
    const st = await fetch(`${API}/inbox/${inbox.uploadId}/status`,
                           { credentials: 'include' }).then(r=>r.json());
    console.log(`Poll ${i+1}:`, st.status, st.progress || '', st.error || '');
    
    if (st.status === 'suggested') {
      console.log('✅ SUCCESS! AI Analysis Pipeline Working!');
      console.log('Result:', st.result);
      return st;
    }
    if (st.status === 'failed') {
      console.log('❌ Analysis failed:', st.error);
      return st;
    }
    
    await wait(2000);
  }
  throw new Error('⏳ timeout waiting for completion');
  
})().then(result => {
  console.log('🎉 DIAGNOSTIC COMPLETE - AI Pipeline Working!', result);
}).catch(e => {
  console.error('🚨 DIAGNOSTIC FAILED →', e.message);
  console.error('Full error:', e);
});