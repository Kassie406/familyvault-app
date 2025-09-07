import { useState } from 'react';

export default function NewSignIn() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'login' | 'verify'>('login');
  const [loading, setLoading] = useState(false);
  const [nonce, setNonce] = useState('');

  async function handleGoogleLogin() {
    window.location.href = '/auth/google';
  }

  async function handleEmailStart() {
    if (!email.trim()) {
      alert('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/login/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const result = await response.json();
      if (!result.ok) {
        alert(result.error || 'Failed to send verification code');
        return;
      }

      setNonce(result.nonce);
      setStep('verify');
    } catch (error) {
      alert('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode() {
    if (!code.trim()) {
      alert('Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/login/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, nonce })
      });

      const result = await response.json();
      
      if (!result.ok) {
        alert(result.error || 'Invalid verification code');
        return;
      }

      // Success - redirect to portal
      window.location.href = result.redirect || '/';
    } catch (error) {
      alert('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleBackToEmail() {
    setStep('login');
    setCode('');
    setNonce('');
  }

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Check your email</h1>
            <p className="text-gray-400">
              We sent a 6-digit code to<br />
              <span className="text-white font-medium">{email}</span>
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 h-14 text-lg text-center font-mono tracking-widest rounded-xl px-4"
              disabled={loading}
            />

            <button
              onClick={handleVerifyCode}
              disabled={loading || code.length !== 6}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold h-14 text-lg rounded-xl disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>

            <button
              onClick={handleBackToEmail}
              className="w-full text-gray-400 hover:text-white h-12"
              disabled={loading}
            >
              ← Back to email
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Code expires in 10 minutes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back.</h1>
          <p className="text-gray-400">Sign in to access your family portal</p>
        </div>

        <div className="space-y-4">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-gray-100 text-black font-semibold h-14 text-lg rounded-xl flex items-center justify-center gap-3"
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          {/* Email Sign In */}
          <input
            type="email"
            placeholder="Email address*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 h-14 text-lg rounded-xl px-4"
            disabled={loading}
          />

          <button
            onClick={handleEmailStart}
            disabled={loading || !email.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-14 text-lg rounded-xl disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Continue'}
          </button>

          <p className="text-center text-gray-500 text-sm mt-4">
            We'll email you a 6-digit code to sign in.
          </p>
        </div>
      </div>
    </div>
  );
}