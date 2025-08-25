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

export default function HomeBuying() {
  const homeBuyingCards = [
    {
      icon: FileText,
      title: "Pre-Approval Documents",
      description: "Keep bank statements, pay stubs, and loan paperwork organized.",
      action: "Add financial docs"
    },
    {
      icon: Calculator,
      title: "Budget & Affordability",
      description: "Track down payment funds, monthly payment calculations, and closing costs.",
      action: "Add budget info"
    },
    {
      icon: Search,
      title: "Property Research",
      description: "Store listings, inspection reports, and neighborhood information.",
      action: "Add property info"
    },
    {
      icon: Home,
      title: "Home Inspection Records",
      description: "Organize inspection reports, repair estimates, and contractor details.",
      action: "Add inspection docs"
    },
    {
      icon: DollarSign,
      title: "Closing Documentation",
      description: "Store title documents, insurance policies, and final paperwork.",
      action: "Add closing docs"
    },
    {
      icon: Phone,
      title: "Professional Contacts",
      description: "Keep realtor, lender, inspector, and attorney contact information.",
      action: "Add contacts"
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
      description: "Secure document storage keeps your financial information protected"
    },
    {
      icon: Smartphone,
      title: "Access Information on the Go", 
      description: "View documents and information during showings and meetings"
    },
    {
      icon: Phone,
      title: "Share With Your Team",
      description: "Collaborate securely with realtors, lenders, and other professionals"
    }
  ];

  const testimonials = [
    { name: "Robert K.", title: "Member since 2022", rating: 5, quote: "FamilyVault kept all our home buying documents organized. We closed two weeks early because everything was ready to go!" },
    { name: "Jennifer M.", title: "Member since 2021", rating: 5, quote: "Being able to share our pre-approval documents securely with our realtor made the process so much smoother." },
    { name: "David S.", title: "Member since 2023", rating: 5, quote: "The ability to compare different properties with all our notes and photos in one place was invaluable." }
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
                🏠 Home Buying
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#F3F4F6] tracking-tight">
                FamilyVault for Home Buying
              </h1>
              <p className="text-[#D1D5DB] max-w-[65ch] text-lg">
                From pre-approval to closing day, the Family Operating System® keeps your home buying process organized, efficient, and stress-free.
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
                  data-testid="link-see-home-features"
                  className="text-[#D1D5DB] hover:text-[#F3F4F6] underline underline-offset-4 min-h-[44px] flex items-center"
                >
                  See home buying features →
                </a>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-[rgba(212,175,55,0.35)] bg-[#141414] h-72 md:h-[22rem]">
              <img 
                src={houseKeysImage} 
                alt="Hands holding house keys with wooden house keychain representing new home ownership"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Home Buying Cards */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F3F4F6] mb-4">
              How FamilyVault Supports Your Home Buying Journey
            </h2>
            <p className="text-[#D1D5DB] text-lg max-w-2xl mx-auto">
              Keep your documents, research, and contacts organized throughout the entire home buying process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeBuyingCards.map((card, index) => {
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
                              <span className="font-semibold text-[#F3F4F6]">Mortgage Documents</span>
                            </div>
                            <div className="space-y-2">
                              <div className="bg-[rgba(212,175,55,0.1)] rounded p-2 border border-[rgba(212,175,55,0.2)]">
                                <div className="text-xs text-[#D1D5DB]">Bank Statements (3 months)</div>
                              </div>
                              <div className="bg-[rgba(212,175,55,0.1)] rounded p-2 border border-[rgba(212,175,55,0.2)]">
                                <div className="text-xs text-[#D1D5DB]">Pay Stubs</div>
                              </div>
                              <div className="bg-[rgba(212,175,55,0.1)] rounded p-2 border border-[rgba(212,175,55,0.2)]">
                                <div className="text-xs text-[#D1D5DB]">Tax Returns</div>
                              </div>
                            </div>
                            <div className="mt-3 text-xs text-[#D4AF37]">
                              <div className="underline">Ready for pre-approval</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="bg-[#141414] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(212,175,55,0.2)]">
                          <div className="text-xs font-medium mb-3 text-[#F3F4F6]">Home Buying Budget</div>
                          <div className="bg-[rgba(212,175,55,0.1)] rounded p-3 mb-3 text-left border border-[rgba(212,175,55,0.2)]">
                            <div className="text-xs font-medium mb-2 text-[#F3F4F6]">Budget Breakdown:</div>
                            <ul className="text-xs space-y-1 text-[#D1D5DB]">
                              <li>• Max home price: $450,000</li>
                              <li>• Down payment: $90,000 (20%)</li>
                              <li>• Monthly payment: $2,100</li>
                              <li>• Closing costs: $9,000</li>
                              <li>• Emergency fund: $15,000</li>
                              <li>• Moving costs: $3,000</li>
                            </ul>
                          </div>
                          <div className="text-xs">
                            <div className="font-medium text-[#D4AF37]">Pre-approval: $475,000</div>
                            <div className="text-[#D1D5DB] mt-1">Stay within budget range...</div>
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
                                <Home className="w-6 h-6 text-[#D4AF37]" />
                              </div>
                              <div className="font-medium text-[#F3F4F6]">Property Comparison</div>
                            </div>
                            <div className="space-y-1">
                              <div className="bg-[rgba(212,175,55,0.1)] rounded p-2 text-left border border-[rgba(212,175,55,0.2)]">
                                <div className="font-medium text-[#F3F4F6]">123 Oak Street</div>
                                <div className="text-[#D1D5DB]">$425,000 • Great kitchen</div>
                              </div>
                              <div className="bg-[rgba(212,175,55,0.1)] rounded p-2 text-left border border-[rgba(212,175,55,0.2)]">
                                <div className="font-medium text-[#F3F4F6]">456 Maple Ave</div>
                                <div className="text-[#D1D5DB]">$440,000 • Foundation issue</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 3 && (
                        <div className="bg-[#141414] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(212,175,55,0.2)]">
                          <div className="text-xs mb-3 text-[#F3F4F6]">
                            <div className="font-semibold mb-2 text-[#D4AF37]">Shared with Realtor</div>
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-[rgba(212,175,55,0.2)] rounded-full mr-2 border border-[rgba(212,175,55,0.3)]"></div>
                              <span>Sarah Johnson</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />
                            </div>
                            
                            <div className="font-semibold mb-2 mt-3 text-[#D4AF37]">Shared with Lender</div>
                            <div className="flex items-center mb-1">
                              <div className="w-6 h-6 bg-[rgba(212,175,55,0.1)] rounded-full mr-2 border border-[rgba(212,175,55,0.2)]"></div>
                              <span>Mike Thompson</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />
                            </div>
                            <div className="text-[#D1D5DB] text-xs ml-8">First National Bank</div>
                            
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-[rgba(212,175,55,0.1)] rounded-full mr-2 border border-[rgba(212,175,55,0.2)]"></div>
                              <span>Alex Rivera</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />
                            </div>
                            <div className="text-[#D1D5DB] text-xs ml-8">Loan processor</div>
                            
                            <div className="font-semibold mb-2 mt-3 text-[#D4AF37]">Private access</div>
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-[rgba(212,175,55,0.3)] rounded-full mr-2 border border-[rgba(212,175,55,0.4)]"></div>
                              <span>Financial docs</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />
                            </div>
                            <div className="text-[#D1D5DB] text-xs ml-8">Secure sharing only</div>
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
                    <IconComponent className="w-12 h-12 text-[#D4AF37]" />
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
            Start your home buying journey organized and prepared.
          </h2>
          <p className="text-[#D1D5DB] mb-8 text-lg">
            Begin organizing your home buying information with FamilyVault today.
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