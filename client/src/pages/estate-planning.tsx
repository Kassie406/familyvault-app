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
import digitalSecurityImage from "@assets/image_1756095779424.png";
import mobileAppImage from "@assets/image_1756095858406.png";
import askExpertsImage from "@assets/image_1756095909223.png";

export default function EstatePlanning() {
  const estatePlanningCards = [
    {
      icon: FileText,
      title: "Wills & Trusts",
      description: "Store your will, trust documents, and beneficiary information securely.",
      action: "Add documents"
    },
    {
      icon: Heart,
      title: "Healthcare Directives",
      description: "Keep living wills and advance healthcare directives accessible to family.",
      action: "Add directives"
    },
    {
      icon: Scale,
      title: "Power of Attorney",
      description: "Organize financial and healthcare power of attorney documents.",
      action: "Add POA documents"
    },
    {
      icon: Users,
      title: "Beneficiary Information",
      description: "Maintain updated beneficiary details for all accounts and policies.",
      action: "Add beneficiaries"
    },
    {
      icon: Briefcase,
      title: "Asset Documentation",
      description: "Document property, investments, and valuable assets for estate planning.",
      action: "Add assets"
    },
    {
      icon: Phone,
      title: "Professional Contacts",
      description: "Store attorney, financial advisor, and accountant contact information.",
      action: "Add contacts"
    }
  ];

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
      title: "Use FamilyVault on the Go", 
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
    { name: "Patricia H.", title: "Member since 2022", rating: 5, quote: "Having all our estate documents organized in FamilyVault gives our family such peace of mind." },
    { name: "Michael R.", title: "Member since 2021", rating: 5, quote: "The legacy access feature ensures our children will have what they need when the time comes." },
    { name: "Linda K.", title: "Member since 2023", rating: 5, quote: "FamilyVault made organizing our wills and trusts so much easier than keeping paper copies." }
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
                📋 Estate Planning
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#F3F4F6] tracking-tight">
                FamilyVault for Estate Planning
              </h1>
              <p className="text-[#D1D5DB] max-w-[65ch] text-lg">
                What if something happened to you? Secure and organize your family's vital information for your loved ones when they need it most.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="/signup"
                  data-testid="button-get-started-free"
                  className="bg-[#D4AF37] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#C7A233] transition-colors min-h-[44px] flex items-center"
                >
                  Get started free
                </a>
                <a 
                  href="/features"
                  data-testid="link-see-estate-features"
                  className="text-[#D1D5DB] hover:text-[#F3F4F6] underline underline-offset-4 min-h-[44px] flex items-center"
                >
                  See estate planning features →
                </a>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-[rgba(212,175,55,0.35)] bg-[#141414] h-72 md:h-[22rem]">
              <img 
                src={estatePlanningImage} 
                alt="Living trust and estate planning document with gavel representing legal estate planning"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Estate Planning Cards */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F3F4F6] mb-4">
              Your Estate Planning, Simplified
            </h2>
            <p className="text-[#D1D5DB] text-lg max-w-2xl mx-auto">
              FamilyVault's Family Operating System® helps you ensure your wishes are clear, your assets are protected, and your family has guidance for the future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {estatePlanningCards.map((card, index) => {
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
                    href="#"
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
                    <div className="rounded-xl overflow-hidden border border-[rgba(212,175,55,0.25)] bg-[#0B0B0B] h-80 flex items-center justify-center">
                      {index === 0 && (
                        <div className="bg-[#141414] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(212,175,55,0.2)]">
                          <div className="text-xs font-medium mb-3 text-[#F3F4F6]">Mary Reynolds Will</div>
                          <div className="space-y-2">
                            <div className="bg-[rgba(212,175,55,0.1)] rounded p-2 border border-[rgba(212,175,55,0.2)]">
                              <div className="text-xs text-[#D1D5DB]">Last updated</div>
                              <div className="font-semibold text-xs text-[#F3F4F6]">Jan 15, 2024</div>
                            </div>
                            <div className="bg-[rgba(212,175,55,0.1)] rounded p-2 border border-[rgba(212,175,55,0.2)]">
                              <div className="text-xs text-[#D1D5DB]">Location of original</div>
                              <div className="text-xs text-[#F3F4F6]">Attorney: Office desk</div>
                            </div>
                            <div className="bg-[rgba(212,175,55,0.2)] rounded p-2 border border-[rgba(212,175,55,0.3)]">
                              <div className="text-xs font-medium text-[#D4AF37]">Status: Active</div>
                              <div className="text-xs text-[#D4AF37]">Living Trust</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="bg-[#141414] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(212,175,55,0.2)]">
                          <div className="flex items-center mb-3">
                            <div className="w-6 h-6 bg-[rgba(212,175,55,0.2)] rounded mr-2 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-[#D4AF37]" />
                            </div>
                            <span className="font-semibold text-sm text-[#F3F4F6]">Medical Directive</span>
                          </div>
                          <div className="bg-[rgba(212,175,55,0.1)] rounded p-3 mb-3 border border-[rgba(212,175,55,0.2)]">
                            <div className="text-xs font-medium text-[#F3F4F6]">Sarah Reynolds</div>
                            <div className="text-xs text-[#D1D5DB] mt-1">
                              <div>Date created: Jan 15, 2024</div>
                              <div>Location of original: Office desk</div>
                              <div className="mt-2 text-[#D4AF37] font-medium">Shared with: Dr. Johnson</div>
                            </div>
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
                            <div className="font-medium mb-2 text-[#D4AF37]">Financial Accounts</div>
                            <div className="space-y-1">
                              <div className="flex items-center p-2 bg-[rgba(212,175,55,0.1)] rounded border border-[rgba(212,175,55,0.2)]">
                                <div className="w-3 h-3 bg-[#D4AF37] rounded mr-2"></div>
                                <span>E*Trade Premium Savings</span>
                              </div>
                              <div className="flex items-center p-2 bg-[rgba(212,175,55,0.1)] rounded border border-[rgba(212,175,55,0.2)]">
                                <div className="w-3 h-3 bg-[#C7A233] rounded mr-2"></div>
                                <span>Chase High Interest Savings</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 3 && (
                        <div className="bg-[#141414] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(212,175,55,0.2)]">
                          <div className="text-xs mb-3 text-[#F3F4F6]">
                            <div className="font-semibold mb-2 text-[#D4AF37]">Full access</div>
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-[rgba(212,175,55,0.2)] rounded-full mr-2 border border-[rgba(212,175,55,0.3)]"></div>
                              <span>David Reynolds</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />
                            </div>
                            
                            <div className="font-semibold mb-2 mt-3 text-[#D4AF37]">Partial access</div>
                            <div className="flex items-center mb-1">
                              <div className="w-6 h-6 bg-[rgba(212,175,55,0.1)] rounded-full mr-2 border border-[rgba(212,175,55,0.2)]"></div>
                              <span>Christine Marcello</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />
                            </div>
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-[rgba(212,175,55,0.1)] rounded-full mr-2 border border-[rgba(212,175,55,0.2)]"></div>
                              <span>Sabrina Pless</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />
                            </div>
                            
                            <div className="font-semibold mb-2 mt-3 text-[#D4AF37]">Legacy access</div>
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-[rgba(212,175,55,0.3)] rounded-full mr-2 border border-[rgba(212,175,55,0.4)]"></div>
                              <span>Anna Reynolds</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />
                            </div>
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
            Meet FamilyVault — Your Life, Organized
          </h2>
          <p className="text-[#D1D5DB] text-lg mb-8 max-w-3xl mx-auto">
            From travel and finances to emergency planning, FamilyVault keeps your key information secure, organized, and within reach so you can focus on what matters.
          </p>
          <a
            href="/signup"
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
                        className="w-full h-full object-cover rounded-lg"
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
                <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full mx-auto mb-3 border border-[rgba(212,175,55,0.25)]"></div>
                <div className="font-semibold text-sm text-[#F3F4F6]">{testimonial.name}</div>
                <div className="text-xs text-[#D1D5DB]">{testimonial.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bar */}
      <section className="py-16 bg-gradient-to-r from-transparent to-[rgba(212,175,55,0.08)] border-t border-[rgba(212,175,55,0.25)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#F3F4F6] mb-4">
            Secure your family's future today.
          </h2>
          <p className="text-[#D1D5DB] mb-8 text-lg">
            Start organizing your estate planning documents with FamilyVault.
          </p>
          <a
            href="/signup"
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