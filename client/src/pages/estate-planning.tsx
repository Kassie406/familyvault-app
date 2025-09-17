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
  Lock,
  CheckCircle,
  Scale,
  Briefcase,
  Clock,
  Award
} from "lucide-react";
import estatePlanningImage from "@assets/image_1756095429229.png";
import digitalSecurityImage from "@assets/generated_images/Cloud_backup_security_illustration_01b8f657.png";
import mobileAppImage from "@assets/generated_images/FamilyVault_mobile_app_interface_d4485332.png";
import askExpertsImage from "@assets/generated_images/Ask_experts_blackboard_illustration_e21e4a7b.png";
import patriciaProfileImage from "@assets/generated_images/Patricia_estate_planning_reviewer_headshot_41438796.png";
import michaelProfileImage from "@assets/generated_images/Michael_estate_planning_reviewer_headshot_de7c16fa.png";
import lindaProfileImage from "@assets/generated_images/Linda_estate_planning_reviewer_headshot_ca4073a1.png";

export default function EstatePlanning() {
  const estatePlanningCards = [
    {
      icon: FileText,
      title: "Wills & Trusts",
      description: "Store your will, trust documents, and beneficiary information securely.",
      action: "Add documents",
      href: "/estate-wills-trusts"
    },
    {
      icon: Heart,
      title: "Healthcare Directives",
      description: "Keep living wills and advance healthcare directives accessible to family.",
      action: "Add directives",
      href: "/estate-healthcare-directives"
    },
    {
      icon: Scale,
      title: "Power of Attorney",
      description: "Organize financial and healthcare power of attorney documents.",
      action: "Add POA documents",
      href: "/estate-power-of-attorney"
    },
    {
      icon: Users,
      title: "Beneficiary Information",
      description: "Maintain updated beneficiary details for all accounts and policies.",
      action: "Add beneficiaries",
      href: "/estate-beneficiary-information"
    },
    {
      icon: Briefcase,
      title: "Asset Documentation",
      description: "Document property, investments, and valuable assets for estate planning.",
      action: "Add assets",
      href: "/estate-asset-documentation"
    },
    {
      icon: Phone,
      title: "Professional Contacts",
      description: "Store attorney, financial advisor, and accountant contact information.",
      action: "Add contacts",
      href: "/estate-professional-contacts"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Store and Share Estate Plans",
      description: "You're worried that your family won't know where to find your will and trust documents when they're needed.",
      detail: "Store docs with FamilyCircle Secure and set up legacy access, ensuring your family will get your important information after your passing."
    },
    {
      icon: Heart,
      title: "Organize Medical Directives",
      description: "You don't know how to ensure doctors will follow your healthcare wishes if you can't speak for yourself during an emergency.",
      detail: "Keep your living will and other advance directives with FamilyCircle Secure, and share them with your doctor, hospital, and family."
    },
    {
      icon: Phone,
      title: "Manage Power of Attorney Documents",
      description: "You've named someone to handle your finances in an emergency, but they don't know where to find your important documents.",
      detail: "FamilyCircle Secure's Family Operating System® ensures your financial and legal documents are secure, accessible, and shareable."
    },
    {
      icon: Users,
      title: "Prepare Important Contacts",
      description: "Your family may struggle to reach your lawyer or financial advisor when they need them most.",
      detail: "Store and share legal, financial, and medical contacts securely in the Family Operating System®."
    }
  ];

  const checklistItems = [
    "Will and trust storage",
    "Healthcare directive access", 
    "Power of attorney documents",
    "Professional contact sharing"
  ];

  const bottomFeatures = [
    {
      icon: Shield,
      title: "Easily Organize Your Documents",
      description: "Systematic document upload keeps everything organized",
      image: digitalSecurityImage,
      imageAlt: "Digital security shield with circuit board background representing secure document organization"
    },
    {
      icon: Smartphone,
      title: "Use FamilyCircle Secure on the Go", 
      description: "Access your information anywhere with our mobile app",
      image: mobileAppImage,
      imageAlt: "Mobile app interface showing family document categories and navigation"
    },
    {
      icon: Phone,
      title: "Share With the Right People, the Right Way",
      description: "Control who sees what with granular sharing permissions",
      image: askExpertsImage,
      imageAlt: "Ask the Experts blackboard with light bulbs showing expert consultation concept"
    }
  ];

  const testimonials = [
    { name: "Patricia H.", title: "Member since 2022", rating: 5, quote: "Having all our estate documents organized in FamilyCircle Secure gives our family such peace of mind.", image: patriciaProfileImage },
    { name: "Michael R.", title: "Member since 2021", rating: 5, quote: "The legacy access feature ensures our children will have what they need when the time comes.", image: michaelProfileImage },
    { name: "Linda K.", title: "Member since 2023", rating: 5, quote: "FamilyCircle Secure made organizing our wills and trusts so much easier than keeping paper copies.", image: lindaProfileImage }
  ];

  return (
    <div className="min-h-screen bg-[#0F0F10] text-[#EDEDED]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 text-[#E7C74D] font-semibold bg-[rgba(231,199,77,0.08)] px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.08)] text-sm tracking-wide">
                ⚖️ Estate Planning
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-[#EDEDED] tracking-tight leading-tight">
                FamilyCircle Secure for Estate Planning
              </h1>
              <p className="text-[#9BA3AF] max-w-[58ch] text-lg leading-relaxed">
                Secure and organize your vital information so your loved ones have what they need, when they need it most.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="/pricing"
                  data-testid="button-get-started-free"
                  className="bg-[#E7C74D] text-[#1A1A1B] font-bold px-6 py-3 rounded-full hover:transform hover:-translate-y-0.5 transition-transform focus:outline-none focus:ring-2 focus:ring-[#8EC8FF] focus:ring-offset-2 min-h-[44px] flex items-center"
                >
                  Get started free
                </a>
                <a 
                  href="/pricing"
                  data-testid="link-see-estate-features"
                  className="text-[#D1D5DB] hover:text-[#F3F4F6] underline underline-offset-4 min-h-[44px] flex items-center"
                >
                  See what's included →
                </a>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#151517] p-2 shadow-[0_6px_28px_rgba(0,0,0,0.35)]">
              <img 
                src={estatePlanningImage} 
                alt="Estate planning documents and gavel representing legal estate planning"
                className="w-full h-full object-cover rounded-xl"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Estate Planning Cards */}
      <section id="features" className="py-20 bg-[#0F0F10]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#EDEDED] mb-4">
              Your Estate Planning, Simplified
            </h2>
            <p className="text-[#9BA3AF] text-lg max-w-2xl mx-auto">
              FamilyCircle Secure's Family Operating System® helps you ensure your wishes are clear, your assets are protected, and your family has guidance for the future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {estatePlanningCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div 
                  key={index}
                  className="bg-[#151517] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 min-h-[172px] flex flex-col gap-3 hover:border-[rgba(231,199,77,0.08)] hover:shadow-[0_0_0_1px_rgba(231,199,77,0.08),0_10px_30px_rgba(0,0,0,0.35)] hover:transform hover:-translate-y-0.5 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#8EC8FF] focus-within:ring-offset-2"
                >
                  <div className="w-9 h-9 bg-[rgba(231,199,77,0.08)] border border-[rgba(255,255,255,0.08)] rounded-xl flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-[#E7C74D]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#EDEDED]">
                    {card.title}
                  </h3>
                  <p className="text-[#9BA3AF] text-sm flex-1">
                    {card.description}
                  </p>
                  <a 
                    href={card.href}
                    data-testid={`link-${card.action.replace(/\s+/g, '-').toLowerCase()}`}
                    className="text-[#EDEDED] hover:text-[#E7C74D] hover:border-[#E7C74D] border-b border-[rgba(255,255,255,0.08)] inline-flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-[#8EC8FF] focus:ring-offset-2"
                  >
                    {card.action} →
                  </a>
                </div>
              );
            })}
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2.5 mt-8 justify-center">
            {checklistItems.map((item, index) => (
              <div key={index} className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-[rgba(255,255,255,0.08)] text-[#9BA3AF] bg-transparent hover:border-[#E7C74D] hover:text-[#E7C74D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8EC8FF] focus:ring-offset-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Main Features */}
      <section className="py-20 bg-[#0F0F10]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="grid lg:grid-cols-2 gap-10 items-center">
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="bg-[#151517] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 min-h-[220px] flex items-center justify-center shadow-[0_6px_28px_rgba(0,0,0,0.35)]">
                      {index === 0 && (
                        <div className="bg-[#0F0F10] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(255,255,255,0.08)]">
                          <div className="text-xs font-medium mb-3 text-[#EDEDED]">Mary Reynolds Will</div>
                          <div className="space-y-2">
                            <div className="bg-[rgba(231,199,77,0.08)] rounded p-2 border border-[rgba(255,255,255,0.08)]">
                              <div className="text-xs text-[#9BA3AF]">Last updated</div>
                              <div className="font-semibold text-xs text-[#EDEDED]">Jan 15, 2024</div>
                            </div>
                            <div className="bg-[rgba(231,199,77,0.08)] rounded p-2 border border-[rgba(255,255,255,0.08)]">
                              <div className="text-xs text-[#9BA3AF]">Location of original</div>
                              <div className="text-xs text-[#EDEDED]">Attorney: Office desk</div>
                            </div>
                            <div className="bg-[rgba(231,199,77,0.1)] rounded p-2 border border-[rgba(231,199,77,0.2)]">
                              <div className="text-xs font-medium text-[#E7C74D]">Status: Active</div>
                              <div className="text-xs text-[#E7C74D]">Living Trust</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="bg-[#0F0F10] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(255,255,255,0.08)]">
                          <div className="flex items-center mb-3">
                            <div className="w-6 h-6 bg-[rgba(231,199,77,0.08)] rounded mr-2 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-[#E7C74D]" />
                            </div>
                            <span className="font-semibold text-sm text-[#EDEDED]">Medical Directive</span>
                          </div>
                          <div className="bg-[rgba(231,199,77,0.08)] rounded p-3 mb-3 border border-[rgba(255,255,255,0.08)]">
                            <div className="text-xs font-medium text-[#EDEDED]">Sarah Reynolds</div>
                            <div className="text-xs text-[#9BA3AF] mt-1">
                              <div>Date created: Jan 15, 2024</div>
                              <div>Location of original: Office desk</div>
                              <div className="mt-2 text-[#E7C74D] font-medium">Shared with: Dr. Johnson</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 2 && (
                        <div className="bg-[#0F0F10] rounded-lg p-4 max-w-xs mx-auto border border-[rgba(255,255,255,0.08)]">
                          <div className="bg-[#E7C74D] rounded-t-lg p-3 mb-3">
                            <div className="flex items-center justify-center">
                              <Smartphone className="w-8 h-8 text-black" />
                            </div>
                          </div>
                          <div className="text-xs text-[#EDEDED]">
                            <div className="font-medium mb-2 text-[#E7C74D]">Financial Accounts</div>
                            <div className="space-y-1">
                              <div className="flex items-center p-2 bg-[rgba(231,199,77,0.08)] rounded border border-[rgba(255,255,255,0.08)]">
                                <div className="w-3 h-3 bg-[#E7C74D] rounded mr-2"></div>
                                <span>E*Trade Premium Savings</span>
                              </div>
                              <div className="flex items-center p-2 bg-[rgba(231,199,77,0.08)] rounded border border-[rgba(255,255,255,0.08)]">
                                <div className="w-3 h-3 bg-[#E7C74D] rounded mr-2"></div>
                                <span>Chase High Interest Savings</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 3 && (
                        <div className="bg-[#0F0F10] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(255,255,255,0.08)]">
                          <div className="text-xs mb-3 text-[#EDEDED]">
                            <div className="font-semibold mb-2 text-[#E7C74D]">Full access</div>
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-[rgba(231,199,77,0.1)] rounded-full mr-2 border border-[rgba(231,199,77,0.2)]"></div>
                              <span>David Reynolds</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#E7C74D]" />
                            </div>
                            
                            <div className="font-semibold mb-2 mt-3 text-[#E7C74D]">Partial access</div>
                            <div className="flex items-center mb-1">
                              <div className="w-6 h-6 bg-[rgba(231,199,77,0.08)] rounded-full mr-2 border border-[rgba(255,255,255,0.08)]"></div>
                              <span>Christine Marcello</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#E7C74D]" />
                            </div>
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-[rgba(231,199,77,0.08)] rounded-full mr-2 border border-[rgba(255,255,255,0.08)]"></div>
                              <span>Sabrina Pless</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#E7C74D]" />
                            </div>
                            
                            <div className="font-semibold mb-2 mt-3 text-[#E7C74D]">Legacy access</div>
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-[rgba(231,199,77,0.15)] rounded-full mr-2 border border-[rgba(231,199,77,0.25)]"></div>
                              <span>Anna Reynolds</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#E7C74D]" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="w-12 h-12 bg-[rgba(231,199,77,0.08)] border border-[rgba(255,255,255,0.08)] rounded-xl flex items-center justify-center mb-6">
                      <IconComponent className="w-6 h-6 text-[#E7C74D]" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#EDEDED] mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-[#9BA3AF] mb-4 italic text-lg leading-relaxed">
                      {feature.description}
                    </p>
                    <p className="text-[#EDEDED] font-medium text-lg leading-relaxed">
                      {feature.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet FamilyCircle Secure */}
      <section className="py-20 bg-[#0F0F10]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#EDEDED] mb-6">
            Meet FamilyCircle Secure — Your Life, Organized
          </h2>
          <p className="text-[#9BA3AF] text-lg mb-8 max-w-3xl mx-auto">
            From travel and finances to emergency planning, FamilyCircle Secure keeps your key information secure, organized, and within reach so you can focus on what matters.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-cta"
            className="bg-[#E7C74D] hover:bg-[#E7C74D]/90 text-[#1A1A1B] px-8 py-4 rounded-full font-bold text-lg transition-colors inline-block min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#8EC8FF] focus:ring-offset-2"
          >
            Get started free
          </a>
        </div>
      </section>

      {/* Bottom Features */}
      <section className="py-20 bg-[#0F0F10]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {bottomFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#151517] h-48 flex items-center justify-center mb-6 hover:border-[rgba(231,199,77,0.08)] transition-colors duration-300">
                    {feature.image ? (
                      <img 
                        src={feature.image} 
                        alt={feature.imageAlt}
                        className="w-full h-full object-cover rounded-xl"
                        loading="lazy"
                      />
                    ) : (
                      <IconComponent className="w-12 h-12 text-[#E7C74D]" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-[#EDEDED] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#9BA3AF]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-[#0F0F10] border-t border-[rgba(255,255,255,0.08)]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#EDEDED] mb-6">
              Your Data Is Always Protected
            </h2>
            <p className="text-[#9BA3AF] text-lg max-w-3xl mx-auto">
              Your sensitive information stays private and secure with advanced security and compliance practices.
            </p>
            <div className="mt-8">
              <a
                href="/security"
                className="text-[#EDEDED] hover:text-[#E7C74D] hover:border-[#E7C74D] border-b border-[rgba(255,255,255,0.08)] font-medium inline-flex items-center min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#8EC8FF] focus:ring-offset-2"
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
                  <div className="w-10 h-10 bg-[rgba(231,199,77,0.08)] border border-[rgba(255,255,255,0.08)] rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-[#E7C74D]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#EDEDED] mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#9BA3AF]">
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
                <div key={index} className="text-xs font-semibold text-[#9BA3AF] px-3 py-1 border border-[rgba(255,255,255,0.08)] rounded">
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#0F0F10]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#EDEDED] mb-4">
              What Our Members Say About FamilyCircle Secure
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#151517] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 text-center hover:border-[rgba(231,199,77,0.08)] transition-colors duration-300">
                <div className="flex justify-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#E7C74D] fill-current" />
                  ))}
                </div>
                <p className="text-[#9BA3AF] italic mb-4">"{testimonial.quote}"</p>
                <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden border-2 border-[#E7C74D]">
                  <img 
                    src={testimonial.image} 
                    alt={`${testimonial.name} profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-semibold text-sm text-[#EDEDED]">{testimonial.name}</div>
                <div className="text-xs text-[#9BA3AF]">{testimonial.title}</div>
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
              <p className="text-[#D1D5DB] mb-4 h-12">For families starting to organize for estate planning</p>
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
                <li>• Autopilot™ by FamilyCircle Secure (beta)</li>
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
                <li>• Autopilot™ by FamilyCircle Secure</li>
                <li>• Liability support</li>
                <li>• Priority customer expert</li>
                <li>• The FamilyCircle Secure Marketplace</li>
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

      {/* Bottom CTA */}
      <section className="py-20 bg-gradient-to-b from-[rgba(231,199,77,0.07)] to-transparent border-t border-[rgba(255,255,255,0.08)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#EDEDED] mb-6">
            Secure Your Family's Future Today
          </h2>
          <p className="text-[#9BA3AF] text-lg mb-8 max-w-2xl mx-auto">
            Start organizing your estate planning documents with FamilyCircle Secure.
          </p>
          <a
            href="/pricing"
            data-testid="button-final-cta"
            className="bg-[#E7C74D] hover:bg-[#E7C74D]/90 text-[#1A1A1B] px-8 py-4 rounded-full font-bold text-lg transition-colors inline-block min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#8EC8FF] focus:ring-offset-2"
          >
            Get started free
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}