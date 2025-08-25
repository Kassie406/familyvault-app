import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import thoughtfulWorkerImage from "@assets/image_1756096911806.png";
import digitalSecurityImage from "@assets/image_1756096953729.png";
import mobileAppImage from "@assets/image_1756097026485.png";
import askExpertsImage from "@assets/image_1756097099598.png";
import { 
  Brain,
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
  Calendar,
  Clock,
  Stethoscope,
  Play
} from "lucide-react";

export default function Neurodiversity() {
  const features = [
    {
      icon: Stethoscope,
      title: "Managing Medical Information",
      description: "You're seeing a medical specialist and can't remember which prescriptions you've tried or when your symptoms started.",
      detail: "FamilyVault centralizes your medical history, treatment notes, and symptom tracking, so you can quickly access what you need."
    },
    {
      icon: Calendar,
      title: "Staying Organized During Executive Function Challenges",
      description: "It's tax season and you're overwhelmed trying to gather receipts, W-2s and bank statements while managing work deadlines and daily tasks.",
      detail: "FamilyVault's automated organization helps you find important documents quickly, reducing cognitive load during stressful periods."
    },
    {
      icon: Phone,
      title: "Preparing for Life Transitions",
      description: "You need to provide background check documents for a new job, but gathering all that information is time-consuming and chaotic.",
      detail: "FamilyVault keeps your professional documents organized and easily shareable, letting you focus on the transition."
    },
    {
      icon: Shield,
      title: "Protecting Your Routine and Information",
      description: "You lose your phone — and all access to passwords, phone numbers, and the digital copies of documents you'd kept on it.",
      detail: "FamilyVault securely backs up your essential information and lets you access it from any device."
    }
  ];

  const bottomFeatures = [
    {
      icon: Upload,
      title: "Back Up Your Data Easily",
      description: "Automatic cloud backup keeps everything safe",
      image: digitalSecurityImage,
      imageAlt: "Digital security shield with circuit board background representing secure data backup"
    },
    {
      icon: Smartphone, 
      title: "Use FamilyVault on the Go",
      description: "Access your information anywhere with our mobile app",
      image: mobileAppImage,
      imageAlt: "Mobile app interface showing organized family document categories and search functionality"
    },
    {
      icon: Phone,
      title: "Connect With an Expert",
      description: "Get personalized help organizing your family's documents",
      image: askExpertsImage,
      imageAlt: "Blackboard with 'Ask the Experts' text and lightbulbs, representing expert consultation and guidance"
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
    { name: "Alex R.", title: "Member since 2022", rating: 5, quote: "FamilyVault has been a game-changer for managing my ADHD. Having everything organized in one place reduces my stress and helps me stay on top of important tasks." },
    { name: "Jordan M.", title: "Member since 2021", rating: 5, quote: "As someone with autism, routine and organization are crucial for me. FamilyVault helps maintain my structure while keeping important information accessible." },
    { name: "Sam K.", title: "Member since 2023", rating: 5, quote: "The document organization features help me during executive function challenges. I don't have to stress about finding important paperwork anymore." }
  ];

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-[#e9e9e9]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 text-[#f4c542] font-semibold bg-[rgba(244,197,66,0.04)] px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.06)] text-sm tracking-wide">
                🧠 Neurodiversity
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-[#e9e9e9] tracking-tight leading-tight">
                FamilyVault for Neurodivergent Individuals
              </h1>
              <p className="text-[#b3b3b3] text-lg leading-relaxed">
                Navigate life with confidence: The Family Operating System® keeps your essential information organized, accessible, and stress-free, supporting your own way of thinking and processing.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="/signup"
                  data-testid="button-get-started"
                  className="inline-flex items-center gap-2 bg-[#f4c542] text-[#111] font-semibold px-6 py-3 rounded-full hover:bg-[#d4aa2e] transition-colors min-h-[44px] shadow-[0_6px_16px_rgba(244,197,66,0.35)] focus:outline-none focus:ring-[0_0_0_1px_rgba(244,197,66,0.3),0_0_0_4px_rgba(244,197,66,0.12)]"
                >
                  Get started free
                </a>
                <a 
                  href="#features"
                  data-testid="link-see-features"
                  className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.16)] text-[#e9e9e9] bg-transparent px-6 py-3 rounded-full hover:border-[#f4c542] hover:text-[#f4c542] transition-colors min-h-[44px] focus:outline-none focus:ring-[0_0_0_1px_rgba(244,197,66,0.3),0_0_0_4px_rgba(244,197,66,0.12)]"
                >
                  See neurodiversity features →
                </a>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-[#111] shadow-[0_8px_24px_rgba(0,0,0,0.35)] border border-[rgba(244,197,66,0.35)] order-first lg:order-last">
              <img 
                src={thoughtfulWorkerImage} 
                alt="Young man with glasses and cap working thoughtfully, representing focus and concentration"
                className="w-full h-full object-cover block"
                width="640"
                height="480"
                fetchpriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-[rgba(255,255,255,0.06)] mx-4 sm:mx-6 lg:mx-8" aria-hidden="true"></div>

      {/* Customer Story Section */}
      <section className="py-20 bg-[#0b0b0b] border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#e9e9e9] mb-4">
            How FamilyVault Makes It Easier to Feel Prepared and in Control
          </h2>
          <p className="text-lg text-[#b3b3b3] max-w-3xl mx-auto mb-12">
            Daniel J. and his partner live with autism and ADHD, and they know it can be hard to keep life organized when juggling documents, deadlines, and decisions.
          </p>
          
          <div className="bg-[#111] border border-[rgba(255,255,255,0.12)] rounded-2xl p-8 lg:p-12 relative">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-[#e9e9e9] mb-4">Daniel J.</h3>
                <h4 className="text-lg font-semibold text-[#b3b3b3] mb-4">Why FamilyVault?<br />The Family Operating System®</h4>
                <div className="bg-[#f4c542] text-[#111] px-4 py-2 rounded text-sm inline-block mb-4 font-semibold">
                  FamilyVault.
                </div>
                <div className="absolute top-8 right-8 bg-[#f4c542] rounded-full p-4 shadow-lg">
                  <Play className="w-8 h-8 text-[#111]" />
                </div>
              </div>
              <div className="bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
                <div className="flex justify-center mb-2 text-[#f4c542] tracking-wide">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-[#b3b3b3] italic mb-4 text-sm">
                  "I use FamilyVault on a daily basis. I found this app to be game-changing for me. And it's not just for me, but for my whole family."
                </blockquote>
                <footer className="text-xs text-[#b3b3b3] text-left">
                  <div className="font-semibold text-[#e9e9e9]">Daniel J.</div>
                  <div>FamilyVault member since 2024</div>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-[rgba(255,255,255,0.06)] mx-4 sm:mx-6 lg:mx-8" aria-hidden="true"></div>

      {/* How FamilyVault Helps */}
      <section id="features" className="py-20 bg-[#0b0b0b] border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#e9e9e9] mb-4">
            How FamilyVault Helps — Supporting Your Neurodivergent Life
          </h2>
          <p className="text-lg text-[#b3b3b3] max-w-3xl mx-auto">
            From medical records to daily schedules, FamilyVault adapts to your cognitive style, reducing overwhelm and keeping your essential information exactly where you need it.
          </p>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-[rgba(255,255,255,0.06)] mx-4 sm:px-6 lg:px-8" aria-hidden="true"></div>

      {/* Features */}
      <section className="py-20 bg-[#0b0b0b] border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 min-h-[280px] flex items-center justify-center">
                      <div className="text-center">
                        {index === 0 && (
                          <>
                            <div className="bg-[#0b0b0b] border border-[rgba(255,255,255,0.08)] rounded-lg p-4 max-w-sm mx-auto">
                              <div className="text-xs mb-3">
                                <div className="flex items-center mb-3">
                                  <div className="w-6 h-6 bg-[rgba(244,197,66,0.1)] rounded mr-2 flex items-center justify-center">
                                    <Stethoscope className="w-4 h-4 text-[#f4c542]" />
                                  </div>
                                  <span className="font-semibold text-[#e9e9e9]">Family IDs</span>
                                </div>
                                <div className="bg-[rgba(244,197,66,0.1)] border border-[rgba(255,255,255,0.08)] rounded p-2 mb-3">
                                  <div className="text-center">
                                    <div className="font-medium text-[#e9e9e9]">Medical Directive</div>
                                    <div className="text-[#b3b3b3]">Scott Reynolds</div>
                                    <div className="text-xs text-[#b3b3b3]">February 12, 2016</div>
                                    <div className="text-xs text-[#b3b3b3]">Created by insurance • Other docs</div>
                                  </div>
                                </div>
                                <div className="text-xs text-[#e9e9e9]">
                                  <div className="font-medium">Managing Medical Information</div>
                                  <div className="text-[#b3b3b3] mt-1">You're seeing a medical specialist and can't remember which prescriptions you've tried or when your symptoms started.</div>
                                  <div className="text-[#e9e9e9] mt-2">FamilyVault centralizes your medical history, treatment notes, and symptom tracking, so you can quickly access what you need.</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 1 && (
                          <>
                            <div className="bg-[#0b0b0b] border border-[rgba(255,255,255,0.08)] rounded-lg p-4 max-w-sm mx-auto">
                              <div className="text-xs text-[#e9e9e9]">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded p-2">
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 bg-[#b3b3b3] rounded mr-2"></div>
                                      <span>Family IDs</span>
                                    </div>
                                    <div className="text-[#b3b3b3]">5</div>
                                  </div>
                                  <div className="flex items-center justify-between bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded p-2">
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 bg-[#b3b3b3] rounded mr-2"></div>
                                      <span>Finances</span>
                                    </div>
                                    <div className="text-[#b3b3b3]">4</div>
                                  </div>
                                  <div className="flex items-center justify-between bg-[rgba(244,197,66,0.1)] border border-[rgba(255,255,255,0.08)] rounded p-2">
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 bg-[#f4c542] rounded mr-2"></div>
                                      <span>2024 John Taxed</span>
                                    </div>
                                    <div className="text-[#b3b3b3]">5</div>
                                  </div>
                                  <div className="flex items-center justify-between bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded p-2">
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 bg-[#b3b3b3] rounded mr-2"></div>
                                      <span>2024 Tax Receipts</span>
                                    </div>
                                    <div className="text-[#b3b3b3]">5</div>
                                  </div>
                                </div>
                                
                                <div className="border-t border-[rgba(255,255,255,0.08)] pt-3 mt-3">
                                  <div className="flex items-center mb-2">
                                    <Calendar className="w-4 h-4 text-[#f4c542] mr-2" />
                                    <span className="font-semibold text-[#e9e9e9]">Staying Organized During Executive Function Challenges</span>
                                  </div>
                                  <div className="text-[#b3b3b3]">It's tax season and you're overwhelmed trying to gather receipts, W-2s and bank statements while managing work deadlines and daily tasks.</div>
                                  <div className="text-[#e9e9e9] mt-2">FamilyVault's automated organization helps you find important documents quickly, reducing cognitive load during stressful periods.</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 2 && (
                          <>
                            <div className="bg-[#0b0b0b] border border-[rgba(255,255,255,0.08)] rounded-lg p-4 max-w-xs mx-auto">
                              <div className="text-xs text-[#e9e9e9]">
                                <div className="bg-[#f4c542] rounded-t-lg p-3 mb-3">
                                  <div className="flex items-center justify-center">
                                    <Smartphone className="w-8 h-8 text-[#111]" />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="text-center text-[#f4c542] mb-3">
                                    <div className="w-8 h-8 bg-[rgba(244,197,66,0.1)] border border-[rgba(255,255,255,0.08)] rounded-full mx-auto mb-2 flex items-center justify-center">
                                      <FileText className="w-4 h-4 text-[#f4c542]" />
                                    </div>
                                    <div className="font-medium">Browse</div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span>Family IDs</span>
                                      <span>Contacts</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Finances</span>
                                      <span>Documents</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Property</span>
                                      <span>Passwords</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Insurance</span>
                                      <span>Tasks</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="border-t border-[rgba(255,255,255,0.08)] pt-3 mt-3">
                                  <div className="flex items-center mb-2">
                                    <Phone className="w-4 h-4 text-[#f4c542] mr-2" />
                                    <span className="font-semibold text-[#e9e9e9]">Preparing for Life Transitions</span>
                                  </div>
                                  <div className="text-[#b3b3b3]">You need to provide background check documents for a new job, but gathering all that information is time-consuming and chaotic.</div>
                                  <div className="text-[#e9e9e9] mt-2">FamilyVault keeps your professional documents organized and easily shareable, letting you focus on the transition.</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 3 && (
                          <>
                            <div className="bg-[#0b0b0b] border border-[rgba(255,255,255,0.08)] rounded-lg p-4 max-w-sm mx-auto">
                              <div className="text-xs text-[#e9e9e9]">
                                <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded p-3 mb-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Laptop Settings</span>
                                    <div className="text-[#f4c542]">⚙️</div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span>Luncery</span>
                                      <div className="w-4 h-4 bg-[#b3b3b3] rounded"></div>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Apertory</span>
                                      <div className="w-4 h-4 bg-[#b3b3b3] rounded"></div>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Settings</span>
                                      <div className="w-4 h-4 bg-[#b3b3b3] rounded"></div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="border-t border-[rgba(255,255,255,0.08)] pt-3">
                                  <div className="flex items-center mb-2">
                                    <Shield className="w-4 h-4 text-[#f4c542] mr-2" />
                                    <span className="font-semibold text-[#e9e9e9]">Protecting Your Routine and Information</span>
                                  </div>
                                  <div className="text-[#b3b3b3]">You lose your phone — and all access to passwords, phone numbers, and the digital copies of documents you'd kept on it.</div>
                                  <div className="text-[#e9e9e9] mt-2">FamilyVault securely backs up your essential information and lets you access it from any device.</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''} style={{maxWidth: '560px'}}>
                    <div className="w-7 h-7 bg-[rgba(244,197,66,0.1)] border border-[rgba(255,255,255,0.08)] rounded-full flex items-center justify-center mb-6">
                      <IconComponent className="w-4 h-4 text-[#f4c542]" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold text-[#e9e9e9] mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-[#b3b3b3] mb-4 italic">
                      {feature.description}
                    </p>
                    <p className="text-[#e9e9e9] font-medium">
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
                    {feature.image ? (
                      <img 
                        src={feature.image} 
                        alt={feature.imageAlt}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <IconComponent className="w-12 h-12 text-[#FFD700]" />
                    )}
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
      <section className="py-20 bg-[#0b0b0b] border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#e9e9e9] mb-6">
              Your Data Is Always Protected
            </h2>
            <p className="text-lg text-[#b3b3b3] max-w-3xl mx-auto">
              Your sensitive information stays private and secure with advanced security and compliance practices.
            </p>
            <div className="mt-8">
              <a
                href="/security"
                className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.16)] text-[#e9e9e9] bg-transparent px-4 py-2 rounded-full hover:border-[#f4c542] hover:text-[#f4c542] transition-colors min-h-[44px] focus:outline-none focus:ring-[0_0_0_1px_rgba(244,197,66,0.3),0_0_0_4px_rgba(244,197,66,0.12)]"
                aria-label="Learn more about our security measures"
              >
                About our security
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start">
                  <div className="w-10 h-10 bg-[rgba(244,197,66,0.1)] border border-[rgba(255,255,255,0.08)] rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-[#f4c542]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#e9e9e9] mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#b3b3b3]">
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
              <div className="text-xs font-semibold text-[#b3b3b3] px-3 py-1 border border-[rgba(255,255,255,0.08)] rounded" aria-label="EU GDPR compliant">EU GDPR</div>
              <div className="text-xs font-semibold text-[#b3b3b3] px-3 py-1 border border-[rgba(255,255,255,0.08)] rounded" aria-label="SOC 2 TYPE II compliant">SOC 2 TYPE II</div>
              <div className="text-xs font-semibold text-[#b3b3b3] px-3 py-1 border border-[rgba(255,255,255,0.08)] rounded" aria-label="SOC 3 compliant">SOC 3</div>
              <div className="text-xs font-semibold text-[#b3b3b3] px-3 py-1 border border-[rgba(255,255,255,0.08)] rounded" aria-label="HIPAA compliant">HIPAA</div>
              <div className="text-xs font-semibold text-[#b3b3b3] px-3 py-1 border border-[rgba(255,255,255,0.08)] rounded" aria-label="CCPA compliant">CCPA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-[rgba(255,255,255,0.06)] mx-4 sm:mx-6 lg:mx-8" aria-hidden="true"></div>

      {/* Testimonials */}
      <section className="py-20 bg-[#0b0b0b] border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#e9e9e9] mb-4">
              What Our Members Say About FamilyVault
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 text-center min-h-[150px] relative hover:border-[rgba(244,197,66,0.35)] transition-colors duration-300">
                <div className="flex justify-center mb-2 text-[#f4c542] tracking-wide">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-[#b3b3b3] italic mb-4 text-sm">"{testimonial.quote}"</p>
                <div className="w-16 h-16 bg-gradient-to-br from-[#f4c542] to-[#d4aa2e] rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-[#f4c542]">
                  <span className="text-black text-xl font-bold">{testimonial.name.charAt(0)}</span>
                </div>
                <footer className="text-xs text-[#b3b3b3]">
                  <div className="font-semibold text-[#e9e9e9]">{testimonial.name}</div>
                  <div>{testimonial.title}</div>
                </footer>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-[rgba(255,255,255,0.06)] mx-4 sm:mx-6 lg:mx-8" aria-hidden="true"></div>

      {/* Pricing */}
      <section className="py-20 bg-[#0b0b0b] border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#e9e9e9] mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-[#b3b3b3]">
              No hidden fees. No surprises. Just complete peace of mind.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-2 text-[#e9e9e9]">Free</h3>
              <p className="text-[#b3b3b3] mb-4">For families starting to organize for neurodivergence</p>
              <div className="text-3xl font-bold mb-6 text-[#e9e9e9]">$0</div>
              <button
                data-testid="button-get-started-free-plan"
                className="w-full bg-[#f4c542] text-[#111] py-3 rounded-full font-semibold mb-6 hover:bg-[#d4aa2e] transition-colors"
              >
                Get started
              </button>
              <ul className="space-y-2 text-sm text-[#b3b3b3]">
                <li>• Advanced security</li>
                <li>• 12 items</li>
                <li>• 50GB</li>
                <li>• Autopilot™ by FamilyVault (beta)</li>
                <li>• Tailored onboarding</li>
                <li>• Unlimited collaborators</li>
              </ul>
            </div>

            {/* Silver Plan */}
            <div className="bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-2 text-[#e9e9e9]">Silver</h3>
              <p className="text-[#b3b3b3] mb-4">Build a comprehensive organization plan</p>
              <div className="text-3xl font-bold mb-6 text-[#e9e9e9]">$10</div>
              <button
                data-testid="button-get-started-silver-plan"
                className="w-full bg-[#f4c542] text-[#111] py-3 rounded-full font-semibold mb-6 hover:bg-[#d4aa2e] transition-colors"
              >
                Get started
              </button>
              <ul className="space-y-2 text-sm text-[#b3b3b3]">
                <li>• Everything in Free plus:</li>
                <li>• Unlimited items</li>
                <li>• Autopilot™ by FamilyVault</li>
                <li>• Liability support</li>
                <li>• Priority customer expert</li>
                <li>• The FamilyVault Marketplace</li>
              </ul>
            </div>

            {/* Gold Plan */}
            <div className="bg-[#111] border-2 border-[#f4c542] rounded-2xl p-6 relative shadow-[0_0_0_6px_rgba(244,197,66,0.12)]">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#f4c542] text-[#111] px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#e9e9e9]">Gold</h3>
              <p className="text-[#b3b3b3] mb-4">Organize your entire business and financial future</p>
              <div className="text-3xl font-bold mb-6 text-[#e9e9e9]">$20</div>
              <button
                data-testid="button-get-started-gold-plan"
                className="w-full bg-[#f4c542] text-[#111] py-3 rounded-full font-semibold mb-6 hover:bg-[#d4aa2e] transition-colors"
              >
                Get started
              </button>
              <ul className="space-y-2 text-sm text-[#b3b3b3]">
                <li>• Everything in Silver plus:</li>
                <li>• Business information</li>
                <li>• Organization (LLC, S Corp, S Corp, INC, etc.)</li>
                <li>• Entity relationship mapping</li>
                <li>• Friendly expert support</li>
                <li>• And more...</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-[#b3b3b3]">
            30-day money-back guarantee | We support first responders with a hero discount.
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-[rgba(255,255,255,0.06)] mx-4 sm:mx-6 lg:mx-8" aria-hidden="true"></div>

      {/* Essential Resources */}
      <section className="py-20 bg-[#0b0b0b] border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#e9e9e9] mb-4">
              Essential Resources for Neurodivergent Support
            </h2>
            <p className="text-lg text-[#b3b3b3]">
              FamilyVault offers structure you can count on — a calm, secure platform that does the heavy lifting for you.
            </p>
          </div>

          {/* Featured Article */}
          <div className="mb-12">
            <div className="bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 lg:p-12 flex items-center">
              <div className="flex-1">
                <div className="text-sm font-semibold text-[#f4c542] mb-2">FEATURED ARTICLE</div>
                <h3 className="text-2xl lg:text-3xl font-bold text-[#e9e9e9] mb-4">
                  Tame the Chaos: A Digital Vault for Autism and ADHD
                </h3>
                <p className="text-[#b3b3b3] mb-6">
                  You don't have to overhaul your brain to stay on top of everything. You just need tools that support the way you work.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 bg-[#f4c542] text-[#111] font-semibold px-6 py-3 rounded-full hover:bg-[#d4aa2e] transition-colors"
                >
                  Read article
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
              <div className="hidden lg:block lg:w-1/3 lg:ml-8">
                <div className="h-48 bg-[rgba(244,197,66,0.1)] border border-[rgba(255,255,255,0.08)] rounded-2xl flex items-center justify-center">
                  <Brain className="w-16 h-16 text-[#f4c542]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 bg-gradient-to-b from-[rgba(244,197,66,0.04)] to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#e9e9e9] mb-6">
            Ready to Organize Your Neurodivergent Life?
          </h2>
          <p className="text-[#b3b3b3] text-lg mb-8 max-w-2xl mx-auto">
            Begin organizing your life's important information with FamilyVault today.
          </p>
          <a
            href="/signup"
            data-testid="button-final-cta"
            className="inline-flex items-center gap-2 bg-[#f4c542] text-[#111] font-semibold px-8 py-4 rounded-full hover:bg-[#d4aa2e] transition-colors shadow-[0_6px_16px_rgba(244,197,66,0.35)] focus:outline-none focus:ring-[0_0_0_1px_rgba(244,197,66,0.3),0_0_0_4px_rgba(244,197,66,0.12)] min-h-[44px]"
          >
            Get started free
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}