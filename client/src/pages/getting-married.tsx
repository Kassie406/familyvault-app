import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import weddingRingsImage from "@assets/generated_images/Wedding_rings_on_marriage_certificate_4b6f91c2.png";
import digitalSecurityImage from "@assets/image_1756093873694.png";
import mobileAppImage from "@assets/image_1756093955366.png";
import askExpertsImage from "@assets/image_1756094014310.png";
import securityShieldImage from "@assets/image_1756096044567.png";
import sarahProfileImageMarried from "@assets/generated_images/Sarah_Mike_couple_headshot_831b85fb.png";
import jessicaProfileImageMarried from "@assets/generated_images/Jessica_professional_headshot_76348cf5.png";
import davidEmmaProfileImageMarried from "@assets/generated_images/David_Emma_couple_headshot_0912656a.png";
import { 
  Heart,
  Users, 
  Shield, 
  FileText,
  Smartphone,
  Star,
  Zap,
  Eye,
  Key,
  Phone,
  ChevronRight,
  UserCheck,
  Upload,
  Lock,
  CreditCard,
  CheckCircle,
  Calendar,
  Home,
  Banknote
} from "lucide-react";

export default function GettingMarried() {
  const marriageCards = [
    {
      icon: FileText,
      title: "Legal Documentation",
      description: "Store marriage certificates and legal forms in one place.",
      action: "Add legal docs",
      href: "/married-legal-docs"
    },
    {
      icon: CreditCard,
      title: "Financial Planning",
      description: "Organize joint accounts, insurance, and key documents.",
      action: "Add financial info",
      href: "/married-financial-planning"
    },
    {
      icon: Home,
      title: "Living Arrangements",
      description: "Keep lease, mortgage, and home-related records together.",
      action: "Add housing docs",
      href: "/married-living-arrangements"
    },
    {
      icon: Users,
      title: "Family Info",
      description: "Document family details, emergency contacts, and more.",
      action: "Add family info",
      href: "/married-family-info"
    },
    {
      icon: Heart,
      title: "Wedding Planning",
      description: "Track vendors, guest lists, and essential wedding details.",
      action: "Add wedding docs",
      href: "/married-wedding-planning"
    },
    {
      icon: Shield,
      title: "Estate Planning",
      description: "Manage wills, POAs, and inheritance docs.",
      action: "Add estate docs",
      href: "/married-estate-planning"
    }
  ];

  const features = [
    {
      icon: FileText,
      title: "Navigate Name Changes Smoothly",
      description: "You're trying to update your driver's license after marriage, but you need your marriage certificate and can't find it anywhere.",
      detail: "Store your marriage certificate and name change documentation in FamilyVault so you can update all your records seamlessly."
    },
    {
      icon: CreditCard,
      title: "Combine Your Finances Securely",
      description: "You're opening a joint bank account but need to provide multiple financial documents that are scattered across different locations.",
      detail: "Keep all your financial documents organized in one secure place, making it easy to set up joint accounts and merge your finances."
    },
    {
      icon: Shield,
      title: "Update Your Estate Plans",
      description: "Your spouse needs to be added as a beneficiary, but you can't remember which accounts and policies need to be updated.",
      detail: "Track all your insurance policies and accounts in FamilyVault, so you can easily update beneficiaries and estate plans after marriage."
    },
    {
      icon: Users,
      title: "Share Important Information",
      description: "Your new spouse needs access to your emergency contacts and medical information, but it's spread across different apps and papers.",
      detail: "Securely share your important personal information with your spouse through FamilyVault's controlled access features."
    }
  ];

  const checklistItems = [
    "Name change documentation",
    "Financial account merging",
    "Beneficiary updates",
    "Information sharing"
  ];

  const bottomFeatures = [
    {
      icon: Shield,
      title: "Back Up Your Data Easily",
      description: "Automatic cloud backup keeps everything safe",
      image: securityShieldImage,
      imageAlt: "Digital security shield with circuit board background and cybersecurity visualization"
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
    { name: "Sarah & Mike", title: "Members since 2022", rating: 5, quote: "FamilyVault made combining our finances and updating our documents after marriage stress-free.", image: sarahProfileImageMarried },
    { name: "Jessica L.", title: "Member since 2021", rating: 5, quote: "The name change process was seamless with everything stored in one place.", image: jessicaProfileImageMarried },
    { name: "David & Emma", title: "Members since 2023", rating: 5, quote: "Sharing documents securely gave us both peace of mind.", image: davidEmmaProfileImageMarried }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F3F4F6]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 text-[#D4AF37] font-medium bg-[rgba(212,175,55,0.08)] px-3 py-1 rounded-full border border-[rgba(212,175,55,0.25)]">
                💍 Getting Married
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#F3F4F6] tracking-tight">
                FamilyVault for Getting Married
              </h1>
              <p className="text-[#D1D5DB] max-w-[65ch] text-lg">
                From engagement to 'I do' and beyond, FamilyVault keeps your most important documents secure, organized, and ready when you need them.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="/pricing"
                  data-testid="button-get-started-free"
                  className="bg-[#D4AF37] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#C7A233] transition-colors min-h-[44px] flex items-center"
                >
                  Get started free
                </a>
                <a 
                  href="/pricing"
                  data-testid="link-see-marriage-features"
                  className="text-[#D1D5DB] hover:text-[#F3F4F6] underline underline-offset-4 min-h-[44px] flex items-center"
                >
                  See marriage planning features →
                </a>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-[rgba(212,175,55,0.35)] bg-[#141414] h-72 md:h-[22rem] flex items-center justify-center">
              <img 
                src={weddingRingsImage} 
                alt="Wedding rings on marriage certificate representing the start of married life"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Marriage Planning Cards */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F3F4F6] mb-4">
              How FamilyVault Supports Your Marriage Journey
            </h2>
            <p className="text-[#D1D5DB] text-lg max-w-2xl mx-auto">
              Keep your documents, finances, and important information organized as you build your new life together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marriageCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div 
                  key={index}
                  className="bg-[#0B0B0B] rounded-xl p-6 border border-[rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.35)] transition-colors"
                >
                  <div className="w-12 h-12 bg-[rgba(212,175,55,0.1)] rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#F3F4F6] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-[#D1D5DB] mb-4">
                    {card.description}
                  </p>
                  <a 
                    href={card.href}
                    data-testid={`link-${card.action.replace(/\s+/g, '-').toLowerCase()}`}
                    className="text-[#D4AF37] hover:text-[#C7A233] font-medium inline-flex items-center min-h-[44px]"
                  >
                    {card.action} →
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Checklist Feature Strip */}
      <section className="py-12 bg-[#0B0B0B]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {checklistItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
                <span className="text-[#D1D5DB] font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="rounded-xl overflow-hidden border border-[rgba(212,175,55,0.35)] bg-gradient-to-br from-[rgba(212,175,55,0.05)] to-[rgba(212,175,55,0.02)] h-96 flex items-center justify-center p-6">
                      {index === 0 && (
                        <div className="bg-[#141414] rounded-lg p-4 max-w-xs mx-auto border border-[rgba(212,175,55,0.2)]">
                          <div className="bg-[#D4AF37] rounded-t-lg p-3 mb-3">
                            <div className="flex items-center justify-center">
                              <Smartphone className="w-8 h-8 text-black" />
                            </div>
                          </div>
                          <div className="text-xs text-[#F3F4F6]">
                            <div className="flex items-center mb-3">
                              <div className="w-6 h-6 bg-[rgba(212,175,55,0.2)] rounded mr-2 flex items-center justify-center">
                                <FileText className="w-4 h-4 text-[#D4AF37]" />
                              </div>
                              <span className="font-semibold text-[#F3F4F6]">Name Change Documents</span>
                            </div>
                            <div className="space-y-2">
                              <div className="bg-[rgba(212,175,55,0.1)] rounded p-2 border border-[rgba(212,175,55,0.2)]">
                                <div className="text-xs text-[#D1D5DB]">Marriage Certificate</div>
                              </div>
                              <div className="bg-[rgba(212,175,55,0.1)] rounded p-2 border border-[rgba(212,175,55,0.2)]">
                                <div className="text-xs text-[#D1D5DB]">Social Security Card</div>
                              </div>
                              <div className="bg-[rgba(212,175,55,0.1)] rounded p-2 border border-[rgba(212,175,55,0.2)]">
                                <div className="text-xs text-[#D1D5DB]">Driver's License</div>
                              </div>
                            </div>
                            <div className="mt-3 text-xs text-[#D4AF37]">
                              <div className="underline">Ready for updates</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="bg-[#141414] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(212,175,55,0.2)]">
                          <div className="text-xs font-medium mb-3 text-[#F3F4F6]">Joint Financial Accounts</div>
                          <div className="bg-[rgba(212,175,55,0.1)] rounded p-3 mb-3 text-left border border-[rgba(212,175,55,0.2)]">
                            <div className="text-xs font-medium mb-2 text-[#F3F4F6]">Accounts to Combine:</div>
                            <ul className="text-xs space-y-1 text-[#D1D5DB]">
                              <li>• Joint checking account</li>
                              <li>• Joint savings account</li>
                              <li>• Credit card accounts</li>
                              <li>• Investment accounts</li>
                              <li>• Auto loans</li>
                              <li>• Insurance policies</li>
                            </ul>
                          </div>
                          <div className="text-xs">
                            <div className="font-medium text-[#D4AF37]">Status: Ready to merge</div>
                            <div className="text-[#D1D5DB] mt-1">All documents organized...</div>
                          </div>
                        </div>
                      )}
                      {index === 2 && (
                        <div className="bg-[#141414] rounded-lg p-4 max-w-xs mx-auto border border-[rgba(212,175,55,0.2)]">
                          <div className="bg-[#D4AF37] rounded-t-lg p-3 mb-3">
                            <div className="flex items-center justify-center">
                              <Smartphone className="w-8 h-8 text-black" />
                            </div>
                          </div>
                          <div className="text-xs text-[#F3F4F6]">
                            <div className="text-center mb-4">
                              <div className="w-12 h-12 bg-[rgba(212,175,55,0.2)] rounded-full mx-auto mb-2 flex items-center justify-center border border-[rgba(212,175,55,0.3)]">
                                <Shield className="w-6 h-6 text-[#D4AF37]" />
                              </div>
                              <div className="font-medium text-[#F3F4F6]">Beneficiary Updates</div>
                            </div>
                            <div className="space-y-1">
                              <div className="bg-[rgba(212,175,55,0.1)] rounded p-2 text-left border border-[rgba(212,175,55,0.2)]">
                                <div className="font-medium text-[#F3F4F6]">Life Insurance</div>
                                <div className="text-[#D1D5DB]">Updated ✓</div>
                              </div>
                              <div className="bg-[rgba(212,175,55,0.1)] rounded p-2 text-left border border-[rgba(212,175,55,0.2)]">
                                <div className="font-medium text-[#F3F4F6]">401(k) Plan</div>
                                <div className="text-[#D1D5DB]">Pending update</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 3 && (
                        <div className="bg-[#141414] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(212,175,55,0.2)]">
                          <div className="text-xs mb-3 text-[#F3F4F6]">
                            <div className="font-semibold mb-2 text-[#D4AF37]">Shared with Spouse</div>
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-[rgba(212,175,55,0.2)] rounded-full mr-2 border border-[rgba(212,175,55,0.3)]"></div>
                              <span>Alex Johnson</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />
                            </div>
                            
                            <div className="font-semibold mb-2 mt-3 text-[#D4AF37]">Emergency Contacts</div>
                            <div className="flex items-center mb-1">
                              <div className="w-6 h-6 bg-[rgba(212,175,55,0.1)] rounded-full mr-2 border border-[rgba(212,175,55,0.2)]"></div>
                              <span>Mom & Dad</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />
                            </div>
                            <div className="text-[#D1D5DB] text-xs ml-8">Primary contacts</div>
                            
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-[rgba(212,175,55,0.1)] rounded-full mr-2 border border-[rgba(212,175,55,0.2)]"></div>
                              <span>Medical Info</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />
                            </div>
                            <div className="text-[#D1D5DB] text-xs ml-8">Health records</div>
                            
                            <div className="font-semibold mb-2 mt-3 text-[#D4AF37]">Private access</div>
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-[rgba(212,175,55,0.3)] rounded-full mr-2 border border-[rgba(212,175,55,0.4)]"></div>
                              <span>Personal docs</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />
                            </div>
                            <div className="text-[#D1D5DB] text-xs ml-8">Individual access only</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="w-12 h-12 bg-[rgba(212,175,55,0.1)] rounded-lg flex items-center justify-center mb-6">
                      <IconComponent className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#F3F4F6] mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-[#9CA3AF] mb-4 italic text-lg">
                      {feature.description}
                    </p>
                    <p className="text-[#D1D5DB] font-medium text-lg">
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
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F3F4F6] mb-6">
            Start your marriage stress-free
          </h2>
          <p className="text-[#D1D5DB] text-lg mb-8 max-w-3xl mx-auto">
            Keep your documents secure and accessible today.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-cta"
            className="bg-[#D4AF37] hover:bg-[#C7A233] text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block min-h-[44px]"
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
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F3F4F6] mb-6">
              Your Data Is Always Protected
            </h2>
            <p className="text-[#D1D5DB] text-lg max-w-3xl mx-auto">
              Your sensitive information stays private and secure with advanced security and compliance practices.
            </p>
            <div className="mt-8">
              <a
                href="/security"
                className="text-[#D4AF37] hover:text-[#C7A233] font-medium inline-flex items-center min-h-[44px]"
              >
                About our security
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Multi-factor authentication", description: "Secure your account with two-step login protection" },
              { icon: Eye, title: "Threat detection", description: "24/7 monitoring proactively guards against threats" },
              { icon: Key, title: "Tokenization", description: "Replaces sensitive data with secure tokens for protection" },
              { icon: Lock, title: "Data encryption", description: "Your data is securely encrypted both stored and in transit" },
              { icon: Zap, title: "Stolen password alerts", description: "Get notified instantly if your password is compromised" },
              { icon: UserCheck, title: "Biometric authentication", description: "Safe, instant access with fingerprint or face ID" }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start">
                  <div className="w-10 h-10 bg-[rgba(212,175,55,0.1)] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#F3F4F6] mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#D1D5DB]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compliance Badges */}
          <div className="mt-16 text-center">
            <div className="flex justify-center items-center space-x-6 opacity-60">
              {["EU GDPR", "SOC 2 TYPE II", "SOC 3", "HIPAA", "CCPA"].map((badge, index) => (
                <div key={index} className="text-xs font-semibold text-[#9CA3AF] px-3 py-1 border border-[rgba(212,175,55,0.2)] rounded">
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F3F4F6] mb-4">
              What Our Members Say About FamilyVault
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#0B0B0B] rounded-lg p-6 text-center border border-[rgba(212,175,55,0.2)]">
                <div className="flex justify-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#D4AF37] fill-current" />
                  ))}
                </div>
                <p className="text-[#D1D5DB] italic mb-4">"{testimonial.quote}"</p>
                {testimonial.image ? (
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-[#FFD700] overflow-hidden">
                    <img 
                      src={testimonial.image} 
                      alt={`${testimonial.name} profile photo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#D4AF37] rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-[#FFD700]">
                    <span className="text-black text-xl font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                )}
                <div className="font-semibold text-sm text-[#F3F4F6]">{testimonial.name}</div>
                <div className="text-xs text-[#D1D5DB]">{testimonial.title}</div>
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
              <p className="text-[#D1D5DB] mb-4 h-12">For families starting to organize for neurodivergence</p>
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

      {/* CTA Bar */}
      <section className="py-16 bg-gradient-to-r from-transparent to-[rgba(212,175,55,0.08)] border-t border-[rgba(212,175,55,0.25)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#F3F4F6] mb-4">
            Start your married life organized and prepared.
          </h2>
          <p className="text-[#D1D5DB] mb-8 text-lg">
            Begin organizing your marriage documents and information with FamilyVault today.
          </p>
          <a
            href="/pricing"
            data-testid="button-final-cta"
            className="bg-[#D4AF37] hover:bg-[#C7A233] text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block min-h-[44px]"
          >
            Get started free
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}