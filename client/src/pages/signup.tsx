import { useState } from "react";
import { Shield, Lock, Eye, Server, AlertTriangle, Smartphone, CheckCircle } from "lucide-react";

export default function Signup() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email signup logic here
    console.log("Email signup:", { email, password, firstName, lastName });
  };

  const securityFeatures = [
    { name: "Multi-factor authentication", icon: Shield },
    { name: "Tokenization", icon: Server },
    { name: "Threat detection", icon: AlertTriangle },
    { name: "Biometric support", icon: Smartphone },
    { name: "Data encryption", icon: Lock },
    { name: "Stolen-password alerts", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Sign Up Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 h-fit">
            {/* Logo */}
            <div className="text-center mb-8">
              <span className="text-3xl font-bold text-primary">FamilyVault</span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              Create your account
            </h1>

            {!showEmailForm ? (
              <>
                {/* Social Sign Up */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center py-4 px-6 border border-gray-300 rounded-lg shadow-sm bg-white text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors mb-6"
                  data-testid="google-signup"
                >
                  <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={() => setShowEmailForm(true)}
                  className="w-full text-center text-primary hover:text-secondary font-medium text-lg underline"
                  data-testid="see-other-options"
                >
                  See other options
                </button>
              </>
            ) : (
              <>
                {/* Email Sign Up Form */}
                <form onSubmit={handleEmailSignup} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name*
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="First name"
                        data-testid="first-name-input"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name*
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Last name"
                        data-testid="last-name-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address*
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Enter your email"
                      data-testid="signup-email-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password*
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Create a password"
                      data-testid="signup-password-input"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      At least 8 characters with numbers, letters, and symbols
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password*
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Confirm your password"
                      data-testid="confirm-password-input"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                    data-testid="create-account-button"
                  >
                    Create Account
                  </button>
                </form>

                <button
                  onClick={() => setShowEmailForm(false)}
                  className="w-full text-center text-gray-600 hover:text-primary font-medium mt-4"
                  data-testid="back-to-social"
                >
                  ← Back to social options
                </button>
              </>
            )}

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a 
                  href="/login" 
                  className="font-medium text-primary hover:text-secondary"
                  data-testid="sign-in-link"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>

          {/* Right Column - Security Information */}
          <div className="space-y-8">
            {/* Security Features */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Keep your information safe
              </h2>
              <p className="text-gray-600 mb-8">
                Advanced security and compliance that ensures your family information remains private and protected.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {securityFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {feature.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Data Protection Explanation */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Increased security through redaction
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Highly sensitive data is entered while secured by 256-bit encryption and 2-factor authentication.
                </p>
                <p>
                  The data is then instantly redacted and encrypted by third-party security systems.
                </p>
                <p>
                  Only your two-factor login can produce the token needed to reveal your redacted data.
                </p>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How is my redacted data stored?
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Redacted data is stored on encrypted servers and protected by an industry leading security 
                    technique called "aliasing". Aliasing removes sensitive data from FamilyVault servers and 
                    replaces it with a corresponding alias keeping the sensitive information protected and 
                    separate from the member's account.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Can anyone else access my redacted data?
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Only you can access your redacted data. To do so you must be logged in to your account 
                    using 2-factor authentication.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How can I learn more about security at FamilyVault?
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    For a deep dive on security at FamilyVault, visit{' '}
                    <a href="/security" className="text-primary hover:text-secondary underline">
                      familyvault.com/security
                    </a>
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed mt-2">
                    If you have any questions or concerns, please get in touch with us at:{' '}
                    <a href="mailto:security@familyvault.com" className="text-primary hover:text-secondary underline">
                      security@familyvault.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Value Proposition */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your data becomes an item when you secure it with FamilyVault
              </h2>
              <p className="text-gray-700 mb-6">
                Every item you add to FamilyVault is one less piece of information you have to worry about. 
                All items are protected, organized, and optimized.
              </p>
              <p className="text-sm text-gray-600">
                Your account is always secure.{' '}
                <a href="/security" className="text-primary hover:text-secondary underline">
                  familyvault.com/security
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}