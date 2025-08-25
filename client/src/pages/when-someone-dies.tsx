import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { 
  Leaf,
  Heart, 
  Shield, 
  Users, 
  Smartphone,
  Star,
  Zap,
  Eye,
  Key,
  Phone,
  FileText,
  ChevronRight,
  UserCheck,
  Upload,
  Lock,
  CreditCard,
  Bell,
  Building,
  ClipboardList
} from "lucide-react";

export default function WhenSomeoneDies() {
  const features = [
    {
      icon: Users,
      title: "Share Estate Information Securely",
      description: "Your siblings need access to your late father's estate documents, but sending important information via email feels unsafe.",
      detail: "Store and share wills, living trust documents, financial records, and more in FamilyVault's Family Operating System®."
    },
    {
      icon: ClipboardList,
      title: "Navigate Probate Requirements",
      description: "You are overwhelmed by probate after your sister's death, struggling to organize all of the documents you've collected.",
      detail: "After a death, upload your loved one's important information to the Family Operating System® simplifying estate settlement."
    },
    {
      icon: Bell,
      title: "Manage Bills and Accounts",
      description: "You're trying to stay on top of your late spouse's bills, worried that a missed payment could cause problems.",
      detail: "The Family Operating System's automated reminders help you keep track of important deadlines and expiration dates."
    },
    {
      icon: Phone,
      title: "Notify Important Contacts",
      description: "Your mother had an extensive network of business partners who should be informed of her death, but you don't know their names.",
      detail: "Encourage your loved ones to store and share their contacts with you through FamilyVault ahead of time, so you can be prepared."
    }
  ];

  const bottomFeatures = [
    {
      icon: Upload,
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
    { name: "Michael B.", title: "Member since 2022", rating: 5, quote: "After losing my wife, FamilyVault made managing her estate so much easier. Everything was organized and accessible when I needed it most." },
    { name: "Sarah K.", title: "Member since 2021", rating: 5, quote: "The document sharing features helped our family coordinate during a difficult time. We could focus on grieving instead of searching for paperwork." },
    { name: "David M.", title: "Member since 2023", rating: 5, quote: "Having all my father's financial information organized in FamilyVault saved us months of stress during probate." }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Leaf className="w-6 h-6 text-purple-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                FamilyVault for When Someone Dies
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                When you've lost someone close to you, grief can be overwhelming — but with FamilyVault's help, managing their estate doesn't have to be.
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
              <div className="bg-purple-50 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Leaf className="w-24 h-24 text-purple-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Snow drop flowers in spring garden</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Organized After a Death in the Family */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Getting Organized After a Death in the Family
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            The to-do list after a loved one's passing can feel endless. Here's how FamilyVault helps you manage key tasks with clarity and support.
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
                              <div className="text-xs mb-3">
                                <div className="flex items-center mb-2">
                                  <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
                                  <span className="font-semibold">Choose a collaborator</span>
                                </div>
                                <div className="bg-blue-50 rounded p-2 mb-2">
                                  <div className="flex items-center text-xs">
                                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                                    <span>Mary Reynolds</span>
                                    <span className="ml-auto text-gray-500">Sister</span>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 mb-3">Add someone new</div>
                                <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Send now</button>
                              </div>
                              <div className="border-t pt-3">
                                <div className="flex items-center text-xs">
                                  <div className="w-4 h-4 bg-blue-100 rounded mr-2 flex items-center justify-center">
                                    <FileText className="w-2 h-2 text-blue-600" />
                                  </div>
                                  <div>
                                    <div className="font-semibold">Share Estate Information Securely</div>
                                    <div className="text-gray-500">Your siblings need access to your late father's estate documents, but sending important information via email feels unsafe.</div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-600 mt-2">Store and share wills, living trust documents, financial records, and more in FamilyVault's Family Operating System®.</div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 1 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="text-xs">
                                <div className="flex items-center mb-3">
                                  <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
                                  <span className="font-semibold">Accounts</span>
                                </div>
                                <div className="space-y-2 mb-3">
                                  <div className="flex items-center">
                                    <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                                    <span>Mary Reynolds 401k</span>
                                    <ChevronRight className="w-3 h-3 ml-auto" />
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                                    <span>Mary Reynolds at Bank of America</span>
                                    <ChevronRight className="w-3 h-3 ml-auto" />
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                                    <span>Planning Docs</span>
                                    <ChevronRight className="w-3 h-3 ml-auto" />
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                                    <span>Family Operating</span>
                                    <ChevronRight className="w-3 h-3 ml-auto" />
                                  </div>
                                </div>
                                
                                <div className="border-t pt-3">
                                  <div className="flex items-center mb-2">
                                    <div className="w-4 h-4 bg-blue-100 rounded mr-2 flex items-center justify-center">
                                      <ClipboardList className="w-2 h-2 text-blue-600" />
                                    </div>
                                    <span className="font-semibold">Navigate Probate Requirements</span>
                                  </div>
                                  <div className="text-gray-600">You are overwhelmed by probate after your sister's death, struggling to organize all of the documents you've collected.</div>
                                  <div className="text-gray-800 mt-2">After a death, upload your loved one's important information to the Family Operating System® simplifying estate settlement.</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 2 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-xs mx-auto">
                              <div className="text-xs">
                                <div className="flex items-center mb-3">
                                  <Bell className="w-4 h-4 text-blue-600 mr-2" />
                                  <span className="font-semibold">Manage Bills and Accounts</span>
                                </div>
                                <div className="bg-yellow-50 rounded p-2 mb-3">
                                  <div className="flex items-center">
                                    <Building className="w-3 h-3 text-yellow-600 mr-2" />
                                    <div>
                                      <div className="font-medium">Pay Homeowners Insurance</div>
                                      <div className="text-yellow-600">Steel Farm</div>
                                      <div className="text-gray-500">June 1, 2025 • in 87 days</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-gray-600 mb-2">You're trying to stay on top of your late spouse's bills, worried that a missed payment could cause problems.</div>
                                <div className="text-gray-800">The Family Operating System's automated reminders help you keep track of important deadlines and expiration dates.</div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 3 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="text-xs">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="font-semibold">Search 115 contacts</span>
                                  <div className="text-gray-400">📞</div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center">
                                    <div className="w-6 h-6 bg-gray-300 rounded-full mr-3"></div>
                                    <div>
                                      <div className="font-medium">Sandra Bennett</div>
                                      <div className="text-gray-500">+1 881 859 5424</div>
                                    </div>
                                    <div className="ml-auto text-gray-400">advisor</div>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-6 h-6 bg-gray-300 rounded-full mr-3"></div>
                                    <div>
                                      <div className="font-medium">Andy Lynch</div>
                                      <div className="text-gray-500">+1 884 867 7860</div>
                                    </div>
                                    <div className="ml-auto text-gray-400">analyzer</div>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-6 h-6 bg-gray-300 rounded-full mr-3"></div>
                                    <div>
                                      <div className="font-medium">Pamela Newman</div>
                                      <div className="text-gray-500">+1 888 999 8961</div>
                                    </div>
                                    <div className="ml-auto text-gray-400">advisor</div>
                                  </div>
                                </div>
                                
                                <div className="border-t pt-3 mt-3">
                                  <div className="flex items-center mb-2">
                                    <Phone className="w-4 h-4 text-blue-600 mr-2" />
                                    <span className="font-semibold">Notify Important Contacts</span>
                                  </div>
                                  <div className="text-gray-600">Your mother had an extensive network of business partners who should be informed of her death, but you don't know their names.</div>
                                  <div className="text-gray-800 mt-2">Encourage your loved ones to store and share their contacts with you through FamilyVault ahead of time, so you can be prepared.</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                      <IconComponent className="w-4 h-4 text-purple-600" />
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
              <p className="text-gray-600 mb-4">For families starting the process of organizing after a loss</p>
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
              <p className="text-gray-600 mb-4">A complete record of your family's life, always accessible</p>
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
              <p className="text-gray-600 mb-4">Secure your family's entire history, plus your family's business</p>
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
              Essential Resources After a Death in the Family
            </h2>
            <p className="text-lg text-gray-600">
              Get expert guidance on navigating one of life's most difficult moments, the loss of a loved one.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Tools</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="bg-white rounded p-4 mb-4">
                  <h4 className="font-semibold text-gray-900">David's Eulogy</h4>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Write a Meaningful Eulogy in 5-10 Minutes</h4>
                <button className="text-blue-600 hover:text-blue-700 font-medium">Get started free</button>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-32 bg-green-100 flex items-center justify-center mb-4">
                  <ClipboardList className="w-12 h-12 text-green-600" />
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Checklist: Steps to Take When Someone Dies</h4>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">Download</button>
                </div>
              </div>
            </div>
          </div>

          {/* Articles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Articles</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-48 bg-purple-100 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-purple-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-purple-600 mb-2">Settling an Estate</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Settling an Estate: A Step-by-Step Guide
                  </h4>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-48 bg-purple-100 flex items-center justify-center">
                  <Shield className="w-16 h-16 text-purple-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-purple-600 mb-2">Financial Security</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    How to Find the Safety Deposit Box of a Deceased Person
                  </h4>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-48 bg-purple-100 flex items-center justify-center">
                  <Heart className="w-16 h-16 text-purple-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-purple-600 mb-2">Legal Matters</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    What Is Probate?
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