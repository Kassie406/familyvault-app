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
import mobileAppImage from "@assets/image_1756094986045.png";
import askExpertsImage from "@assets/image_1756095055472.png";

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
      description: "Access your information anywhere with our mobile app",
      image: mobileAppImage,
      imageAlt: "Mobile app interface showing family document categories and navigation"
    },
    {
      icon: Phone,
      title: "Connect With an Expert",
      description: "Get personalized help organizing your family's documents",
      image: askExpertsImage,
      imageAlt: "Ask the Experts blackboard with light bulbs showing expert consultation concept"
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
    <div className="min-h-screen bg-[#0b0b0b]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20 bg-[#0b0b0b]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-[#FFD93D] font-medium bg-[rgba(255,217,61,0.08)] px-3 py-1 rounded-full border border-[rgba(255,217,61,0.25)] mb-6">
                🔒 Digital Security
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-[#FFFFFF] mb-6">
                FamilyVault for Digital Security
              </h1>
              <p className="text-lg text-[#CCCCCC] mb-8 leading-relaxed">
                Keeping your documents safe shouldn't be complicated. FamilyVault helps families manage sensitive information with airtight security.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/pricing"
                  data-testid="button-get-started"
                  className="bg-[#D4AF37] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#C7A233] transition-colors min-h-[44px] flex items-center"
                >
                  Get started free
                </a>
                <a 
                  href="/pricing"
                  data-testid="link-about-security"
                  className="text-[#D1D5DB] hover:text-[#F3F4F6] underline underline-offset-4 min-h-[44px] flex items-center"
                >
                  See what's included →
                </a>
              </div>
            </div>
            <div className="lg:pl-12">
              <div className="bg-[#111111] border border-[rgba(255,217,61,0.2)] rounded-2xl p-8 h-96 overflow-hidden">
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
      <section className="py-16 bg-[#0b0b0b]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#FFFFFF] mb-4">
            Protect Your Family's Information — and Their Future
          </h2>
          <p className="text-lg text-[#CCCCCC] max-w-3xl mx-auto">
            A computer crash, a fire, a lost thumb drive — your family's important documents are too important to leave vulnerable. FamilyVault secures the information that matters.
          </p>
        </div>
      </section>

      {/* Information Cards */}
      <section className="py-20 bg-[#0b0b0b]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="bg-[#111111] border border-[rgba(255,217,61,0.2)] rounded-2xl p-8 h-64 flex items-center justify-center hover:border-[#FFD93D] transition-colors duration-300">
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
                    <div className="w-8 h-8 bg-[rgba(255,217,61,0.1)] rounded-lg flex items-center justify-center mb-6">
                      <IconComponent className="w-4 h-4 text-[#FFD93D]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#FFFFFF] mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-[#CCCCCC] mb-4 italic">
                      {feature.description}
                    </p>
                    <p className="text-[#FFFFFF] font-medium">
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
      <section className="py-20 bg-[#0b0b0b]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#FFFFFF] mb-6">
            Meet FamilyVault — Your Life, Organized
          </h2>
          <p className="text-lg text-[#CCCCCC] mb-8 max-w-3xl mx-auto">
            From travel and finances to emergency planning, FamilyVault keeps your key information secure, organized, and within reach so you can focus on what matters.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-free"
            className="bg-[#FFD93D] hover:bg-[#FFD93D]/90 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Get started free
          </a>
        </div>
      </section>

      {/* Bottom Features */}
      <section className="py-20 bg-[#0b0b0b]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {bottomFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-[#111111] border border-[rgba(255,217,61,0.2)] rounded-2xl p-8 h-48 flex items-center justify-center mb-6 overflow-hidden hover:border-[#FFD93D] transition-colors duration-300">
                    {feature.image ? (
                      <img 
                        src={feature.image} 
                        alt={feature.imageAlt}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <IconComponent className="w-12 h-12 text-[#FFD93D]" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-[#FFFFFF] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#CCCCCC]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-[#0b0b0b]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#FFFFFF] mb-6">
              Your Data Is Always Protected
            </h2>
            <p className="text-lg text-[#CCCCCC] max-w-3xl mx-auto">
              Your sensitive information stays private and secure with advanced security and compliance practices.
            </p>
            <div className="mt-8">
              <a
                href="/security"
                className="text-[#FFD93D] hover:underline font-medium inline-flex items-center"
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
                  <div className="w-8 h-8 bg-[rgba(255,217,61,0.1)] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <IconComponent className="w-4 h-4 text-[#FFD93D]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#FFFFFF] mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#CCCCCC]">
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
              <div className="text-xs font-semibold text-[#CCCCCC] px-3 py-1 border border-[rgba(255,255,255,.1)] rounded">EU GDPR</div>
              <div className="text-xs font-semibold text-[#CCCCCC] px-3 py-1 border border-[rgba(255,255,255,.1)] rounded">SOC 2 TYPE II</div>
              <div className="text-xs font-semibold text-[#CCCCCC] px-3 py-1 border border-[rgba(255,255,255,.1)] rounded">SOC 3</div>
              <div className="text-xs font-semibold text-[#CCCCCC] px-3 py-1 border border-[rgba(255,255,255,.1)] rounded">HIPAA</div>
              <div className="text-xs font-semibold text-[#CCCCCC] px-3 py-1 border border-[rgba(255,255,255,.1)] rounded">CCPA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#0b0b0b]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#FFFFFF] mb-4">
              What Our Members Say About FamilyVault
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#111111] border border-[rgba(255,217,61,0.2)] rounded-lg p-6 text-center">
                <div className="flex justify-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FFD93D] fill-current" />
                  ))}
                </div>
                <p className="text-[#CCCCCC] italic mb-4">"{testimonial.quote}"</p>
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFD93D] to-[#FFD700] rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-[#FFD93D]">
                  <span className="text-black text-xl font-bold">{testimonial.name.charAt(0)}</span>
                </div>
                <div className="font-semibold text-sm text-[#FFFFFF]">{testimonial.name}</div>
                <div className="text-xs text-[#CCCCCC]">{testimonial.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#F3F4F6] mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-[#D1D5DB]">
              No hidden fees. No surprises. Just complete peace of mind.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] rounded-xl p-6 flex flex-col">
              <div className="h-8"></div> {/* Spacer for badge alignment */}
              <h3 className="text-xl font-bold mb-2 text-[#F3F4F6]">Free</h3>
              <p className="text-[#D1D5DB] mb-4 h-12">For families starting to organize for digital security</p>
              <div className="text-3xl font-bold mb-6 text-[#F3F4F6]">$0</div>
              <button
                data-testid="button-get-started-free-plan"
                className="w-full bg-[#D4AF37] text-black py-3 rounded-full font-semibold mb-6 hover:bg-[#C7A233] transition-colors"
              >
                Get started
              </button>
              <ul className="space-y-2 text-sm text-[#D1D5DB] flex-1">
                <li>• Advanced security</li>
                <li>• 12 items</li>
                <li>• 50GB</li>
                <li>• Autopilot™ by FamilyVault (beta)</li>
                <li>• Tailored onboarding</li>
                <li>• Unlimited collaborators</li>
              </ul>
            </div>

            {/* Silver Plan */}
            <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] rounded-xl p-6 flex flex-col">
              <div className="h-8"></div> {/* Spacer for badge alignment */}
              <h3 className="text-xl font-bold mb-2 text-[#F3F4F6]">Silver</h3>
              <p className="text-[#D1D5DB] mb-4 h-12">Build a comprehensive organization plan</p>
              <div className="text-3xl font-bold mb-6 text-[#F3F4F6]">$10</div>
              <button
                data-testid="button-get-started-silver-plan"
                className="w-full bg-[#D4AF37] text-black py-3 rounded-full font-semibold mb-6 hover:bg-[#C7A233] transition-colors"
              >
                Get started
              </button>
              <ul className="space-y-2 text-sm text-[#D1D5DB] flex-1">
                <li>• Everything in Free plus:</li>
                <li>• Unlimited items</li>
                <li>• Autopilot™ by FamilyVault</li>
                <li>• Liability support</li>
                <li>• Priority customer expert</li>
                <li>• The FamilyVault Marketplace</li>
              </ul>
            </div>

            {/* Gold Plan */}
            <div className="bg-[#1A1A1A] border-2 border-[#D4AF37] rounded-xl p-6 relative shadow-[0_0_0_6px_rgba(212,175,55,0.12)] flex flex-col">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#D4AF37] text-black px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <div className="h-8"></div> {/* Spacer that accounts for the badge */}
              <h3 className="text-xl font-bold mb-2 text-[#F3F4F6]">Gold</h3>
              <p className="text-[#D1D5DB] mb-4 h-12">Organize your entire business and financial future</p>
              <div className="text-3xl font-bold mb-6 text-[#F3F4F6]">$20</div>
              <button
                data-testid="button-get-started-gold-plan"
                className="w-full bg-[#D4AF37] text-black py-3 rounded-full font-semibold mb-6 hover:bg-[#C7A233] transition-colors"
              >
                Get started
              </button>
              <ul className="space-y-2 text-sm text-[#D1D5DB] flex-1">
                <li>• Everything in Silver plus:</li>
                <li>• Business information</li>
                <li>• Organization (LLC, S Corp, S Corp, INC, etc.)</li>
                <li>• Entity relationship mapping</li>
                <li>• Friendly expert support</li>
                <li>• And more...</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-[#D1D5DB]">
            30-day money-back guarantee | We support first responders with a hero discount.
          </div>
        </div>
      </section>

      {/* Essential Reading */}
      <section className="py-20 bg-[#0b0b0b]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#FFFFFF] mb-4">
              Essential Reading for Your Family's Digital Security
            </h2>
            <p className="text-lg text-[#CCCCCC]">
              Explore expert advice for safeguarding your family's important information, ensuring you're prepared for anything that may come your way.
            </p>
          </div>

          <div className="resources" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {/* Featured Article */}
            <div className="resource" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', padding: '18px', minHeight: '140px', transition: 'transform .18s ease' }}>
              <div className="inline-flex items-center gap-2 text-[#FFD93D] font-medium bg-[rgba(255,217,61,0.08)] px-3 py-1 rounded-full border border-[rgba(255,217,61,0.25)] mb-4">
                <BookOpen className="w-4 h-4" />
                Featured Article
              </div>
              <h3 className="text-lg font-bold mb-3 text-[#FFFFFF]">
                What Is a Digital Vault?
              </h3>
              <p className="text-[#CCCCCC] mb-4 text-sm">
                Protected, private place for what matters most
              </p>
              <a href="/resources/digital-vault" className="text-[#FFD93D] hover:underline font-medium inline-flex items-center text-sm focus:outline-2 focus:outline-[#FFD93D] focus:outline-offset-2">
                Read article
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Guide */}
            <div className="resource" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', padding: '18px', minHeight: '140px', transition: 'transform .18s ease' }}>
              <div className="text-[#FFD93D] font-semibold text-sm mb-3">GUIDE</div>
              <div className="bg-[rgba(255,217,61,0.05)] rounded-lg p-4 mb-4 flex items-center justify-center h-16">
                <Lock className="w-8 h-8 text-[#FFD93D]" />
              </div>
              <h3 className="font-semibold text-[#FFFFFF] text-sm">
                Complete Guide to Family Digital Security
              </h3>
            </div>

            {/* Security Tips */}
            <div className="resource" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', padding: '18px', minHeight: '140px', transition: 'transform .18s ease' }}>
              <div className="text-[#FFD93D] font-semibold text-sm mb-3">ARTICLE</div>
              <div className="bg-[rgba(255,217,61,0.05)] rounded-lg p-4 mb-4 flex items-center justify-center h-16">
                <Shield className="w-8 h-8 text-[#FFD93D]" />
              </div>
              <h3 className="font-semibold text-[#FFFFFF] text-sm">
                How to Safely Store and Digitize Records
              </h3>
            </div>
          </div>

          <style jsx>{`
            @media (max-width: 900px) {
              .resources {
                grid-template-columns: 1fr !important;
              }
            }
            .resource:hover {
              transform: translateY(-2px);
            }
          `}</style>
        </div>
      </section>

      <Footer />
    </div>
  );
}