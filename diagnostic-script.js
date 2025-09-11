// AI Analysis Happy Path Diagnostic - Adapted for FamilyVault API
// Run this in DevTools Console to test the fixed AI pipeline

(async () => {
  const API = '/api';
  const FAMILY_ID = 'family-1';

  const post = (p,b) => fetch(API+p,{
    method:'POST', credentials:'include',
    headers:{'content-type':'application/json'},
    body: JSON.stringify(b)
  }).then(r=>r.ok?r:r.text().then(t=>Promise.reject(new Error(r.status+' '+t))));

  console.log('▶ Step 1: Presign URL');
  const pr = await post('/storage/presign', {
    fileName:'diagnostic.txt', 
    contentType:'text/plain', 
    type:'document', 
    familyId: FAMILY_ID,
    contentLength: 50
  }).then(r=>r.json());
  console.log('Presign response:', pr);
  if (!pr.uploadUrl || !pr.key) throw new Error('presign missing uploadUrl/key');

  console.log('▶ Step 2: Upload to S3');
  const put = await fetch(pr.uploadUrl, {
    method:'PUT', 
    headers:{'Content-Type':'text/plain'},
    body:new Blob(['diagnostic test '+new Date().toISOString()],{type:'text/plain'})
  });
  if (!put.ok) throw new Error('S3 PUT failed: '+put.status);
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
    const st = await fetch(`${API}/inbox/${inbox.uploadId}/stream`,
                           { credentials:'include' }).then(r=>r.json());
    console.log(`Poll ${i+1}:`, st.status, st.progress || '', st.error || '');
    
    if (st.status === 'completed') {
      console.log('✅ SUCCESS! AI Analysis Pipeline Working!');
      console.log('Suggestions:', st.suggestions);
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