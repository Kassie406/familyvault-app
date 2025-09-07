import { useEffect, useState } from "react";

export default function NewSignIn() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let done = false;

    // helper: timeout after 2.5s to avoid infinite spinner
    const t = setTimeout(() => {
      if (!done) setReady(true);
    }, 2500);

    (async () => {
      try {
        // optional: your app's warmup call; ok if it fails
        const r = await fetch("/login/start", { method: "POST" });
        // ignore body; we just want the form to show regardless
      } catch (e) {
        // ignore
      } finally {
        done = true;
        clearTimeout(t);
        setReady(true);
      }
    })();

    return () => clearTimeout(t);
  }, []);

  if (!ready) {
    return (
      <div style={{minHeight:"100vh",display:"grid",placeItems:"center",color:"#fff",backgroundColor:"#000"}}>
        <div>Loading…</div>
      </div>
    );
  }

  // ——— the actual form ———
  return (
    <div style={{minHeight:"100vh",display:"grid",placeItems:"center",color:"#fff",backgroundColor:"#000"}}>
      <div style={{width:360,padding:"20px",backgroundColor:"rgba(255,255,255,0.05)",borderRadius:"12px"}}>
        <h1 style={{marginBottom:"20px",textAlign:"center"}}>Welcome back</h1>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value.trim().toLowerCase();
          const res = await fetch("/login/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
          });
          if (!res.ok) { 
            alert("Could not send code"); 
            return; 
          }
          const result = await res.json();
          if (!result.ok) {
            alert(result.error || 'Failed to send verification code');
            return;
          }
          // Navigate to verification step - we'll handle this inline for now
          (e.target as HTMLFormElement).style.display = 'none';
          const codeForm = document.createElement('div');
          codeForm.innerHTML = \`
            <h2 style="margin-bottom: 20px; text-align: center;">Check your email</h2>
            <p style="margin-bottom: 20px; text-align: center; color: #ccc;">We sent a 6-digit code to<br><strong>\${email}</strong></p>
            <form id="code-form">
              <input id="code-input" type="text" inputmode="numeric" maxlength="6" placeholder="Enter 6-digit code" required
                     style="width: 100%; padding: 12px; margin: 12px 0; text-align: center; font-size: 18px; font-family: monospace; letter-spacing: 2px;" />
              <button type="submit" style="width: 100%; padding: 12px; background: #D4AF37; color: black; border: none; border-radius: 6px; font-weight: bold;">
                Verify & Sign In
              </button>
            </form>
          \`;
          e.target.parentNode.appendChild(codeForm);
          
          document.getElementById('code-form').onsubmit = async (codeEvent) => {
            codeEvent.preventDefault();
            const code = (document.getElementById('code-input') as HTMLInputElement).value.trim();
            const verifyRes = await fetch("/login/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, code, nonce: result.nonce })
            });
            const verifyResult = await verifyRes.json();
            if (!verifyResult.ok) {
              alert(verifyResult.error || 'Invalid verification code');
              return;
            }
            window.location.href = verifyResult.redirect || '/';
          };
        }}>
          <input name="email" type="email" placeholder="Enter your email address" required
                 style={{width:"100%",padding:"12px",margin:"12px 0",borderRadius:"6px",border:"1px solid #444",backgroundColor:"#333",color:"white"}}/>
          <button type="submit" style={{width:"100%",padding:"12px",backgroundColor:"#007bff",color:"white",border:"none",borderRadius:"6px",fontWeight:"bold"}}>
            Continue
          </button>
        </form>
        <p style={{textAlign:"center",color:"#888",fontSize:"14px",marginTop:"16px"}}>
          We'll email you a 6-digit code to sign in.
        </p>
      </div>
    </div>
  );
}