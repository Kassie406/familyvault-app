import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { 
  Lock, 
  Shield, 
  Users, 
  Upload,
  Smartphone,
  Star,
  Zap,
  Eye,
  Key,
  Download,
  BookOpen,
  ChevronRight,
  UserCheck,
  Phone,
  FileText,
  Link
} from "lucide-react";
import laptopSecurityImage from "@assets/image_1756094818120.png";
import digitalSecurityImage from "@assets/image_1756094885841.png";

export default function DigitalSecurity() {
  const features = [
    {
      icon: Shield,
      title: "Protect Against Data Loss",
      description: "Your laptop crashed, and all of the important documents you had stored in a computer folder are gone forever.",
      detail: "With FamilyVault's digital vault, your documents are stored securely, and you can access them anytime, anywhere."
    },
    {
      icon: Link,
      title: "Send Sensitive Information Safely",
      description: "You emailed your ID to rent a vacation home, and now you're worried it will remain in the homeowner's inbox forever.",
      detail: "FamilyVault's SecureLinks™ ensure you control who has access to sensitive information — and for how long."
    },
    {
      icon: FileText,
      title: "Avoid Loss of Important Documents",
      description: "You've lost a thumb drive full of important family information, after it apparently slipped from your pocket on the bus.",
      detail: "FamilyVault consolidates your family's most essential documents in a secure, private vault, with encryption built in."
    },
    {
      icon: Upload,
      title: "Go Beyond Paper for Peace of Mind",
      description: "You kept important paper documents in a cabinet storage unit, but you lost everything when the building burned.",
      detail: "Keep your documents safe by uploading them to FamilyVault's digital vault, even if you plan to keep some copies on paper."
    }
  ];

  const bottomFeatures = [
    {
      icon: Shield,
      title: "Back Up Your Data Easily",
      description: "Automatic cloud backup keeps everything safe",
      image: digitalSecurityImage,
      imageAlt: "Digital security shield with circuit board background representing secure cloud backup"
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
    { name: "Marcus D.", title: "Member since 2022", rating: 5, quote: "FamilyVault's security features give me peace of mind knowing our family documents are protected." },
    { name: "Sarah L.", title: "Member since 2023", rating: 5, quote: "The SecureLinks feature is amazing - I can share documents safely without worrying about them being stored everywhere." },
    { name: "Kevin R.", title: "Member since 2021", rating: 5, quote: "Lost my computer in a break-in, but all our important documents were safe in FamilyVault's digital vault." }
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
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                FamilyVault for Digital Security
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Keeping your documents safe shouldn't be complicated. FamilyVault helps families manage sensitive information with airtight security.
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
              <div className="bg-purple-50 rounded-2xl p-8 h-96 overflow-hidden">
                <img 
                  src={laptopSecurityImage} 
                  alt="Professional working on laptop with digital security lock overlays representing secure document management"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protect Your Family's Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Protect Your Family's Information — and Their Future
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A computer crash, a fire, a lost thumb drive — your family's important documents are too important to leave vulnerable. FamilyVault secures the information that matters.
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
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-xs mx-auto">
                              <div className="bg-gray-800 rounded-t-lg p-3 mb-3">
                                <div className="flex items-center justify-center">
                                  <Smartphone className="w-8 h-8 text-white" />
                                </div>
                              </div>
                              <div className="text-xs">
                                <div className="font-medium mb-2">Browse</div>
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span>Family IDs</span>
                                    <span>5</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Finance</span>
                                    <span>12</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Property</span>
                                    <span>8</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Insurance</span>
                                    <span>4</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 1 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="text-xs font-medium mb-3">Create a secure link to "Driver's license"</div>
                              <div className="space-y-3">
                                <div className="border border-gray-300 rounded p-2">
                                  <input 
                                    type="text" 
                                    placeholder="Share with"
                                    className="w-full text-xs bg-transparent outline-none"
                                  />
                                </div>
                                <div className="text-xs text-gray-600">
                                  <div>Expires in</div>
                                  <div className="flex items-center mt-1">
                                    <input type="radio" className="mr-1" />
                                    <span>24 hours</span>
                                  </div>
                                  <div className="flex items-center">
                                    <input type="radio" className="mr-1" />
                                    <span>7 days</span>
                                  </div>
                                </div>
                                <button className="bg-blue-600 text-white px-4 py-1 rounded text-xs">
                                  Send
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 2 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="flex items-center mb-3">
                                <div className="w-6 h-6 bg-blue-100 rounded mr-2 flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="font-semibold text-sm">Family IDs</span>
                              </div>
                              <div className="bg-blue-50 rounded p-3 mb-3">
                                <div className="text-xs font-medium">Medical Directive</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  <div>Sarah Reynolds</div>
                                  <div>Date required: Feb 12, 2025</div>
                                  <div>Location of original: Office desk</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 3 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-gray-100 rounded p-2 text-center">
                                  <FileText className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                                  <div className="text-xs">Passport</div>
                                </div>
                                <div className="bg-gray-100 rounded p-2 text-center">
                                  <FileText className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                                  <div className="text-xs">Birth Cert</div>
                                </div>
                                <div className="bg-gray-100 rounded p-2 text-center">
                                  <FileText className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                                  <div className="text-xs">Insurance</div>
                                </div>
                                <div className="bg-gray-100 rounded p-2 text-center">
                                  <Upload className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                                  <div className="text-xs">Upload</div>
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
                  <div className="bg-gray-100 rounded-2xl p-8 h-48 flex items-center justify-center mb-6 overflow-hidden">
                    {feature.image ? (
                      <img 
                        src={feature.image} 
                        alt={feature.imageAlt}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <IconComponent className="w-12 h-12 text-[#FFD700]" />
                    )}
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
                <li>• 10 items</li>
                <li>• 500MB</li>
                <li>• Autopilot™ by FamilyVault (beta)</li>
                <li>• Unlimited collaborators</li>
              </ul>
            </div>

            {/* Silver Plan */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-xl font-bold mb-2">Silver</h3>
              <p className="text-gray-600 mb-4">Comprehensive estate organization for you and your family's resources</p>
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
                <li>• Archive support</li>
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
              Essential Reading for Your Family's Digital Security
            </h2>
            <p className="text-lg text-gray-600">
              Explore expert advice for safeguarding your family's important information, ensuring you're prepared for anything that may come your way.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Featured Article */}
            <div className="md:col-span-2">
              <div className="bg-blue-900 rounded-2xl p-8 text-white h-64 flex items-center">
                <div>
                  <div className="text-sm font-semibold text-blue-400 mb-2">FEATURED ARTICLE</div>
                  <h3 className="text-2xl font-bold mb-4">
                    What Is a Digital Vault? (And Why You Need One)
                  </h3>
                  <p className="text-gray-300 mb-6">
                    A digital vault — like FamilyVault's — gives your family a protected, private place to hold what matters most. IDs, finances, memories, and more are kept safe and accessible when you need them.
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
                    Read More
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Resource */}
            <div>
              <div className="bg-gray-100 rounded-2xl p-6 h-64 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-sm font-semibold text-purple-600 mb-2">GUIDE</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    The Complete Guide to Family Digital Security
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
                <div className="h-48 bg-purple-100 flex items-center justify-center">
                  <Shield className="w-16 h-16 text-purple-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-purple-600 mb-2">Digital Security</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    How to Safely Store and Digitize Family Records
                  </h4>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-48 bg-purple-100 flex items-center justify-center">
                  <Key className="w-16 h-16 text-purple-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-purple-600 mb-2">Password Security</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Expert Q&A: Password Hygiene 101
                  </h4>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-48 bg-purple-100 flex items-center justify-center">
                  <Users className="w-16 h-16 text-purple-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-purple-600 mb-2">Family Security</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    How to Safely Share Passwords with Family Members or Trusted Contacts
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