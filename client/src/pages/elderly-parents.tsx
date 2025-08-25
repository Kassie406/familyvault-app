import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { 
  Heart, 
  DollarSign, 
  Phone, 
  Users, 
  FileText,
  Smartphone,
  Shield,
  Star,
  Zap,
  Eye,
  Key,
  Download,
  BookOpen,
  ChevronRight,
  Stethoscope,
  CreditCard,
  UserCheck,
  Lock
} from "lucide-react";

export default function ElderlyParents() {
  const features = [
    {
      icon: Heart,
      title: "Coordinate Medical Care",
      description: "You missed a dose of a parent's medication and later realized it caused a significant health complication.",
      detail: "Easily keep track of your parents' prescriptions, doctor appointments, and medical directives."
    },
    {
      icon: DollarSign,
      title: "Monitor or Take Over Finances", 
      description: "Some of your parents' important bills went unpaid because you didn't have information about their finances.",
      detail: "Collaborate with your parents to help manage their finances through FamilyVault, including bills, insurance policies, and taxes."
    },
    {
      icon: Phone,
      title: "Be Prepared for an Emergency",
      description: "A parent had a health crisis and couldn't speak for themselves, and you didn't know how to contact their business partners.",
      detail: "Store and share emergency contacts in the Family Operating System so the right people are informed when it matters most."
    },
    {
      icon: Users,
      title: "Keep Family Members Informed", 
      description: "Critical decisions were made with some family members out of the loop, leading to misunderstandings and resentment.",
      detail: "Give multiple family members equal access to your parents' financial data, medical information, and end-of-life care plans."
    }
  ];

  const bottomFeatures = [
    {
      icon: Shield,
      title: "Back Up Your Data Easily",
      description: "Automatic cloud backup keeps everything safe"
    },
    {
      icon: Smartphone, 
      title: "Use FamilyVault on the Go",
      description: "Access your information anywhere with our mobile app"
    },
    {
      icon: Phone,
      title: "Connect With an Expert",
      description: "Get personalized help organizing your family's documents"
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
    { name: "Sarah M.", title: "Daughter & Caregiver", rating: 5 },
    { name: "David L.", title: "Son & Financial POA", rating: 5 },
    { name: "Maria C.", title: "Healthcare Advocate", rating: 5 },
    { name: "Robert K.", title: "Family Coordinator", rating: 5 },
    { name: "Jennifer R.", title: "Elder Care Specialist", rating: 5 }
  ];

  const articles = [
    {
      title: "Helping Elderly Parents: The Complete Guide", 
      description: "Essential steps for navigating the complexities of elder care"
    },
    {
      title: "Should Elderly Parents Sign Over Their House? Pros and Cons",
      description: "Important legal and financial considerations for property transfers"
    },
    {
      title: "Expert Q&A: Knowing When It's Time to Take Over Your Elderly Parents' Finances",
      description: "Professional guidance on managing aging parents' financial affairs"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                FamilyVault for Helping Elderly Parents
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Caring for your aging parents doesn't have to be overwhelming — knowing when to act and what steps to take can make the journey less daunting.
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
              <div className="bg-pink-50 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-24 h-24 text-pink-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Adult child caring for elderly parent in kitchen</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conquer Challenges */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Conquer the Challenges of Elder Care
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            FamilyVault helps you take charge of your parents' important information and make sure they get the care and support they deserve.
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
                              <div className="flex items-center mb-3">
                                <Stethoscope className="w-5 h-5 text-blue-600 mr-2" />
                                <span className="font-semibold text-sm">Medical Directive</span>
                              </div>
                              <div className="text-xs text-gray-600 text-left space-y-1">
                                <div>Sarah Reynolds</div>
                                <div>Date required: Feb 12, 2024</div>
                                <div>Location of original: Office desk</div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 1 && (
                          <>
                            <div className="bg-black rounded-2xl p-4 shadow-lg max-w-xs mx-auto">
                              <div className="bg-blue-600 text-white text-center py-2 rounded-t text-sm font-semibold mb-3">
                                Finance
                              </div>
                              <div className="space-y-2 text-xs text-white">
                                <div className="flex justify-between">
                                  <span>🏦 Chase Premium Savings</span>
                                  <span>$12,450</span>
                                </div>
                                <div className="flex justify-between"> 
                                  <span>💳 Chase High Interest</span>
                                  <span>$8,200</span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 2 && (
                          <>
                            <div className="bg-black rounded-2xl p-4 shadow-lg max-w-xs mx-auto text-white">
                              <div className="text-center mb-4">
                                <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                                  <span className="text-2xl">👤</span>
                                </div>
                                <div className="font-semibold">David Reynolds</div>
                                <div className="text-sm text-gray-400">Financial Agent</div>
                              </div>
                              <div className="text-xs space-y-1">
                                <div>(555) 123-4567</div>
                                <div>david.reynolds@email.com</div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 3 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="text-sm font-semibold mb-3">Family Access</div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full mr-2"></div>
                                    <div>
                                      <div className="text-xs font-medium">Leo Carter</div>
                                      <div className="text-xs text-gray-500">Son</div>
                                    </div>
                                  </div>
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Full access</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-purple-500 rounded-full mr-2"></div>
                                    <div>
                                      <div className="text-xs font-medium">Mika Carter</div>
                                      <div className="text-xs text-gray-500">Daughter</div>
                                    </div>
                                  </div>
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Partial access</span>
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

          <div className="grid md:grid-cols-5 gap-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3"></div>
                <div className="font-semibold text-sm">{testimonial.name}</div>
                <div className="text-xs text-gray-600 mb-2">{testimonial.title}</div>
                <div className="flex justify-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                </div>
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
              <p className="text-gray-600 mb-4">For families wanting to organize their parents' most important information.</p>
              <div className="text-3xl font-bold mb-6">$0</div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mb-6">
                Get started
              </button>
              <ul className="space-y-2 text-sm">
                <li>• Advanced security</li>
                <li>• 10 items</li>
                <li>• 500MB</li>
                <li>• Autopilot™ by FamilyVault (free)</li>
                <li>• Unlimited collaborators</li>
              </ul>
            </div>

            {/* Silver Plan */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-xl font-bold mb-2">Silver</h3>
              <p className="text-gray-600 mb-4">For more organization for your parents' care and legacy.</p>
              <div className="text-3xl font-bold mb-6">$10</div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mb-6">
                Get started
              </button>
              <ul className="space-y-2 text-sm">
                <li>• Everything in Free plus:</li>
                <li>• Unlimited items</li>
                <li>• Autopilot™ by FamilyVault</li>
                <li>• Archiving support</li>
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
              <p className="text-gray-600 mb-4">Breathe easy in your parents' personal and business legacies without limits.</p>
              <div className="text-3xl font-bold mb-6">$20</div>
              <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold mb-6">
                Get started
              </button>
              <ul className="space-y-2 text-sm">
                <li>• Everything in Silver plus:</li>
                <li>• Business information</li>
                <li>• Organization (LLC, S Corp, S Corp, INC, etc.)</li>
                <li>• Friendly expert support</li>
                <li>• And more...</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-gray-600">
            30-day money-back guarantee | We support first responders with a Revu discount.
          </div>
        </div>
      </section>

      {/* Essential Resources */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Essential Resources for Supporting Your Elderly Parents
            </h2>
            <p className="text-lg text-gray-600">
              Explore expert advice for helping your aging parents through important life decisions, managing their finances, and safeguarding their well-being.
            </p>
          </div>

          {/* Featured Checklist */}
          <div className="bg-gray-100 rounded-2xl p-8 lg:p-12 mb-16">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <div className="w-48 h-64 bg-[#FFD700]/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
                    <p className="text-gray-600">Checklist Cover</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#FFD700] mb-2">FEATURED CHECKLIST</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Helping Your Elderly Parents
                </h3>
                <p className="text-gray-600 mb-6">
                  A helpful checklist covering healthcare, legal, and financial essentials — so you can stay organized and focused on supporting your parents.
                </p>
                <button
                  data-testid="button-download-checklist"
                  className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Articles */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-8">Articles</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <Users className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-2 leading-snug">
                      {article.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {article.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}