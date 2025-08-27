import { Link } from "wouter";

export default function SignupOptions() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center p-4">
      {/* Logo in top left */}
      <Link 
        href="/"
        className="absolute top-6 left-6 text-2xl font-bold text-[#D4AF37] hover:text-[#FFD700] transition-colors"
        data-testid="logo-home-link"
      >
        FamilyVault
      </Link>
      
      <div className="bg-[#141414] border border-[#2A2B2E] rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#E7E7EA] mb-2">Create your account</h1>
        </div>

        {/* Google Sign In Button */}
        <button 
          data-testid="button-continue-google-full"
          className="w-full flex items-center justify-center gap-3 bg-[#1A1B1C] border border-[#2A2B2E] hover:bg-[#212226] rounded-full px-4 py-3 mb-4 transition-colors text-[#E7E7EA]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-[#E7E7EA] font-medium">Continue with Google</span>
        </button>

        {/* Apple Sign In Button */}
        <button 
          data-testid="button-continue-apple"
          className="w-full flex items-center justify-center gap-3 bg-[#1A1B1C] border border-[#2A2B2E] hover:bg-[#212226] rounded-full px-4 py-3 mb-6 transition-colors text-[#E7E7EA]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#E7E7EA">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          <span className="text-[#E7E7EA] font-medium">Continue with Apple</span>
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-[#2A2B2E]"></div>
          <span className="px-4 text-sm text-[#A8A9AD]">OR</span>
          <div className="flex-1 border-t border-[#2A2B2E]"></div>
        </div>

        {/* Email Input */}
        <div className="mb-6">
          <input
            type="email"
            placeholder="Email address*"
            data-testid="input-email"
            className="w-full px-4 py-3 bg-[#1A1B1C] border border-[#2A2B2E] text-[#E7E7EA] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all placeholder-[#A8A9AD]"
          />
        </div>

        {/* Continue Button */}
        <button 
          data-testid="button-continue-email"
          className="w-full bg-[#D4AF37] hover:bg-[#FFD700] text-black font-medium py-3 rounded-full transition-colors mb-6"
        >
          Continue
        </button>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-[#A8A9AD] mb-2">
            Already have an account? <Link href="/signin" className="text-[#D4AF37] hover:text-[#FFD700]">Sign in</Link>
          </p>
          <p className="text-xs text-[#A8A9AD]">
            By creating a FamilyVault account, you agree to our{' '}
            <a href="#" className="text-[#D4AF37] hover:text-[#FFD700]">Terms and Conditions</a>{' '}
            and <a href="#" className="text-[#D4AF37] hover:text-[#FFD700]">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}