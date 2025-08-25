import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import emergencyChecklistImage from "@assets/image_1756091492533.png";
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
  Lock,
  CheckCircle,
  Activity,
  Calendar,
  Home,
  PiggyBank
} from "lucide-react";

export default function ElderlyParents() {
  const elderCareCards = [
    {
      icon: Heart,
      title: "Medical Information",
      description: "Store medications, doctor contacts, and medical directives for easy access.",
      action: "Add medical info"
    },
    {
      icon: DollarSign,
      title: "Financial Documents",
      description: "Keep bank accounts, insurance policies, and important bills organized.",
      action: "Add finances"
    },
    {
      icon: Phone,
      title: "Emergency Contacts",
      description: "Store healthcare providers, family members, and legal representatives.",
      action: "Add contacts"
    },
    {
      icon: FileText,
      title: "Legal Documents",
      description: "Organize wills, power of attorney, and advance directives.",
      action: "Add documents"
    },
    {
      icon: Home,
      title: "Property Information",
      description: "Document home ownership, utilities, and important property details.",
      action: "Add property info"
    },
    {
      icon: Users,
      title: "Care Team Access",
      description: "Share information with family members and healthcare providers.",
      action: "Manage access"
    }
  ];

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

  const checklistItems = [
    "Medical care coordination",
    "Financial document access", 
    "Emergency contact management",
    "Family information sharing"
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

  const testimonials = [
    { name: "Sarah M.", title: "Daughter & Caregiver", rating: 5, quote: "FamilyVault helped me organize all of Mom's medical information in one secure place." },
    { name: "David L.", title: "Son & Financial POA", rating: 5, quote: "Managing Dad's finances became so much easier with everything organized digitally." },
    { name: "Maria C.", title: "Healthcare Advocate", rating: 5, quote: "Having quick access to medical directives during emergencies was invaluable." }
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
    <div className="min-h-screen bg-[#0B0B0B] text-[#F3F4F6]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 text-[#D4AF37] font-medium bg-[rgba(212,175,55,0.08)] px-3 py-1 rounded-full border border-[rgba(212,175,55,0.25)]">
                ❤️ Helping Elderly Parents
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#F3F4F6] tracking-tight">
                FamilyVault for Helping Elderly Parents
              </h1>
              <p className="text-[#D1D5DB] max-w-[65ch] text-lg">
                Caring for your aging parents doesn't have to be overwhelming — knowing when to act and what steps to take can make the journey less daunting.
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
                  data-testid="link-see-elder-care-features"
                  className="text-[#D1D5DB] hover:text-[#F3F4F6] underline underline-offset-4 min-h-[44px] flex items-center"
                >
                  See elder care features →
                </a>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-[rgba(212,175,55,0.35)] bg-[#141414] h-72 md:h-[22rem]">
              <img 
                src={emergencyChecklistImage} 
                alt="Emergency preparedness checklist document showing disaster planning information"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Elder Care Cards */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F3F4F6] mb-4">
              Conquer the Challenges of Elder Care
            </h2>
            <p className="text-[#D1D5DB] text-lg max-w-2xl mx-auto">
              FamilyVault helps you take charge of your parents' important information and make sure they get the care and support they deserve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elderCareCards.map((card, index) => {
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
                          <div className="flex items-center mb-3">
                            <Stethoscope className="w-5 h-5 text-[#D4AF37] mr-2" />
                            <span className="font-semibold text-sm text-[#F3F4F6]">Medical Directive</span>
                          </div>
                          <div className="text-xs text-[#D1D5DB] text-left space-y-1">
                            <div className="font-medium text-[#F3F4F6]">Sarah Reynolds</div>
                            <div>Date required: Feb 12, 2024</div>
                            <div>Location of original: Office desk</div>
                            <div className="mt-2 text-[#D4AF37] font-medium">Emergency: Call David (Son)</div>
                          </div>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="bg-[#141414] rounded-xl p-4 max-w-xs mx-auto border border-[rgba(212,175,55,0.2)]">
                          <div className="bg-[#D4AF37] text-black text-center py-2 rounded-t text-sm font-semibold mb-3">
                            Finance Dashboard
                          </div>
                          <div className="space-y-2 text-xs text-[#F3F4F6]">
                            <div className="flex justify-between bg-[rgba(212,175,55,0.1)] p-2 rounded">
                              <span>🏦 Chase Premium Savings</span>
                              <span className="text-[#D4AF37]">$12,450</span>
                            </div>
                            <div className="flex justify-between bg-[rgba(212,175,55,0.1)] p-2 rounded"> 
                              <span>💳 Chase High Interest</span>
                              <span className="text-[#D4AF37]">$8,200</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 2 && (
                        <div className="bg-[#141414] rounded-xl p-4 max-w-xs mx-auto text-[#F3F4F6] border border-[rgba(212,175,55,0.2)]">
                          <div className="text-center mb-4">
                            <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full mx-auto mb-2 flex items-center justify-center border border-[rgba(212,175,55,0.25)]">
                              <span className="text-2xl">👤</span>
                            </div>
                            <div className="font-semibold text-[#F3F4F6]">David Reynolds</div>
                            <div className="text-sm text-[#D4AF37]">Financial Agent</div>
                          </div>
                          <div className="text-xs space-y-1 text-[#D1D5DB]">
                            <div>(555) 123-4567</div>
                            <div>david.reynolds@email.com</div>
                            <div className="text-[#D4AF37] font-medium">Power of Attorney: Active</div>
                          </div>
                        </div>
                      )}
                      {index === 3 && (
                        <div className="bg-[#141414] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(212,175,55,0.2)]">
                          <div className="text-sm font-semibold mb-3 text-[#F3F4F6]">Family Access</div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-[#D4AF37] rounded-full mr-2"></div>
                                <div>
                                  <div className="text-xs font-medium text-[#F3F4F6]">Leo Carter</div>
                                  <div className="text-xs text-[#D1D5DB]">Son</div>
                                </div>
                              </div>
                              <span className="text-xs bg-[rgba(212,175,55,0.2)] text-[#D4AF37] px-2 py-1 rounded border border-[rgba(212,175,55,0.3)]">Full access</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-[rgba(212,175,55,0.6)] rounded-full mr-2"></div>
                                <div>
                                  <div className="text-xs font-medium text-[#F3F4F6]">Mika Carter</div>
                                  <div className="text-xs text-[#D1D5DB]">Daughter</div>
                                </div>
                              </div>
                              <span className="text-xs bg-[rgba(212,175,55,0.1)] text-[#D1D5DB] px-2 py-1 rounded border border-[rgba(212,175,55,0.2)]">Partial access</span>
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

      {/* Resources Section */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F3F4F6] mb-4">
              Essential Resources for Supporting Your Elderly Parents
            </h2>
            <p className="text-[#D1D5DB] text-lg">
              Explore expert advice for helping your aging parents through important life decisions, managing their finances, and safeguarding their well-being.
            </p>
          </div>

          {/* Featured Checklist */}
          <div className="bg-[#141414] rounded-2xl p-8 lg:p-12 mb-16 border border-[rgba(212,175,55,0.2)]">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <div className="w-48 h-64 bg-[rgba(212,175,55,0.1)] rounded-lg flex items-center justify-center border border-[rgba(212,175,55,0.25)]">
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
                    <p className="text-[#9CA3AF]">Checklist Cover</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#D4AF37] mb-2">FEATURED CHECKLIST</div>
                <h3 className="text-2xl font-bold text-[#F3F4F6] mb-4">
                  Helping Your Elderly Parents
                </h3>
                <p className="text-[#D1D5DB] mb-6">
                  A helpful checklist covering healthcare, legal, and financial essentials — so you can stay organized and focused on supporting your parents.
                </p>
                <a
                  href="#"
                  data-testid="button-download-checklist"
                  className="bg-[#D4AF37] hover:bg-[#C7A233] text-black px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center min-h-[44px]"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download free checklist
                </a>
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="space-y-6">
            {articles.map((article, index) => (
              <div key={index} className="bg-[#141414] rounded-lg p-6 border border-[rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.35)] transition-colors">
                <h3 className="text-xl font-semibold text-[#F3F4F6] mb-2">
                  {article.title}
                </h3>
                <p className="text-[#D1D5DB] mb-4">
                  {article.description}
                </p>
                <a 
                  href="#"
                  data-testid={`link-read-article-${index + 1}`}
                  className="text-[#D4AF37] hover:text-[#C7A233] font-medium inline-flex items-center min-h-[44px]"
                >
                  Read article →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bar */}
      <section className="py-16 bg-gradient-to-r from-transparent to-[rgba(212,175,55,0.08)] border-t border-[rgba(212,175,55,0.25)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#F3F4F6] mb-4">
            Give your parents the organized care they deserve.
          </h2>
          <p className="text-[#D1D5DB] mb-8 text-lg">
            Start organizing your family's important information today.
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