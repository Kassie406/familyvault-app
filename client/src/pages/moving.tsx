import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { 
  Package, 
  FileText, 
  Home, 
  Users, 
  Smartphone,
  Shield,
  Star,
  Zap,
  Eye,
  Key,
  Download,
  BookOpen,
  ChevronRight,
  Lock,
  UserCheck,
  Phone,
  Bell
} from "lucide-react";
import movingCoupleImage from "@assets/image_1756094383182.png";
import digitalSecurityImage from "@assets/generated_images/Cloud_backup_security_illustration_01b8f657.png";
import mobileAppImage from "@assets/generated_images/FamilyVault_mobile_app_interface_d4485332.png";
import askExpertsImage from "@assets/generated_images/Ask_experts_blackboard_illustration_e21e4a7b.png";
import jessicaProfileImage from "@assets/generated_images/Jessica_moving_reviewer_headshot_8e565bdd.png";
import michaelProfileImage from "@assets/generated_images/Michael_moving_reviewer_headshot_367e0514.png";
import amandaProfileImage from "@assets/generated_images/Amanda_moving_reviewer_headshot_63882a69.png";

export default function Moving() {
  const features = [
    {
      icon: Shield,
      title: "Protect Your Data While Moving",
      description: "Your laptop gets stolen from your car during the move — and the information is not backed up.",
      detail: "FamilyVault secures sensitive documents with encryption and lets you manage who can access them."
    },
    {
      icon: FileText,
      title: "Keep Track of Moving Documents",
      description: "Your movers broke a lamp — but you can't file a claim until you find the contract, which is lost amid your boxes.",
      detail: "Store the movers' contract and related receipts in FamilyVault's Family Operating System® so they're secure and easy to find."
    },
    {
      icon: Smartphone,
      title: "Access What You Need on the Go",
      description: "You're enrolling your child at their new school — and you need a birth certificate on the spot.",
      detail: "Instantly pull up your child's birth certificate, vaccination record, and other essential documents."
    },
    {
      icon: Users,
      title: "Share New Details With Contacts",
      description: "Your babysitter can't get into your new backyard because she needs a gate access code and you can't be reached.",
      detail: "Grant partial account access or use FamilyVault's SecureLinks™ to share information with family and professionals."
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
    { name: "Jessica M.", title: "Member since 2022", rating: 5, quote: "FamilyVault made our cross-country move so much smoother — everything was organized and accessible.", image: jessicaProfileImage },
    { name: "Michael K.", title: "Member since 2023", rating: 5, quote: "Lost our moving contract during the chaos, but having it in FamilyVault saved us from a huge headache.", image: michaelProfileImage },
    { name: "Amanda R.", title: "Member since 2021", rating: 5, quote: "Being able to share documents with our family during the move was invaluable.", image: amandaProfileImage }
  ];

  return (
    <div className="min-h-screen bg-[#0b0b0b]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20 bg-[#0b0b0b]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="moving-hero" style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '32px', alignItems: 'center' }}>
            <div>
              <span className="inline-flex items-center gap-2 text-[#f1c232] font-medium bg-[rgba(241,194,50,0.08)] px-3 py-1 rounded-full border border-[rgba(241,194,50,0.25)] mb-6">
                📦 Moving
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-[#fff] mb-4 leading-tight">
                FamilyVault for Moving to a New Home
              </h1>
              <p className="text-[#c9c9c9] mb-8 text-lg leading-relaxed">
                A new home brings big changes — and the Family Operating System® keeps your essential information secure and accessible before, during, and after your move.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/pricing"
                  data-testid="button-get-started"
                  className="bg-[#f1c232] hover:brightness-95 text-[#111] px-8 py-3 rounded-full font-semibold text-lg transition-all inline-flex items-center focus:outline-2 focus:outline-[#f1c232] focus:outline-offset-2"
                >
                  Get started free
                </a>
                <a 
                  href="/pricing"
                  data-testid="link-see-moving-features"
                  className="text-[#D1D5DB] hover:text-[#F3F4F6] underline underline-offset-4 min-h-[44px] flex items-center"
                >
                  See what's included →
                </a>
              </div>
            </div>
            <div className="moving-hero__media" style={{ position: 'relative', border: '1px solid #7a5e08', borderRadius: '18px', padding: '8px', background: '#0f0f0f' }}>
              <img 
                src={movingCoupleImage} 
                alt="Family carrying boxes into new home"
                className="moving-hero__img"
                style={{ display: 'block', width: '100%', height: '420px', borderRadius: '12px', objectFit: 'cover', objectPosition: 'center' }}
                loading="eager"
                width="600"
                height="420"
              />
              <style>{`
                @media (max-width: 900px) {
                  .moving-hero {
                    grid-template-columns: 1fr !important;
                  }
                  .moving-hero__img {
                    height: 280px !important;
                  }
                }
                @media (max-width: 980px) {
                  .feature-row {
                    grid-template-columns: 1fr !important;
                  }
                }
                @media (max-width: 900px) {
                  .testimonials {
                    grid-template-columns: 1fr !important;
                  }
                  .pricing {
                    grid-template-columns: 1fr !important;
                  }
                  .resources {
                    grid-template-columns: 1fr !important;
                  }
                }
                .resource:hover {
                  transform: translateY(-2px);
                }
              `}</style>
            </div>
          </div>
        </div>
      </section>

      {/* How FamilyVault Helps */}
      <section className="py-16 bg-[#0b0b0b]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#fff] mb-4">
            How FamilyVault Helps — Through All Stages of Moving
          </h2>
          <p className="text-lg text-[#c9c9c9] max-w-3xl mx-auto">
            Whether you're confirming movers or settling into your new home, your important documents stay private, protected, and ready to use.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#0b0b0b]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="feature-row" style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '32px', alignItems: 'center', padding: '48px 0', borderBottom: index < features.length - 1 ? '1px solid rgba(255,255,255,.06)' : '0' }}>
                  <div>
                    <div className="feature-card" style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', padding: '18px', background: 'rgba(255,255,255,.02)' }}>
                      <div className="text-center">
                        {index === 0 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-xs mx-auto">
                              <div className="flex items-center mb-3">
                                <div className="w-6 h-6 bg-blue-100 rounded mr-2 flex items-center justify-center">
                                  <Home className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="font-semibold text-sm">Property</span>
                              </div>
                              <div className="bg-blue-50 rounded p-3 mb-3">
                                <div className="text-xs font-medium">Home Warranty</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  <div>Replace Items</div>
                                  <div>End date: Feb 12, 2025</div>
                                  <div>Premium $0.00 - Office desk</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 1 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="bg-blue-600 text-white text-center py-2 rounded-t text-sm font-semibold mb-3">
                                📋 MOVING
                              </div>
                              <div className="space-y-2 text-xs">
                                <div className="bg-blue-50 rounded p-2">
                                  <div className="font-medium">Moving Contract</div>
                                  <div className="text-gray-600">ABC Moving Services • Jun 15, 2024</div>
                                  <div className="text-blue-600">$2,450</div>
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
                                <div className="font-medium">Birth Certificate</div>
                                <div className="text-gray-600 mt-1">Emily Johnson</div>
                                <div className="text-gray-600">Born: March 15, 2018</div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 3 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="text-xs font-medium mb-3">Partial access</div>
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <div className="w-6 h-6 bg-green-500 rounded-full mr-2 flex items-center justify-center text-white text-xs">C</div>
                                  <div>
                                    <div className="text-xs font-medium">Christine Vasquez</div>
                                    <div className="text-xs text-gray-600">Sitter</div>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-6 h-6 bg-blue-500 rounded-full mr-2 flex items-center justify-center text-white text-xs">D</div>
                                  <div>
                                    <div className="text-xs font-medium">Desirae Phris</div>
                                    <div className="text-xs text-gray-600">Lawyer</div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs font-medium mt-3">Legacy access</div>
                              <div className="flex items-center mt-1">
                                <div className="w-6 h-6 bg-purple-500 rounded-full mr-2 flex items-center justify-center text-white text-xs">A</div>
                                <div>
                                  <div className="text-xs font-medium">Anna Reynolds</div>
                                  <div className="text-xs text-gray-600">Mother</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="w-8 h-8 bg-[rgba(241,194,50,0.1)] rounded-lg flex items-center justify-center mb-6">
                      <IconComponent className="w-4 h-4 text-[#f1c232]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#fff] mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-[#c9c9c9] mb-4 italic">
                      {feature.description}
                    </p>
                    <p className="text-[#fff] font-medium">
                      {feature.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet FamilyVault - CTA Band */}
      <section className="cta-band" style={{ padding: '56px 0', background: 'radial-gradient(1200px 300px at 50% 100%, rgba(241,194,50,.15) 0%, rgba(11,11,11,0) 70%), #0b0b0b' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#fff] mb-6">
            Meet FamilyVault — Your Life, Organized
          </h2>
          <p className="text-lg text-[#c9c9c9] mb-8 max-w-3xl mx-auto">
            From travel and finances to emergency planning, FamilyVault keeps your key information secure, organized, and within reach so you can focus on what matters.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-free"
            className="bg-[#f1c232] hover:brightness-95 text-[#111] px-8 py-4 rounded-full font-semibold text-lg transition-all inline-block focus:outline-2 focus:outline-[#f1c232] focus:outline-offset-2"
          >
            Get started free
          </a>
        </div>
      </section>

      {/* Bottom Features */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {bottomFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="rounded-xl overflow-hidden border border-[rgba(212,175,55,0.25)] bg-[#0B0B0B] h-48 flex items-center justify-center mb-6">
                    {feature.image ? (
                      <img 
                        src={feature.image} 
                        alt={feature.imageAlt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <IconComponent className="w-12 h-12 text-[#D4AF37]" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-[#F3F4F6] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#D1D5DB]">
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
            <h2 className="text-3xl lg:text-4xl font-bold text-[#fff] mb-6">
              Your Data Is Always Protected
            </h2>
            <p className="text-lg text-[#c9c9c9] max-w-3xl mx-auto">
              Your sensitive information stays private and secure with advanced security and compliance practices.
            </p>
            <div className="mt-8">
              <a
                href="/security"
                className="text-[#f1c232] hover:underline font-medium inline-flex items-center focus:outline-2 focus:outline-[#f1c232] focus:outline-offset-2"
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
                  <div className="w-8 h-8 bg-[rgba(241,194,50,0.1)] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <IconComponent className="w-4 h-4 text-[#f1c232]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#fff] mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#c9c9c9]">
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
              <div className="text-xs font-semibold text-[#c9c9c9] px-3 py-1 border border-[rgba(255,255,255,.1)] rounded">EU GDPR</div>
              <div className="text-xs font-semibold text-[#c9c9c9] px-3 py-1 border border-[rgba(255,255,255,.1)] rounded">SOC 2 TYPE II</div>
              <div className="text-xs font-semibold text-[#c9c9c9] px-3 py-1 border border-[rgba(255,255,255,.1)] rounded">SOC 3</div>
              <div className="text-xs font-semibold text-[#c9c9c9] px-3 py-1 border border-[rgba(255,255,255,.1)] rounded">HIPAA</div>
              <div className="text-xs font-semibold text-[#c9c9c9] px-3 py-1 border border-[rgba(255,255,255,.1)] rounded">CCPA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#0b0b0b]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#fff] mb-4">
              What Our Members Say About FamilyVault
            </h2>
          </div>

          <div className="testimonials" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', padding: '40px 0' }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', padding: '20px', color: '#ddd' }}>
                <div className="flex justify-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#f1c232] fill-current" />
                  ))}
                </div>
                <p className="italic mb-4">"{testimonial.quote}"</p>
                {testimonial.image ? (
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-[#f1c232] overflow-hidden">
                    <img 
                      src={testimonial.image} 
                      alt={`${testimonial.name} profile photo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-[#f1c232] to-[#d4af37] rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-[#f1c232]">
                    <span className="text-black text-xl font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                )}
                <div className="font-semibold text-sm text-[#fff]">{testimonial.name}</div>
                <div className="name" style={{ color: '#bdbdbd', fontSize: '12px', marginTop: '8px' }}>{testimonial.title}</div>
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
              <p className="text-[#D1D5DB] mb-4 h-12">For families starting to organize for moving</p>
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

      {/* Essential Resources */}
      <section className="py-20 bg-[#0b0b0b]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#fff] mb-4">
              Essential Resources for Moving to a New Home
            </h2>
            <p className="text-lg text-[#c9c9c9]">
              Get expert guidance to stay organized, avoid common pitfalls, and settle in with less stress.
            </p>
          </div>

          <div className="resources" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {/* Featured Guide */}
            <div className="resource" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', padding: '18px', minHeight: '140px', transition: 'transform .18s ease' }}>
              <div className="inline-flex items-center gap-2 text-[#f1c232] font-medium bg-[rgba(241,194,50,0.08)] px-3 py-1 rounded-full border border-[rgba(241,194,50,0.25)] mb-4">
                <Bell className="w-4 h-4" />
                Featured Guide
              </div>
              <h3 className="text-lg font-bold mb-3 text-[#fff]">
                Complete Moving Guide
              </h3>
              <p className="text-[#c9c9c9] mb-4 text-sm">
                Less stress, more control, smoother start
              </p>
              <a href="/resources/moving-guide" className="text-[#f1c232] hover:underline font-medium inline-flex items-center text-sm focus:outline-2 focus:outline-[#f1c232] focus:outline-offset-2">
                Download guide
                <Download className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Checklist */}
            <div className="resource" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', padding: '18px', minHeight: '140px', transition: 'transform .18s ease' }}>
              <div className="text-[#f1c232] font-semibold text-sm mb-3">CHECKLIST</div>
              <div className="bg-[rgba(241,194,50,0.05)] rounded-lg p-4 mb-4 flex items-center justify-center h-16">
                <Package className="w-8 h-8 text-[#f1c232]" />
              </div>
              <h3 className="font-semibold text-[#fff] text-sm">
                Moving Checklist: 8 Weeks to Moving Day
              </h3>
            </div>

            {/* Document Organizer */}
            <div className="resource" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', padding: '18px', minHeight: '140px', transition: 'transform .18s ease' }}>
              <div className="text-[#f1c232] font-semibold text-sm mb-3">ARTICLE</div>
              <div className="bg-[rgba(241,194,50,0.05)] rounded-lg p-4 mb-4 flex items-center justify-center h-16">
                <FileText className="w-8 h-8 text-[#f1c232]" />
              </div>
              <h3 className="font-semibold text-[#fff] text-sm">
                How to Organize Documents Before Moving
              </h3>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}