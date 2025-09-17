import { Link } from "wouter";

export default function Signup() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center p-4">
      {/* Logo in top left */}
      <Link 
        href="/"
        className="absolute top-6 left-6 text-2xl font-bold text-[#D4AF37] hover:text-[#FFD700] transition-colors"
        data-testid="logo-home-link"
      >
        FamilyCircle Secure
      </Link>
      
      <div className="bg-[#141414] border border-[#2A2B2E] rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-[#A8A9AD] font-medium text-sm mb-2">FamilyCircle Secure.</div>
          <h1 className="text-2xl font-bold text-[#E7E7EA] mb-2">Create your account</h1>
        </div>

        {/* Google Sign In Button */}
        <button 
          data-testid="button-continue-google"
          className="w-full flex items-center justify-center gap-3 bg-[#1A1B1C] border border-[#2A2B2E] hover:bg-[#212226] rounded-full px-4 py-3 mb-6 transition-colors text-[#E7E7EA]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-[#E7E7EA] font-medium">Continue with Google</span>
        </button>

        {/* See other options */}
        <div className="text-center">
          <Link 
            href="/signup-options"
            data-testid="link-see-other-options"
            className="text-[#A8A9AD] hover:text-[#D4AF37] text-sm font-medium transition-colors"
          >
            See other options
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#A8A9AD] mb-2">
            Already have an account? <Link href="/signin" className="text-[#D4AF37] hover:text-[#FFD700]">Sign in</Link>
          </p>
          <p className="text-xs text-[#A8A9AD]">
            By creating a FamilyCircle Secure account, you agree to our{' '}
            <a href="#" className="text-[#D4AF37] hover:text-[#FFD700]">Terms and Conditions</a>{' '}
            and <a href="#" className="text-[#D4AF37] hover:text-[#FFD700]">Privacy Policy</a>
          </p>
        </div>

        {/* Security Features */}
        <div className="mt-8 bg-[#1A1B1C] border border-[#2A2B2E] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[#E7E7EA] mb-4">Keep your information safe</h3>
          <p className="text-sm text-[#A8A9AD] mb-4">
            Advanced security and compliance that ensures your family information remains private and protected.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#202124] border border-[#2A2B2E] rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                  <path d="M3 12c0 5.5 4.5 10 10 10s10-4.5 10-10"/>
                </svg>
              </div>
              <span className="text-xs text-[#A8A9AD]">Multi-factor authentication</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#202124] border border-[#2A2B2E] rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
              </div>
              <span className="text-xs text-[#A8A9AD]">Tokenization</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#202124] border border-[#2A2B2E] rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                  <path d="M12 1l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"/>
                </svg>
              </div>
              <span className="text-xs text-[#A8A9AD]">Threat detection</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#202124] border border-[#2A2B2E] rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-xs text-[#A8A9AD]">Biometric support</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#202124] border border-[#2A2B2E] rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <span className="text-xs text-[#A8A9AD]">Data encryption</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#202124] border border-[#2A2B2E] rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <span className="text-xs text-[#A8A9AD]">Stolen-password alerts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}