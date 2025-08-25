import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { 
  FileText, 
  Shield, 
  Users, 
  Smartphone,
  Star,
  Zap,
  Eye,
  Key,
  Phone,
  Heart,
  ChevronRight,
  UserCheck,
  Upload,
  Lock
} from "lucide-react";

export default function EstatePlanning() {
  const features = [
    {
      icon: Shield,
      title: "Store and Share Estate Plans",
      description: "You're worried that your family won't know where to find your will and trust documents when they're needed.",
      detail: "Store docs with FamilyVault and set up legacy access, ensuring your family will get your important information after your passing."
    },
    {
      icon: Heart,
      title: "Organize Medical Directives",
      description: "You don't know how to ensure doctors will follow your healthcare wishes if you can't speak for yourself during an emergency.",
      detail: "Keep your living will and other advance directives with FamilyVault, and share them with your doctor, hospital, and family."
    },
    {
      icon: Phone,
      title: "Manage Power of Attorney Documents",
      description: "You've named someone to handle your finances in an emergency, but they don't know where to find your important documents.",
      detail: "FamilyVault's Family Operating System® ensures your financial and legal documents are secure, accessible, and shareable."
    },
    {
      icon: Users,
      title: "Prepare Important Contacts",
      description: "Your family may struggle to reach your lawyer or financial advisor when they need them most.",
      detail: "Store and share legal, financial, and medical contacts securely in the Family Operating System®."
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
    { name: "Patricia H.", title: "Member since 2022", rating: 5, quote: "Having all our estate documents organized in FamilyVault gives our family such peace of mind." },
    { name: "Michael R.", title: "Member since 2021", rating: 5, quote: "The legacy access feature ensures our children will have what they need when the time comes." },
    { name: "Linda K.", title: "Member since 2023", rating: 5, quote: "FamilyVault made organizing our wills and trusts so much easier than keeping paper copies." }
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
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                FamilyVault for Estate Planning
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                What if something happened to you? Secure and organize your family's vital information for your loved ones when they need it most.
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
              <div className="bg-blue-50 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-24 h-24 text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Happy family with children by the water</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Estate Planning, Simplified */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Your Estate Planning, Simplified
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            FamilyVault's Family Operating System® helps you ensure your wishes are clear, your assets are protected, and your family has guidance for the future.
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
                              <div className="text-xs font-medium mb-3">Mary Reynolds Will</div>
                              <div className="space-y-2">
                                <div className="bg-blue-50 rounded p-2">
                                  <div className="text-xs">Last updated</div>
                                  <div className="font-semibold text-xs">Jan 15, 2024</div>
                                </div>
                                <div className="bg-blue-50 rounded p-2">
                                  <div className="text-xs">Location of original</div>
                                  <div className="text-xs">Attorney: Office desk</div>
                                </div>
                                <div className="bg-green-50 rounded p-2">
                                  <div className="text-xs font-medium text-green-800">Responsive responsible</div>
                                  <div className="text-xs text-green-600">Living Trust</div>
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
                                  <FileText className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="font-semibold text-sm">Medical Directive</span>
                              </div>
                              <div className="bg-blue-50 rounded p-3 mb-3">
                                <div className="text-xs font-medium">Sarah Reynolds</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  <div>Date created: Jan 15, 2024</div>
                                  <div>Location of original: Office desk</div>
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
                                <div className="font-medium mb-2">Finance</div>
                                <div className="space-y-1">
                                  <div className="flex items-center p-2 bg-blue-50 rounded">
                                    <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
                                    <span>E*Trade Premium Savings</span>
                                  </div>
                                  <div className="flex items-center p-2 bg-blue-50 rounded">
                                    <div className="w-3 h-3 bg-blue-400 rounded mr-2"></div>
                                    <span>Chase High Interest Savings</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 3 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="text-xs mb-3">
                                <div className="font-semibold mb-2">Full access</div>
                                <div className="flex items-center mb-2">
                                  <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                                  <span>David Reynolds</span>
                                  <ChevronRight className="w-3 h-3 ml-auto" />
                                </div>
                                
                                <div className="font-semibold mb-2 mt-3">Partial access</div>
                                <div className="flex items-center mb-1">
                                  <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                                  <span>Christine Marcello</span>
                                  <ChevronRight className="w-3 h-3 ml-auto" />
                                </div>
                                <div className="flex items-center">
                                  <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                                  <span>Sabrina Pless</span>
                                  <ChevronRight className="w-3 h-3 ml-auto" />
                                </div>
                                
                                <div className="font-semibold mb-2 mt-3">Legacy access</div>
                                <div className="flex items-center">
                                  <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                                  <span>Anna Reynolds</span>
                                  <ChevronRight className="w-3 h-3 ml-auto" />
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
              <p className="text-gray-600 mb-4">For individuals getting started with estate planning</p>
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
              <p className="text-gray-600 mb-4">Comprehensive estate organization for you and your family</p>
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
              <p className="text-gray-600 mb-4">Total estate and legacy planning - personal and business</p>
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
              Essential Resources for Planning Your Estate
            </h2>
            <p className="text-lg text-gray-600">
              Explore expert advice on the decisions you'll need to make about your assets, your healthcare, and your family's future.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Featured Article */}
            <div className="md:col-span-2">
              <div className="bg-blue-900 rounded-2xl p-8 text-white h-64 flex items-center">
                <div>
                  <div className="text-sm font-semibold text-blue-400 mb-2">FEATURED CHECKLIST</div>
                  <h3 className="text-2xl font-bold mb-4">
                    Get Your Estate Plan on Track
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Unlock a step-by-step checklist that helps you address all the essentials, from wills and trusts to healthcare directives.
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
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-sm font-semibold text-blue-600 mb-2">GUIDE</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Estate Planning: A Comprehensive Guide
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
                  <div className="text-sm font-semibold text-blue-600 mb-2">Estate Planning</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Planning: A Comprehensive Guide
                  </h4>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-48 bg-blue-100 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-blue-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-blue-600 mb-2">Legal Documents</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    What is a Last Will and Testament?
                  </h4>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-48 bg-blue-100 flex items-center justify-center">
                  <Shield className="w-16 h-16 text-blue-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-blue-600 mb-2">Estate Mistakes</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Common Mistakes When Writing a Will
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