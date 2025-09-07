import { useEffect, useState } from "react";

type Step = "email" | "code";

export default function NewSignIn() {
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [nonce, setNonce] = useState("");

  // Debug: Log when component mounts (remove in production)
  // useEffect(() => { console.log("🔐 NewSignIn component mounted"); }, []);

  // Warmup with timeout fallback (avoids infinite spinner)
  useEffect(() => {
    let done = false;
    const t = setTimeout(() => !done && setReady(true), 2500);
    (async () => {
      try { await fetch("/login/start", { method: "POST" }); } catch {}
      done = true; clearTimeout(t); setReady(true);
    })();
    return () => clearTimeout(t);
  }, []);

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSending(true);
    try {
      const clean = email.trim().toLowerCase();
      const res = await fetch("/login/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Could not send code");
      }
      const result = await res.json();
      if (!result.ok) {
        throw new Error(result.error || "Could not send code");
      }
      setNonce(result.nonce);
      setEmail(clean);
      setStep("code");
    } catch (err: any) {
      setError(err.message || "Could not send code");
    } finally {
      setSending(false);
    }
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setVerifying(true);
    try {
      const cleanCode = code.trim();
      if (!/^\d{6}$/.test(cleanCode)) throw new Error("Enter the 6-digit code");
      const res = await fetch("/login/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: cleanCode, nonce }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Invalid verification code");
      }
      const result = await res.json();
      if (!result.ok) {
        throw new Error(result.error || "Invalid verification code");
      }
      window.location.href = result.redirect || "/";
    } catch (err: any) {
      setError(err.message || "Invalid verification code");
    } finally {
      setVerifying(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="animate-pulse text-sm opacity-80">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center p-6">
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back.</h1>
          <p className="text-gray-400">Sign in to access your family portal</p>
        </div>

        {step === "email" && (
          <form onSubmit={onSend} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email address*</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 h-14 text-lg rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
              />
            </div>
            
            <button
              type="submit"
              disabled={sending || !email.trim()}
              className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-semibold h-14 text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#D4AF37]/25"
            >
              {sending ? "Sending..." : "Continue"}
            </button>

            <p className="text-center text-gray-500 text-sm">
              We'll email you a 6-digit code to sign in.
            </p>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={onVerify} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-gray-400">
                We sent a 6-digit code to<br />
                <span className="text-white font-medium">{email}</span>
              </p>
            </div>

            <div>
              <input
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit code"
                required
                className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 h-14 text-lg text-center font-mono tracking-widest rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={verifying || code.length !== 6}
              className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-semibold h-14 text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#D4AF37]/25"
            >
              {verifying ? "Verifying..." : "Verify & Sign In"}
            </button>

            <button
              type="button"
              onClick={() => { setCode(""); setStep("email"); }}
              className="w-full text-gray-400 hover:text-white h-12 rounded-xl hover:bg-white/10 transition-colors"
            >
              ← Back to email
            </button>

            <p className="text-center text-gray-500 text-sm">
              Code expires in 10 minutes
            </p>
          </form>
        )}

        {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>}
      </div>
    </div>
  );
}