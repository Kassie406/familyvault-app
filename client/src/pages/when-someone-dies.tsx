import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import memorialImage from "@assets/image_1756096658862.png";
import digitalSecurityImage from "@assets/image_1756096704415.png";
import mobileAppImage from "@assets/image_1756096804669.png";
import askExpertsImage from "@assets/image_1756096864006.png";
import michaelProfileImage from "@assets/generated_images/Michael_when_someone_dies_reviewer_headshot_7b4f832a.png";
import sarahProfileImage from "@assets/generated_images/Sarah_when_someone_dies_reviewer_headshot_9c5e6d14.png";
import davidProfileImage from "@assets/generated_images/David_when_someone_dies_reviewer_headshot_2a8f7b39.png";
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
  Banknote,
  CheckCircle,
  Calendar,
  Clock
} from "lucide-react";

export default function WhenSomeoneDies() {
  const deathPlanningCards = [
    {
      icon: FileText,
      title: "Estate Documentation",
      description: "Store wills, trust documents, death certificates, and legal papers.",
      action: "Add estate docs"
    },
    {
      icon: Banknote,
      title: "Financial Accounts",
      description: "Document bank accounts, investments, insurance policies, and debts.",
      action: "Add financial info"
    },
    {
      icon: Users,
      title: "Contact Management",
      description: "Organize important contacts for family, advisors, and service providers.",
      action: "Add contacts"
    },
    {
      icon: Bell,
      title: "Bills & Obligations",
      description: "Track recurring payments, subscriptions, and financial obligations.",
      action: "Add bills"
    },
    {
      icon: Shield,
      title: "Legal Responsibilities",
      description: "Manage probate requirements, legal notifications, and court documents.",
      action: "Add legal items"
    },
    {
      icon: Calendar,
      title: "Important Deadlines",
      description: "Keep track of estate settlement deadlines and required actions.",
      action: "Add deadlines"
    }
  ];

  const features = [
    {
      icon: Users,
      title: "Share Estate Information Securely",
      description: "Your siblings need access to your late father's estate documents, but sending important information via email feels unsafe.",
      detail: "Store and share wills, living trust documents, financial records, and more in FamilyVault's Family Operating System®."
    },
    {
      icon: FileText,
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

  const checklistItems = [
    "Estate document organization",
    "Financial account management",
    "Bill and deadline tracking",
    "Contact notification"
  ];

  const bottomFeatures = [
    {
      icon: Shield,
      title: "Secure Document Storage",
      description: "Keep sensitive estate documents safe and organized",
      image: digitalSecurityImage,
      imageAlt: "Digital security shield with circuit board background representing secure document storage"
    },
    {
      icon: Smartphone, 
      title: "Access Anywhere",
      description: "Get important information when you need it, wherever you are",
      image: mobileAppImage,
      imageAlt: "Mobile app interface showing browse screen with family document categories"
    },
    {
      icon: Phone,
      title: "Expert Support",
      description: "Get personalized help during difficult times",
      image: askExpertsImage,
      imageAlt: "Ask the Experts blackboard with lightbulbs representing expert consultation and guidance"
    }
  ];

  const testimonials = [
    { name: "Michael B.", title: "Member since 2022", rating: 5, quote: "After losing my wife, FamilyVault made managing her estate so much easier. Everything was organized and accessible when I needed it most.", image: michaelProfileImage },
    { name: "Sarah K.", title: "Member since 2021", rating: 5, quote: "The document sharing features helped our family coordinate during a difficult time. We could focus on grieving instead of searching for paperwork.", image: sarahProfileImage },
    { name: "David M.", title: "Member since 2023", rating: 5, quote: "Having all my father's financial information organized in FamilyVault saved us months of stress during probate.", image: davidProfileImage }
  ];

  return (
    <div className="min-h-screen" style={{background: 'var(--bg)', color: 'var(--text)'}}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 text-[#D4AF37] font-medium bg-[rgba(212,175,55,0.08)] px-3 py-1 rounded-full border border-[rgba(212,175,55,0.25)]">
                🕊️ When Someone Dies
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#F3F4F6] tracking-tight">
                FamilyVault for When Someone Dies
              </h1>
              <p className="text-[#D1D5DB] max-w-[65ch] text-lg">
                When you've lost someone close to you, grief can be overwhelming — but with FamilyVault's help, managing their estate doesn't have to be.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="/pricing"
                  data-testid="button-get-started-free"
                  className="bg-[var(--brand)] text-[var(--brand-ink)] font-semibold px-6 py-3 rounded-lg hover:bg-[var(--brand-2)] transition-colors min-h-[44px] flex items-center"
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
            <div className="rounded-xl overflow-hidden border border-[rgba(212,175,55,0.35)] bg-[#141414] h-72 md:h-[22rem]">
              <img 
                src={memorialImage} 
                alt="Peaceful memorial scene with white lilies and gentle lighting"
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
              Getting Organized After a Death in the Family
            </h2>
            <p className="text-[#D1D5DB] text-lg max-w-2xl mx-auto">
              The to-do list after a loved one's passing can feel endless. Here's how FamilyVault helps you manage key tasks with clarity and support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deathPlanningCards.map((card, index) => {
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
                    href={card.action === "Add estate docs" ? "/when-someone-dies-estate-documentation" :
                          card.action === "Add financial info" ? "/when-someone-dies-financial-accounts" :
                          card.action === "Add contacts" ? "/when-someone-dies-contact-management" :
                          card.action === "Add bills" ? "/when-someone-dies-bills-obligations" :
                          card.action === "Add legal items" ? "/when-someone-dies-legal-responsibilities" :
                          card.action === "Add deadlines" ? "/when-someone-dies-important-deadlines" : "#"}
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
                          <div className="text-xs mb-3 text-[#F3F4F6]">
                            <div className="flex items-center mb-2">
                              <div className="w-4 h-4 bg-[rgba(212,175,55,0.2)] rounded-full mr-2 border border-[rgba(212,175,55,0.3)]"></div>
                              <span className="font-semibold text-[#D4AF37]">Choose a collaborator</span>
                            </div>
                            <div className="bg-[rgba(212,175,55,0.1)] rounded p-2 mb-2 border border-[rgba(212,175,55,0.2)]">
                              <div className="flex items-center text-xs">
                                <div className="w-3 h-3 bg-[#D4AF37] rounded-full mr-2"></div>
                                <span>Mary Reynolds</span>
                                <span className="ml-auto text-[#9CA3AF]">Sister</span>
                              </div>
                            </div>
                            <div className="text-xs text-[#9CA3AF] mb-3">Add someone new</div>
                            <button className="bg-[#D4AF37] text-black px-3 py-1 rounded text-xs font-medium">Send now</button>
                          </div>
                          <div className="border-t border-[rgba(212,175,55,0.2)] pt-3">
                            <div className="flex items-center text-xs">
                              <div className="w-4 h-4 bg-[rgba(212,175,55,0.1)] rounded mr-2 flex items-center justify-center border border-[rgba(212,175,55,0.2)]">
                                <FileText className="w-2 h-2 text-[#D4AF37]" />
                              </div>
                              <div>
                                <div className="font-semibold text-[#F3F4F6]">Share Estate Information Securely</div>
                                <div className="text-[#9CA3AF] mt-1">Your siblings need access to your late father's estate documents, but sending important information via email feels unsafe.</div>
                              </div>
                            </div>
                            <div className="text-xs text-[#D1D5DB] mt-2">Store and share wills, living trust documents, financial records, and more in FamilyVault's Family Operating System®.</div>
                          </div>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="bg-[#141414] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(212,175,55,0.2)]">
                          <div className="text-xs text-[#F3F4F6]">
                            <div className="flex items-center mb-3">
                              <div className="w-3 h-3 bg-[rgba(212,175,55,0.2)] rounded mr-2 border border-[rgba(212,175,55,0.3)]"></div>
                              <span className="font-semibold text-[#D4AF37]">Accounts</span>
                            </div>
                            <div className="space-y-2 mb-3">
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-[rgba(212,175,55,0.1)] rounded mr-2 border border-[rgba(212,175,55,0.2)]"></div>
                                <span>Mary Reynolds 401k</span>
                                <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />
                              </div>
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-[rgba(212,175,55,0.1)] rounded mr-2 border border-[rgba(212,175,55,0.2)]"></div>
                                <span>Mary Reynolds at Bank of America</span>
                                <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />
                              </div>
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-[rgba(212,175,55,0.1)] rounded mr-2 border border-[rgba(212,175,55,0.2)]"></div>
                                <span>Planning Docs</span>
                                <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />
                              </div>
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-[rgba(212,175,55,0.1)] rounded mr-2 border border-[rgba(212,175,55,0.2)]"></div>
                                <span>Family Operating</span>
                                <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />
                              </div>
                            </div>
                            
                            <div className="border-t border-[rgba(212,175,55,0.2)] pt-3">
                              <div className="flex items-center mb-2">
                                <div className="w-4 h-4 bg-[rgba(212,175,55,0.1)] rounded mr-2 flex items-center justify-center border border-[rgba(212,175,55,0.2)]">
                                  <FileText className="w-2 h-2 text-[#D4AF37]" />
                                </div>
                                <span className="font-semibold text-[#F3F4F6]">Navigate Probate Requirements</span>
                              </div>
                              <div className="text-[#D1D5DB]">You are overwhelmed by probate after your sister's death, struggling to organize all of the documents you've collected.</div>
                              <div className="text-[#F3F4F6] mt-2">After a death, upload your loved one's important information to the Family Operating System® simplifying estate settlement.</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 2 && (
                        <div className="bg-[#141414] rounded-lg p-4 max-w-xs mx-auto border border-[rgba(212,175,55,0.2)]">
                          <div className="text-xs text-[#F3F4F6]">
                            <div className="flex items-center mb-3">
                              <Bell className="w-4 h-4 text-[#D4AF37] mr-2" />
                              <span className="font-semibold text-[#D4AF37]">Manage Bills and Accounts</span>
                            </div>
                            <div className="bg-[rgba(212,175,55,0.1)] rounded p-2 mb-3 border border-[rgba(212,175,55,0.2)]">
                              <div className="flex items-center">
                                <Building className="w-3 h-3 text-[#D4AF37] mr-2" />
                                <div>
                                  <div className="font-medium text-[#F3F4F6]">Pay Homeowners Insurance</div>
                                  <div className="text-[#D4AF37]">Steel Farm</div>
                                  <div className="text-[#9CA3AF]">June 1, 2025 • in 87 days</div>
                                </div>
                              </div>
                            </div>
                            <div className="text-[#D1D5DB] mb-2">You're trying to stay on top of your late spouse's bills, worried that a missed payment could cause problems.</div>
                            <div className="text-[#F3F4F6]">The Family Operating System's automated reminders help you keep track of important deadlines and expiration dates.</div>
                          </div>
                        </div>
                      )}
                      {index === 3 && (
                        <div className="bg-[#141414] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(212,175,55,0.2)]">
                          <div className="text-xs text-[#F3F4F6]">
                            <div className="flex justify-between items-center mb-3">
                              <span className="font-semibold text-[#D4AF37]">Search 115 contacts</span>
                              <div className="text-[#9CA3AF]">📞</div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <div className="w-6 h-6 bg-[rgba(212,175,55,0.2)] rounded-full mr-3 border border-[rgba(212,175,55,0.3)]"></div>
                                <div>
                                  <div className="font-medium text-[#F3F4F6]">Sandra Bennett</div>
                                  <div className="text-[#9CA3AF]">+1 881 859 5424</div>
                                </div>
                                <div className="ml-auto text-[#9CA3AF]">advisor</div>
                              </div>
                              <div className="flex items-center">
                                <div className="w-6 h-6 bg-[rgba(212,175,55,0.2)] rounded-full mr-3 border border-[rgba(212,175,55,0.3)]"></div>
                                <div>
                                  <div className="font-medium text-[#F3F4F6]">Andy Lynch</div>
                                  <div className="text-[#9CA3AF]">+1 884 867 7860</div>
                                </div>
                                <div className="ml-auto text-[#9CA3AF]">analyzer</div>
                              </div>
                              <div className="flex items-center">
                                <div className="w-6 h-6 bg-[rgba(212,175,55,0.2)] rounded-full mr-3 border border-[rgba(212,175,55,0.3)]"></div>
                                <div>
                                  <div className="font-medium text-[#F3F4F6]">Pamela Newman</div>
                                  <div className="text-[#9CA3AF]">+1 888 999 8961</div>
                                </div>
                                <div className="ml-auto text-[#9CA3AF]">advisor</div>
                              </div>
                            </div>
                            
                            <div className="border-t border-[rgba(212,175,55,0.2)] pt-3 mt-3">
                              <div className="flex items-center mb-2">
                                <Phone className="w-4 h-4 text-[#D4AF37] mr-2" />
                                <span className="font-semibold text-[#F3F4F6]">Notify Important Contacts</span>
                              </div>
                              <div className="text-[#D1D5DB]">Your mother had an extensive network of business partners who should be informed of her death, but you don't know their names.</div>
                              <div className="text-[#F3F4F6] mt-2">Encourage your loved ones to store and share their contacts with you through FamilyVault ahead of time, so you can be prepared.</div>
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
                <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden border-2 border-[rgba(212,175,55,0.25)]">
                  <img 
                    src={testimonial.image} 
                    alt={`${testimonial.name} profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
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
              <p className="text-[#D1D5DB] mb-4 h-12">For families preparing for when someone dies</p>
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
            Organize important information before it's needed most.
          </h2>
          <p className="text-[#D1D5DB] mb-8 text-lg">
            Begin organizing your family's estate information with FamilyVault today.
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