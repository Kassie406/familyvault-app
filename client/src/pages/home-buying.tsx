import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { 
  Home,
  FileText, 
  Shield, 
  Users, 
  Smartphone,
  Star,
  Zap,
  Eye,
  Key,
  Phone,
  Search,
  ChevronRight,
  UserCheck,
  Upload,
  Lock,
  ClipboardList
} from "lucide-react";

export default function HomeBuying() {
  const features = [
    {
      icon: Shield,
      title: "Secure Pre-Approval Documents",
      description: "Your home buying journey needs copies of your last two tax returns. All you remember is that they're buried in your email.",
      detail: "Store tax returns, W-2s, bank statements, and more in FamilyVault's digital vault for quick access during the home loan process."
    },
    {
      icon: Search,
      title: "Track Home Inspection Findings",
      description: "You're negotiating repairs after an inspection, but the seller's agent is referencing a version you don't have in front of you.",
      detail: "Store your home inspection report in FamilyVault so you can review and respond to seller negotiations with confidence."
    },
    {
      icon: Phone,
      title: "Manage Offers and Counteroffers",
      description: "You've made offers on multiple homes and lost track of the terms you submitted for one that's back on the table.",
      detail: "Use FamilyVault to organize offer letters, counteroffers, and agent communications so you're always ready to respond with clarity."
    },
    {
      icon: FileText,
      title: "Keep Home Warranty Records Safe",
      description: "Your furnace breaks down, but the repair is delayed because you can't find the warranty paperwork.",
      detail: "Save your home warranty documents in FamilyVault's Family Operating System® so you can access them instantly."
    }
  ];

  const bottomFeatures = [
    {
      icon: Shield,
      title: "Easily Organize Your Documents",
      description: "Systematic document upload keeps everything organized"
    },
    {
      icon: Smartphone, 
      title: "Use FamilyVault on the Go",
      description: "Access your information anywhere with our mobile app"
    },
    {
      icon: Phone,
      title: "Share With the Right People, the Right Way",
      description: "Control who sees what with granular sharing permissions"
    }
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: "Multi-factor authentication", 
      description: "Secure your account with two-step login protection"
    },
    {
      icon: Eye,
      title: "Threat detection",
      description: "24/7 monitoring proactively guards against threats" 
    },
    {
      icon: Key,
      title: "Tokenization",
      description: "Replaces sensitive data with secure tokens for protection"
    },
    {
      icon: Lock,
      title: "Data encryption", 
      description: "Your data is securely encrypted both stored and in transit"
    },
    {
      icon: Zap,
      title: "Stolen password alerts",
      description: "Get notified instantly if your password is compromised"
    },
    {
      icon: UserCheck,
      title: "Biometric authentication",
      description: "Safe, instant access with fingerprint or face ID"
    }
  ];

  const testimonials = [
    { name: "Sarah M.", title: "Member since 2021", rating: 5, quote: "FamilyVault helped us stay organized throughout our entire home buying process. Everything was at our fingertips!" },
    { name: "David L.", title: "Member since 2022", rating: 5, quote: "Having all our documents secure and accessible made our home purchase so much smoother." },
    { name: "Jennifer K.", title: "Member since 2023", rating: 5, quote: "The inspection tracking feature saved us when we needed to reference specific repair items during negotiations." }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                FamilyVault for Buying a Home
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Keep your home-buying documents secure, private, and accessible at every step — from pre-approval to after move-in day.
              </p>
              <a
                href="/signup"
                data-testid="button-get-started"
                className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
              >
                Get started free
              </a>
            </div>
            <div className="lg:pl-12">
              <div className="bg-orange-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Key className="w-24 h-24 text-orange-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Hand holding house keys at front door</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Home-Buying Journey, Simplified */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Your Home-Buying Journey, Simplified
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            FamilyVault's Family Operating System® brings peace of mind to one of life's biggest purchases — and everything that comes after.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="bg-gray-100 rounded-2xl p-8 h-64 flex items-center justify-center">
                      <div className="text-center">
                        {index === 0 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="text-xs font-medium mb-3">2024 Jane Taylor</div>
                              <div className="space-y-2">
                                <div className="bg-blue-50 rounded p-2">
                                  <div className="text-xs">2024 Joint Return</div>
                                  <div className="font-semibold text-xs">$4</div>
                                </div>
                                <div className="bg-blue-50 rounded p-2">
                                  <div className="text-xs">2023 Joint Return</div>
                                  <div className="font-semibold text-xs">$4</div>
                                </div>
                              </div>
                              <div className="mt-3 text-xs">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
                                  <span>Home Savings</span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 1 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="flex items-center mb-3">
                                <div className="w-6 h-6 bg-blue-100 rounded mr-2 flex items-center justify-center">
                                  <Search className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="font-semibold text-sm">Home Inspection</span>
                              </div>
                              <div className="bg-blue-50 rounded p-3 mb-3">
                                <div className="text-xs font-medium">Track Home Inspection Findings</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  <div>Please see main body of the report below.</div>
                                </div>
                                <div className="mt-2">
                                  <div className="bg-gray-200 rounded h-16 flex items-center justify-center">
                                    <ClipboardList className="w-6 h-6 text-gray-500" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 2 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-xs mx-auto">
                              <div className="bg-gray-800 rounded-t-lg p-3 mb-3">
                                <div className="flex items-center justify-center">
                                  <Smartphone className="w-8 h-8 text-white" />
                                </div>
                              </div>
                              <div className="text-xs">
                                <div className="font-medium mb-2">Property</div>
                                <div className="space-y-1">
                                  <div className="flex items-center p-2 bg-blue-50 rounded">
                                    <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                                    <div>
                                      <div className="font-medium">Twins Cedar</div>
                                      <div className="text-gray-500">$3,500 Below</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center p-2 bg-blue-50 rounded">
                                    <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                                    <div>
                                      <div className="font-medium">Plantation Home</div>
                                      <div className="text-gray-500">$3,500 Above</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 3 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="flex items-center mb-3">
                                <div className="w-6 h-6 bg-blue-100 rounded mr-2 flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="font-semibold text-sm">Property</span>
                              </div>
                              <div className="bg-blue-50 rounded p-3 mb-3">
                                <div className="text-xs font-medium">Home Warranty</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  <div>Appliance</div>
                                  <div>Premium Home</div>
                                  <div>Feb 15, 2024</div>
                                  <div>Location of original: Office desk</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                      <IconComponent className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4 italic">
                      {feature.description}
                    </p>
                    <p className="text-gray-800 font-medium">
                      {feature.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet FamilyVault */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Meet FamilyVault — Your Life, Organized
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            From travel and finances to emergency planning, FamilyVault keeps your key information secure, organized, and within reach so you can focus on what matters.
          </p>
          <a
            href="/signup"
            data-testid="button-get-started-free"
            className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Get started free
          </a>
        </div>
      </section>

      {/* Bottom Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {bottomFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-gray-100 rounded-2xl p-8 h-48 flex items-center justify-center mb-6">
                    <IconComponent className="w-12 h-12 text-[#FFD700]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Your Data Is Always Protected
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your sensitive information stays private and secure with advanced security and compliance practices.
            </p>
            <div className="mt-8">
              <a
                href="/security"
                className="text-[#FFD700] hover:text-[#FFD700]/80 font-medium inline-flex items-center"
              >
                About our security
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <IconComponent className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compliance Badges */}
          <div className="mt-16 text-center">
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-xs font-semibold text-gray-500 px-3 py-1 border rounded">EU GDPR</div>
              <div className="text-xs font-semibold text-gray-500 px-3 py-1 border rounded">SOC 2 TYPE II</div>
              <div className="text-xs font-semibold text-gray-500 px-3 py-1 border rounded">SOC 3</div>
              <div className="text-xs font-semibold text-gray-500 px-3 py-1 border rounded">HIPAA</div>
              <div className="text-xs font-semibold text-gray-500 px-3 py-1 border rounded">CCPA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Members Say About FamilyVault
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="flex justify-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-800 italic mb-4">"{testimonial.quote}"</p>
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3"></div>
                <div className="font-semibold text-sm">{testimonial.name}</div>
                <div className="text-xs text-gray-600">{testimonial.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              No hidden fees. No surprises. Just complete peace of mind.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <p className="text-gray-600 mb-4">For families starting their home buying journey</p>
              <div className="text-3xl font-bold mb-6">$0</div>
              <button
                data-testid="button-get-started-free-plan"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mb-6"
              >
                Get started
              </button>
              <ul className="space-y-2 text-sm">
                <li>• Advanced security</li>
                <li>• 12 items</li>
                <li>• 50GB</li>
                <li>• Autopilot™ by FamilyVault (beta)</li>
                <li>• Tailored onboarding</li>
                <li>• Unlimited collaborators</li>
              </ul>
            </div>

            {/* Silver Plan */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-xl font-bold mb-2">Silver</h3>
              <p className="text-gray-600 mb-4">Collect all the info you'll need to buy a home</p>
              <div className="text-3xl font-bold mb-6">$10</div>
              <button
                data-testid="button-get-started-silver-plan"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mb-6"
              >
                Get started
              </button>
              <ul className="space-y-2 text-sm">
                <li>• Everything in Free plus:</li>
                <li>• Unlimited items</li>
                <li>• Autopilot™ by FamilyVault</li>
                <li>• Liability support</li>
                <li>• Priority customer expert</li>
                <li>• The FamilyVault Marketplace</li>
              </ul>
            </div>

            {/* Gold Plan */}
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-6 border-2 border-purple-300 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Gold</h3>
              <p className="text-gray-600 mb-4">Total peace of mind for your family & your family business</p>
              <div className="text-3xl font-bold mb-6">$20</div>
              <button
                data-testid="button-get-started-gold-plan"
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold mb-6"
              >
                Get started
              </button>
              <ul className="space-y-2 text-sm">
                <li>• Everything in Silver plus:</li>
                <li>• Business information</li>
                <li>• Organization (LLC, S Corp, S Corp, INC, etc.)</li>
                <li>• Entity relationship mapping</li>
                <li>• Friendly expert support</li>
                <li>• And more...</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-gray-600">
            30-day money-back guarantee | We support first responders with a hero discount.
          </div>
        </div>
      </section>

      {/* Essential Resources */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Essential Resources for Buying a Home
            </h2>
            <p className="text-lg text-gray-600">
              Get expert guidance on the steps of the home-buying process — plus the decisions you'll need to make along the way.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Featured Guide */}
            <div className="md:col-span-2">
              <div className="bg-blue-900 rounded-2xl p-8 text-white h-64 flex items-center">
                <div>
                  <div className="text-sm font-semibold text-blue-400 mb-2">FEATURED GUIDE</div>
                  <h3 className="text-2xl font-bold mb-4">
                    The Ultimate Family Home-Buying Guide
                  </h3>
                  <p className="text-gray-300 mb-6">
                    From first offer to final signature, stay ahead of every deadline, document, and decision.
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
                    Download
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Resource */}
            <div>
              <div className="bg-gray-100 rounded-2xl p-6 h-64 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Home className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-sm font-semibold text-blue-600 mb-2">CHECKLIST</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    First-Time Home Buyer Checklist
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Articles */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Articles</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-48 bg-blue-100 flex items-center justify-center">
                  <Users className="w-16 h-16 text-blue-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-blue-600 mb-2">Home Buying</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    When is the Best Time to Buy a House?
                  </h4>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-48 bg-blue-100 flex items-center justify-center">
                  <Home className="w-16 h-16 text-blue-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-blue-600 mb-2">Negotiations</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    How to Make a Strong Offer on a House and Negotiate With Confidence
                  </h4>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-48 bg-blue-100 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-blue-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-blue-600 mb-2">Process</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Tips for a Smooth Home-Buying Process
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}