import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { 
  Home,
  FileText,
  Calculator,
  MapPin,
  Phone,
  Shield,
  Users,
  Smartphone,
  Star,
  Zap,
  Eye,
  Key,
  Lock,
  ChevronRight,
  UserCheck,
  Upload,
  CreditCard,
  CheckCircle,
  Calendar,
  Building,
  DollarSign,
  Search
} from "lucide-react";
import houseKeysImage from "@assets/image_1756095984954.png";
import digitalSecurityImage from "@assets/generated_images/Cloud_backup_security_illustration_01b8f657.png";
import mobileAppImage from "@assets/generated_images/FamilyVault_mobile_app_interface_d4485332.png";
import askExpertsImage from "@assets/generated_images/Ask_experts_blackboard_illustration_e21e4a7b.png";
import robertProfileImage from "@assets/generated_images/Robert_home_buying_reviewer_headshot_806866b7.png";
import jenniferProfileImage from "@assets/generated_images/Jennifer_home_buying_reviewer_headshot_b705e8d6.png";
import davidProfileImage from "@assets/generated_images/David_home_buying_reviewer_headshot_1c3ebf6a.png";

export default function HomeBuying() {
  const homeBuyingCards = [
    {
      icon: FileText,
      title: "Pre-Approval Documents",
      description: "Keep bank statements, pay stubs, and loan paperwork organized.",
      action: "Add financial docs",
      href: "/home-buying-preapproval-documents"
    },
    {
      icon: Calculator,
      title: "Budget & Affordability",
      description: "Track down payment funds, monthly payment calculations, and closing costs.",
      action: "Add budget info",
      href: "/home-buying-budget-affordability"
    },
    {
      icon: Search,
      title: "Property Research",
      description: "Store listings, inspection reports, and neighborhood information.",
      action: "Add property info",
      href: "/home-buying-property-research"
    },
    {
      icon: Home,
      title: "Home Inspection Records",
      description: "Organize inspection reports, repair estimates, and contractor details.",
      action: "Add inspection docs",
      href: "/home-buying-inspection-records"
    },
    {
      icon: DollarSign,
      title: "Closing Documentation",
      description: "Store title documents, insurance policies, and final paperwork.",
      action: "Add closing docs",
      href: "/home-buying-closing-documentation"
    },
    {
      icon: Phone,
      title: "Professional Contacts",
      description: "Keep realtor, lender, inspector, and attorney contact information.",
      action: "Add contacts",
      href: "/home-buying-professional-contacts"
    }
  ];

  const features = [
    {
      icon: FileText,
      title: "Get Pre-Approved Faster",
      description: "Your lender asks for three months of bank statements, but you can only find two — slowing down your pre-approval process.",
      detail: "Store all your financial documents in FamilyVault so you can quickly provide everything your lender needs for pre-approval."
    },
    {
      icon: Calculator,
      title: "Track Your Budget and Timeline",
      description: "You're house hunting but can't remember your exact budget limits or how much you've allocated for closing costs.",
      detail: "Keep all your financial planning information organized in one place, so you always know your buying power and timeline."
    },
    {
      icon: Home,
      title: "Remember What You Saw",
      description: "You've looked at 12 houses this month, and now you can't remember which one had the foundation issue or the great kitchen.",
      detail: "Store photos, notes, and inspection reports for each property you view, so you can make informed decisions."
    },
    {
      icon: Shield,
      title: "Share Information Securely",
      description: "Your realtor needs your pre-approval letter, but you're concerned about emailing sensitive financial information.",
      detail: "Use FamilyVault's secure sharing to provide access to the right documents without compromising your privacy."
    }
  ];

  const checklistItems = [
    "Financial document access",
    "Budget tracking",
    "Property comparison",
    "Secure information sharing"
  ];

  const bottomFeatures = [
    {
      icon: Shield,
      title: "Organize Your Documents Safely",
      description: "Secure document storage keeps your financial information protected",
      image: digitalSecurityImage,
      imageAlt: "Digital security shield with circuit board background representing secure document storage"
    },
    {
      icon: Smartphone,
      title: "Access Information on the Go", 
      description: "View documents and information during showings and meetings",
      image: mobileAppImage,
      imageAlt: "Mobile app interface showing family document categories and navigation"
    },
    {
      icon: Phone,
      title: "Share With Your Team",
      description: "Collaborate securely with realtors, lenders, and other professionals",
      image: askExpertsImage,
      imageAlt: "Ask the Experts blackboard with light bulbs showing expert consultation concept"
    }
  ];

  const testimonials = [
    { name: "Robert K.", title: "Member since 2022", rating: 5, quote: "FamilyVault kept all our home buying documents organized. We closed two weeks early because everything was ready to go!", image: robertProfileImage },
    { name: "Jennifer M.", title: "Member since 2021", rating: 5, quote: "Being able to share our pre-approval documents securely with our realtor made the process so much smoother.", image: jenniferProfileImage },
    { name: "David S.", title: "Member since 2023", rating: 5, quote: "The ability to compare different properties with all our notes and photos in one place was invaluable.", image: davidProfileImage }
  ];

  return (
    <div className="min-h-screen" style={{background: 'var(--bg)', color: 'var(--text)'}}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 text-[#d7b43e] font-semibold bg-[rgba(215,180,62,0.04)] px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.06)] text-sm tracking-wide">
                🏠 Home Buying
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-[#eaeaea] tracking-tight leading-tight">
                FamilyVault for Home Buying
              </h1>
              <p className="text-[#b9b9b9] max-w-[58ch] text-lg leading-relaxed">
                From pre-approval to closing, keep documents, research, and contacts in one secure place—so you move faster and worry less.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="/pricing"
                  data-testid="button-get-started-free"
                  className="inline-flex items-center gap-2 bg-[var(--brand)] text-[var(--brand-ink)] font-semibold px-6 py-3 rounded-full hover:bg-[var(--brand-2)] transition-colors min-h-[44px] shadow-[0_6px_16px_rgba(246,195,61,0.35)] focus:outline-none focus:ring-[0_0_0_1px_rgba(246,195,61,0.3),0_0_0_4px_rgba(246,195,61,0.12)]"
                >
                  Get started free
                </a>
                <a 
                  href="/pricing"
                  data-testid="link-see-home-features"
                  className="text-[#D1D5DB] hover:text-[#F3F4F6] underline underline-offset-4 min-h-[44px] flex items-center"
                >
                  See what's included →
                </a>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-[#0b0b0b] shadow-[0_8px_24px_rgba(0,0,0,0.35)] order-first lg:order-last">
              <img 
                src={houseKeysImage} 
                alt="Hand holding keys in front of a new home"
                className="w-full h-full object-cover block"
                width="960"
                height="540"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-[rgba(255,255,255,0.06)] mx-4 sm:mx-6 lg:mx-8" aria-hidden="true"></div>

      {/* Home Buying Cards */}
      <section id="features" className="py-20 bg-[#0f0f0f] border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#eaeaea] mb-4">
              How FamilyVault Supports Your Home Buying Journey
            </h2>
            <p className="text-[#b9b9b9] text-lg max-w-2xl mx-auto">
              Keep your documents, research, and contacts organized throughout the entire home buying process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {homeBuyingCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div 
                  key={index}
                  className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 min-h-[152px] transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:border-[rgba(215,180,62,0.35)] hover:shadow-[0_10px_24px_rgba(215,180,62,0.10)] focus-within:ring-2 focus-within:ring-[rgba(215,180,62,0.3)] focus-within:ring-offset-2"
                >
                  <div className="w-7 h-7 rounded-lg grid place-items-center bg-gradient-to-b from-[rgba(215,180,62,0.2)] to-[rgba(215,180,62,0.05)] text-[#d7b43e] mb-3">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#eaeaea] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-[#b9b9b9] text-sm mb-4 flex-1">
                    {card.description}
                  </p>
                  <a 
                    href={card.href}
                    data-testid={`link-${card.action.replace(/\s+/g, '-').toLowerCase()}`}
                    className="text-[#eaeaea] hover:text-[#d7b43e] font-medium inline-flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(215,180,62,0.3)] focus:ring-offset-2"
                  >
                    {card.action} →
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-[rgba(255,255,255,0.06)] mx-4 sm:mx-6 lg:mx-8" aria-hidden="true"></div>


      {/* Main Features */}
      <section className="py-20 bg-[#0f0f0f] border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="grid lg:grid-cols-2 gap-10 items-center">
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 min-h-[220px] flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                      {index === 0 && (
                        <div className="bg-[#0f0f0f] rounded-lg p-4 max-w-xs mx-auto border border-[rgba(255,255,255,0.08)]">
                          <div className="bg-[#d7b43e] rounded-t-lg p-3 mb-3">
                            <div className="flex items-center justify-center">
                              <Smartphone className="w-8 h-8 text-black" />
                            </div>
                          </div>
                          <div className="text-xs text-[#eaeaea]">
                            <div className="flex items-center mb-3">
                              <div className="w-6 h-6 bg-[rgba(215,180,62,0.2)] rounded mr-2 flex items-center justify-center">
                                <FileText className="w-4 h-4 text-[#d7b43e]" />
                              </div>
                              <span className="font-semibold text-[#eaeaea]">Mortgage Documents</span>
                            </div>
                            <div className="space-y-2">
                              <div className="bg-[rgba(215,180,62,0.1)] rounded p-2 border border-[rgba(255,255,255,0.08)]">
                                <div className="text-xs text-[#b9b9b9]">Bank Statements (3 months)</div>
                              </div>
                              <div className="bg-[rgba(215,180,62,0.1)] rounded p-2 border border-[rgba(255,255,255,0.08)]">
                                <div className="text-xs text-[#b9b9b9]">Pay Stubs</div>
                              </div>
                              <div className="bg-[rgba(215,180,62,0.1)] rounded p-2 border border-[rgba(255,255,255,0.08)]">
                                <div className="text-xs text-[#b9b9b9]">Tax Returns</div>
                              </div>
                            </div>
                            <div className="mt-3 text-xs text-[#d7b43e]">
                              <div className="underline">Ready for pre-approval</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="bg-[#0f0f0f] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(255,255,255,0.08)]">
                          <div className="text-xs font-medium mb-3 text-[#eaeaea]">Home Buying Budget</div>
                          <div className="bg-[rgba(215,180,62,0.1)] rounded p-3 mb-3 text-left border border-[rgba(255,255,255,0.08)]">
                            <div className="text-xs font-medium mb-2 text-[#eaeaea]">Budget Breakdown:</div>
                            <ul className="text-xs space-y-1 text-[#b9b9b9]">
                              <li>• Max home price: $450,000</li>
                              <li>• Down payment: $90,000 (20%)</li>
                              <li>• Monthly payment: $2,100</li>
                              <li>• Closing costs: $9,000</li>
                              <li>• Emergency fund: $15,000</li>
                              <li>• Moving costs: $3,000</li>
                            </ul>
                          </div>
                          <div className="text-xs">
                            <div className="font-medium text-[#d7b43e]">Pre-approval: $475,000</div>
                            <div className="text-[#b9b9b9] mt-1">Stay within budget range...</div>
                          </div>
                        </div>
                      )}
                      {index === 2 && (
                        <div className="bg-[#0f0f0f] rounded-lg p-4 max-w-xs mx-auto border border-[rgba(255,255,255,0.08)]">
                          <div className="bg-[#d7b43e] rounded-t-lg p-3 mb-3">
                            <div className="flex items-center justify-center">
                              <Smartphone className="w-8 h-8 text-black" />
                            </div>
                          </div>
                          <div className="text-xs text-[#eaeaea]">
                            <div className="text-center mb-4">
                              <div className="w-12 h-12 bg-[rgba(215,180,62,0.2)] rounded-full mx-auto mb-2 flex items-center justify-center border border-[rgba(215,180,62,0.3)]">
                                <Home className="w-6 h-6 text-[#d7b43e]" />
                              </div>
                              <div className="font-medium text-[#eaeaea]">Property Comparison</div>
                            </div>
                            <div className="space-y-1">
                              <div className="bg-[rgba(215,180,62,0.1)] rounded p-2 text-left border border-[rgba(255,255,255,0.08)]">
                                <div className="font-medium text-[#eaeaea]">123 Oak Street</div>
                                <div className="text-[#b9b9b9]">$425,000 • Great kitchen</div>
                              </div>
                              <div className="bg-[rgba(215,180,62,0.1)] rounded p-2 text-left border border-[rgba(255,255,255,0.08)]">
                                <div className="font-medium text-[#eaeaea]">456 Maple Ave</div>
                                <div className="text-[#b9b9b9]">$440,000 • Foundation issue</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 3 && (
                        <div className="bg-[#0f0f0f] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(255,255,255,0.08)]">
                          <div className="text-xs mb-3 text-[#eaeaea]">
                            <div className="font-semibold mb-2 text-[#d7b43e]">Shared with Realtor</div>
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-[rgba(215,180,62,0.2)] rounded-full mr-2 border border-[rgba(215,180,62,0.3)]"></div>
                              <span>Sarah Johnson</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#d7b43e]" />
                            </div>
                            
                            <div className="font-semibold mb-2 mt-3 text-[#d7b43e]">Shared with Lender</div>
                            <div className="flex items-center mb-1">
                              <div className="w-6 h-6 bg-[rgba(215,180,62,0.1)] rounded-full mr-2 border border-[rgba(255,255,255,0.08)]"></div>
                              <span>Mike Thompson</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#d7b43e]" />
                            </div>
                            <div className="text-[#b9b9b9] text-xs ml-8">First National Bank</div>
                            
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-[rgba(215,180,62,0.1)] rounded-full mr-2 border border-[rgba(255,255,255,0.08)]"></div>
                              <span>Alex Rivera</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#d7b43e]" />
                            </div>
                            <div className="text-[#b9b9b9] text-xs ml-8">Loan processor</div>
                            
                            <div className="font-semibold mb-2 mt-3 text-[#d7b43e]">Private access</div>
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-[rgba(215,180,62,0.3)] rounded-full mr-2 border border-[rgba(215,180,62,0.4)]"></div>
                              <span>Financial docs</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#d7b43e]" />
                            </div>
                            <div className="text-[#b9b9b9] text-xs ml-8">Secure sharing only</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="w-12 h-12 bg-[rgba(215,180,62,0.1)] border border-[rgba(255,255,255,0.08)] rounded-2xl flex items-center justify-center mb-6">
                      <IconComponent className="w-6 h-6 text-[#d7b43e]" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#eaeaea] mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-[#b9b9b9] mb-4 italic text-lg leading-relaxed">
                      {feature.description}
                    </p>
                    <p className="text-[#eaeaea] font-medium text-lg leading-relaxed">
                      {feature.detail}
                    </p>
                    <div className="mt-6">
                      <a 
                        href="#" 
                        className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.16)] text-[#eaeaea] bg-transparent px-4 py-2 rounded-full hover:border-[#d7b43e] hover:text-[#d7b43e] transition-colors text-sm focus:outline-none focus:ring-[0_0_0_1px_rgba(215,180,62,0.3),0_0_0_4px_rgba(215,180,62,0.12)]"
                      >
                        Open a sample vault →
                      </a>
                    </div>
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
            href="/pricing"
            data-testid="button-get-started-cta"
            className="bg-[var(--brand)] hover:bg-[var(--brand-2)] text-[var(--brand-ink)] px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block min-h-[44px]"
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
                  <div className="w-10 h-10 bg-[rgba(215,180,62,0.1)] border border-[rgba(255,255,255,0.08)] rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-[#d7b43e]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#eaeaea] mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#b9b9b9]">
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
                <div key={index} className="text-xs font-semibold text-[#b9b9b9] px-3 py-1 border border-[rgba(255,255,255,0.08)] rounded" aria-label={`${badge} compliant`}>
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#0f0f0f] border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#eaeaea] mb-4">
              What Our Members Say About FamilyVault
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 text-center min-h-[150px] relative hover:border-[rgba(215,180,62,0.35)] transition-colors duration-300">
                <div className="flex justify-center mb-2 text-[#d7b43e] tracking-wide">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-[#b9b9b9] italic mb-4 text-sm">"{testimonial.quote}"</p>
                <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden border-2 border-[#d7b43e]">
                  <img 
                    src={testimonial.image} 
                    alt={`${testimonial.name} profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <footer className="text-xs text-[#b9b9b9]">
                  <div className="font-semibold text-[#eaeaea]">{testimonial.name}</div>
                  <div>{testimonial.title}</div>
                </footer>
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
              <p className="text-[#D1D5DB] mb-4 h-12">For families starting to organize for home buying</p>
              <div className="text-3xl font-bold mb-6 text-[#F3F4F6]">$0</div>
              <button
                data-testid="button-get-started-free-plan"
                className="w-full bg-[var(--brand)] text-[var(--brand-ink)] py-3 rounded-full font-semibold mb-6 hover:bg-[var(--brand-2)] transition-colors"
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
                className="w-full bg-[var(--brand)] text-[var(--brand-ink)] py-3 rounded-full font-semibold mb-6 hover:bg-[var(--brand-2)] transition-colors"
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
                className="w-full bg-[var(--brand)] text-[var(--brand-ink)] py-3 rounded-full font-semibold mb-6 hover:bg-[var(--brand-2)] transition-colors"
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

      {/* Final CTA */}
      <section className="py-12 bg-gradient-to-b from-[rgba(215,180,62,0.04)] to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#eaeaea] mb-6">
            Ready to Simplify Your Home Buying Journey?
          </h2>
          <p className="text-[#b9b9b9] text-lg mb-8 max-w-2xl mx-auto">
            Start organizing your documents, research, and contacts with FamilyVault today.
          </p>
          <a
            href="/pricing"
            data-testid="button-final-cta"
            className="inline-flex items-center gap-2 bg-[var(--brand)] text-[var(--brand-ink)] font-semibold px-8 py-4 rounded-full hover:bg-[var(--brand-2)] transition-colors shadow-[0_6px_16px_rgba(246,195,61,0.35)] focus:outline-none focus:ring-[0_0_0_1px_rgba(246,195,61,0.3),0_0_0_4px_rgba(246,195,61,0.12)] min-h-[44px]"
          >
            Get started free
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}