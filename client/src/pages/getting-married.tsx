import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { 
  Heart, 
  FileText, 
  Users, 
  Home, 
  DollarSign,
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
  Phone
} from "lucide-react";

export default function GettingMarried() {
  const features = [
    {
      icon: FileText,
      title: "Organize Your Documents",
      description: "You saved your wedding contracts and receipts in email — but you must've accidentally deleted the one you need now.",
      detail: "Keep vital documents in FamilyVault's secure, searchable digital vault — no digging through an inbox needed."
    },
    {
      icon: Users,
      title: "Access Important Contacts",
      description: "You need to reschedule a home repair but can't reach the contractor — your wife has the information and she isn't available.",
      detail: "Keep shared contacts in FamilyVault so either of you can find who you need, when you need them."
    },
    {
      icon: Home,
      title: "Coordinate Home Maintenance", 
      description: "You thought your spouse had scheduled the HVAC service — but the system breaks down right before guests arrive.",
      detail: "FamilyVault lets you store service records and set shared reminders for recurring tasks around the house."
    },
    {
      icon: DollarSign,
      title: "Share Financial Details",
      description: "You didn't talk about debt before the wedding — and you learn that your new husband owes tens of thousands on his credit cards.",
      detail: "By storing records on FamilyVault, you and your new spouse will maintain a clear picture of each other's finances going forward."
    }
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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-yellow-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                FamilyVault for Getting Married
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Marriage brings big life changes — and the Family Operating System® keeps your most important information secure and shareable, before and long after your wedding day.
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
              <div className="bg-yellow-50 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="flex justify-center items-center mb-4">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl">💍</span>
                    </div>
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💍</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg">Wedding rings on elegant background</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How FamilyVault Helps */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How FamilyVault Helps — Through Every Step of Marriage
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From planning your wedding to combining finances and updating beneficiaries, FamilyVault keeps your information aligned, accessible, and ready when you need it.
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
                            <div className="bg-black rounded-2xl p-4 shadow-lg max-w-xs mx-auto">
                              <div className="bg-gray-800 text-white text-center py-2 rounded-t text-sm font-semibold mb-3">
                                Browse
                              </div>
                              <div className="space-y-2 text-xs text-white">
                                <div className="flex justify-between items-center py-1">
                                  <span>📄 Family Info</span>
                                  <span>📄 Finance</span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                  <span>🏠 Property</span>
                                  <span>📋 Documents</span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                  <span>📊 Taxes</span>
                                  <span>📖 Resources</span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 1 && (
                          <>
                            <div className="bg-gray-200 rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="text-sm font-semibold mb-3 text-left">📞 Shared HR Contacts</div>
                              <div className="space-y-2 text-xs">
                                {[
                                  { name: "Sophia Bennett", phone: "+1 647 524 1234", type: "Lawyer" },
                                  { name: "Andy Lynch", phone: "+1 647 567 8990", type: "Advisor" },
                                  { name: "Monica Miranda", phone: "+1 647 890 4567", type: "Office" },
                                  { name: "Jose Hampton", phone: "+1 647 234 5678", type: "Warranty" },
                                  { name: "Tina Jefferson", phone: "+1 647 345 6789", type: "Service" },
                                  { name: "Katie Lauder", phone: "+1 855 456 7890", type: "Service" }
                                ].map((contact, i) => (
                                  <div key={i} className="flex items-center justify-between py-1 border-b border-gray-300 last:border-b-0">
                                    <div className="flex items-center">
                                      <div className="w-6 h-6 bg-blue-500 rounded-full mr-2"></div>
                                      <div>
                                        <div className="font-medium text-gray-900">{contact.name}</div>
                                        <div className="text-gray-600">{contact.phone}</div>
                                      </div>
                                    </div>
                                    <span className="text-gray-500">{contact.type}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                        {index === 2 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="flex items-center mb-3">
                                <Home className="w-5 h-5 text-blue-600 mr-2" />
                                <span className="font-semibold text-sm">Property</span>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-blue-50 rounded p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm">Home Warranty</span>
                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">Warranty</span>
                                  </div>
                                  <div className="text-xs text-gray-600 space-y-1">
                                    <div>Premium Shield</div>
                                    <div>Date required: Jul 15, 2024</div>
                                    <div>Location of original: Office desk</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 3 && (
                          <>
                            <div className="bg-black rounded-2xl p-4 shadow-lg max-w-xs mx-auto">
                              <div className="bg-blue-600 text-white text-center py-2 rounded-t text-sm font-semibold mb-3">
                                Finance
                              </div>
                              <div className="space-y-2 text-xs text-white">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
                                    <span>🏦</span>
                                  </div>
                                  <div>
                                    <div className="font-medium">Chase Premium Savings</div>
                                    <div className="text-gray-400">Savings **4567</div>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
                                    <span>💳</span>
                                  </div>
                                  <div>
                                    <div className="font-medium">Chase High Interest</div>
                                    <div className="text-gray-400">Checking **9012</div>
                                  </div>
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
                  <div className="bg-gray-100 rounded-2xl p-8 h-48 flex items-center justify-center mb-6">
                    <IconComponent className="w-12 h-12 text-[#FFD700]" />
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

      {/* Love Isn't All You Need */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Love Isn't All You Need — Marriage Takes Logistics
            </h2>
            <p className="text-lg text-gray-600">
              From merging finances to preparing for the unexpected, these articles and videos explore the practical side of partnership.
            </p>
          </div>

          {/* Featured Checklist */}
          <div className="bg-gray-100 rounded-2xl p-8 lg:p-12 mb-16">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <div className="w-48 h-64 bg-[#FFD700]/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
                    <p className="text-gray-600">Wedding bouquet with checklist</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#FFD700] mb-2">FEATURED CHECKLIST</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Essential Steps When You're Getting Married
                </h3>
                <p className="text-gray-600 mb-6">
                  A strong marriage is more than a union of hearts. This checklist ensures couples can ensure they start their journey together on a strong foundation, financially and legally.
                </p>
                <button
                  data-testid="button-get-checklist"
                  className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Get the checklist
                </button>
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-8">Articles</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Merging Your Financial Lives: A Complete Guide for Newlyweds",
                  description: "Essential steps for combining finances and building wealth together"
                },
                {
                  title: "Legal Documents Every Married Couple Should Have",
                  description: "Protect your partnership with proper legal planning and documentation"  
                },
                {
                  title: "Insurance Changes After Marriage: What You Need to Know",
                  description: "Navigate beneficiary updates and coverage options for married couples"
                }
              ].map((article, index) => (
                <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <Heart className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-2 leading-snug">
                      {article.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {article.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}