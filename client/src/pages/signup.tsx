import { Link } from "wouter";

export default function Signup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E3E7ED] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-[#6B7280] font-medium text-sm mb-2">FamilyVault.</div>
          <h1 className="text-2xl font-bold text-[#1F2937] mb-2">Create your account</h1>
        </div>

        {/* Google Sign In Button */}
        <button 
          data-testid="button-continue-google"
          className="w-full flex items-center justify-center gap-3 bg-white border border-[#D1D5DB] hover:border-[#9CA3AF] rounded-lg px-4 py-3 mb-6 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-[#374151] font-medium">Continue with Google</span>
        </button>

        {/* See other options */}
        <div className="text-center">
          <Link 
            href="/signup-options"
            data-testid="link-see-other-options"
            className="text-[#6B7280] hover:text-[#374151] text-sm font-medium transition-colors"
          >
            See other options
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#6B7280] mb-2">
            Already have an account? <Link href="/signin" className="text-[#3B82F6] hover:underline">Sign in</Link>
          </p>
          <p className="text-xs text-[#6B7280]">
            By creating a FamilyVault account, you agree to our{' '}
            <a href="#" className="text-[#3B82F6] hover:underline">Terms and Conditions</a>{' '}
            and <a href="#" className="text-[#3B82F6] hover:underline">Privacy Policy</a>
          </p>
        </div>

        {/* Security Features */}
        <div className="mt-8 bg-[#F3F4F6] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Keep your information safe</h3>
          <p className="text-sm text-[#6B7280] mb-4">
            Advanced security and compliance that ensures your family information remains private and protected.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#E5E7EB] rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                  <path d="M3 12c0 5.5 4.5 10 10 10s10-4.5 10-10"/>
                </svg>
              </div>
              <span className="text-xs text-[#6B7280]">Multi-factor authentication</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#E5E7EB] rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
              </div>
              <span className="text-xs text-[#6B7280]">Tokenization</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#E5E7EB] rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                  <path d="M12 1l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"/>
                </svg>
              </div>
              <span className="text-xs text-[#6B7280]">Threat detection</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#E5E7EB] rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-xs text-[#6B7280]">Biometric support</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#E5E7EB] rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <span className="text-xs text-[#6B7280]">Data encryption</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#E5E7EB] rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <span className="text-xs text-[#6B7280]">Stolen-password alerts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}