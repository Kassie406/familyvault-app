import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import familyImage from "@assets/image_1756096399044.png";
import digitalSecurityImage from "@assets/image_1756096462942.png";
import mobileAppImage from "@assets/image_1756096537141.png";
import askExpertsImage from "@assets/image_1756096610126.png";
import { 
  Baby,
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
  CheckCircle,
  Calendar,
  Activity,
  Stethoscope,
  Home
} from "lucide-react";

export default function StartingAFamily() {
  const familyPlanningCards = [
    {
      icon: Heart,
      title: "Pregnancy & Medical Records",
      description: "Store insurance cards, medical records, and prenatal visit information.",
      action: "Add medical info"
    },
    {
      icon: Baby,
      title: "Baby Documentation",
      description: "Keep birth certificates, immunization records, and pediatric information safe.",
      action: "Add baby records"
    },
    {
      icon: Users,
      title: "Childcare Information",
      description: "Organize babysitter instructions, emergency contacts, and care details.",
      action: "Add childcare info"
    },
    {
      icon: Shield,
      title: "Guardianship Planning",
      description: "Document guardian arrangements and share important instructions.",
      action: "Add guardian info"
    },
    {
      icon: FileText,
      title: "Legal Documents",
      description: "Store wills, custody papers, and family legal documentation.",
      action: "Add legal docs"
    },
    {
      icon: CreditCard,
      title: "Insurance & Benefits",
      description: "Keep health insurance, life insurance, and benefits information organized.",
      action: "Add insurance info"
    }
  ];

  const features = [
    {
      icon: CreditCard,
      title: "Carry Insurance Details With You",
      description: "You're at a prenatal visit without your insurance information — now you're stuck paying the full bill upfront.",
      detail: "Store your insurance cards and medical records with FamilyVault for doctor visits, ultrasounds, and maternity care."
    },
    {
      icon: Users,
      title: "Ensure the Sitter Knows What to Do",
      description: "Your baby is sick and your sitter can't reach you — and you didn't provide backup information about your backup contacts.",
      detail: "Share emergency plans and additional contacts through a FamilyVault SecureLink®, so your sitter has what they need."
    },
    {
      icon: Phone,
      title: "Find Your Baby's Records Fast",
      description: "Your baby's new daycare center asks for immunization records, and you have no idea where they are.",
      detail: "Keep your baby's important records safe and accessible — from birth certificates to immunizations."
    },
    {
      icon: Shield,
      title: "Prepare Guardians in Advance",
      description: "Your brother agreed to be your child's guardian — but he's unsure what it involves and has nothing to reference.",
      detail: "With FamilyVault's collaboration feature, you can securely share guardianship details and instructions ahead of time."
    }
  ];

  const checklistItems = [
    "Insurance details access",
    "Babysitter emergency plans",
    "Baby record organization",
    "Guardian preparation"
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
      imageAlt: "Mobile app interface showing browse screen with family document categories"
    },
    {
      icon: Phone,
      title: "Share With the Right People, the Right Way",
      description: "Control who sees what with granular sharing permissions",
      image: askExpertsImage,
      imageAlt: "Ask the Experts blackboard with lightbulbs representing expert consultation and guidance"
    }
  ];

  const testimonials = [
    { name: "Maria S.", title: "Member since 2022", rating: 5, quote: "FamilyVault helped us stay organized throughout pregnancy and after our baby arrived. Everything we needed was right there!" },
    { name: "James R.", title: "Member since 2021", rating: 5, quote: "Having all our baby's medical records and insurance info accessible made doctor visits so much smoother." },
    { name: "Lisa K.", title: "Member since 2023", rating: 5, quote: "The babysitter instructions feature gave us peace of mind when leaving our newborn for the first time." }
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#eaeaea]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20 min-h-[420px] flex items-center">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div className="space-y-6 max-w-[620px]">
              <span className="inline-flex items-center gap-2 text-[#d7b43e] font-semibold bg-[rgba(215,180,62,0.04)] px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.06)] text-sm tracking-wide">
                👶 Starting a Family
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-[#eaeaea] tracking-tight leading-tight">
                FamilyVault for Starting a Family
              </h1>
              <p className="text-[#b9b9b9] text-lg leading-relaxed">
                This chapter of your life changes everything — and the Family Operating System® keeps you organized, calm, and ready for what's next.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="/signup"
                  data-testid="button-get-started-free"
                  className="inline-flex items-center gap-2 bg-[#d7b43e] text-[#111] font-semibold px-6 py-3 rounded-full hover:bg-[#c6a528] transition-colors min-h-[44px] shadow-[0_6px_16px_rgba(215,180,62,0.35)] focus:outline-none focus:ring-[0_0_0_1px_rgba(215,180,62,0.3),0_0_0_4px_rgba(215,180,62,0.12)]"
                >
                  Get started free
                </a>
                <a 
                  href="#features"
                  data-testid="link-see-family-features"
                  className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.16)] text-[#eaeaea] bg-transparent px-6 py-3 rounded-full hover:border-[#d7b43e] hover:text-[#d7b43e] transition-colors min-h-[44px] focus:outline-none focus:ring-[0_0_0_1px_rgba(215,180,62,0.3),0_0_0_4px_rgba(215,180,62,0.12)]"
                >
                  See family planning features →
                </a>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-[#0b0b0b] shadow-[0_8px_24px_rgba(0,0,0,0.35)] order-first lg:order-last" style={{aspectRatio: '4/3'}}>
              <img 
                src={familyImage} 
                alt="Happy family with newborn baby"
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

      {/* Family Planning Cards */}
      <section id="features" className="py-20 bg-[#0f0f0f] border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#eaeaea] mb-4">
              How FamilyVault Helps, From Planning to Parenthood
            </h2>
            <p className="text-[#b9b9b9] text-lg max-w-2xl mx-auto">
              Keep your information safe, private, and manageable — before your baby arrives and long after.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {familyPlanningCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div 
                  key={index}
                  className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 min-h-[160px] transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:border-[rgba(215,180,62,0.35)] hover:shadow-[0_10px_24px_rgba(215,180,62,0.10)] focus-within:ring-2 focus-within:ring-[rgba(215,180,62,0.3)] focus-within:ring-offset-2 flex flex-col"
                >
                  <div className="w-8 h-8 rounded-full grid place-items-center bg-[rgba(215,180,62,0.12)] text-[#d7b43e] mb-3">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-semibold text-[#eaeaea] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-[#b9b9b9] text-sm mb-4 flex-1 opacity-80">
                    {card.description}
                  </p>
                  <a 
                    href="#"
                    data-testid={`link-${card.action.replace(/\s+/g, '-').toLowerCase()}`}
                    className="text-[#d7b43e] hover:text-[#eaeaea] font-medium inline-flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(215,180,62,0.3)] focus:ring-offset-2"
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
                    <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.35)]" style={{aspectRatio: '4/3', height: 'auto', minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
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
                                <Heart className="w-4 h-4 text-[#d7b43e]" />
                              </div>
                              <span className="font-semibold text-[#eaeaea]">McKinley Family Medical</span>
                            </div>
                            <div className="space-y-2">
                              <div className="bg-[rgba(215,180,62,0.1)] rounded p-2 border border-[rgba(255,255,255,0.08)]">
                                <div className="text-xs text-[#b9b9b9]">Personal Information</div>
                              </div>
                              <div className="bg-[rgba(215,180,62,0.1)] rounded p-2 border border-[rgba(255,255,255,0.08)]">
                                <div className="text-xs text-[#b9b9b9]">Files</div>
                              </div>
                              <div className="bg-[rgba(215,180,62,0.1)] rounded p-2 border border-[rgba(255,255,255,0.08)]">
                                <div className="text-xs text-[#b9b9b9]">Emergency</div>
                              </div>
                            </div>
                            <div className="mt-3 text-xs text-[#d7b43e]">
                              <div className="underline">More info about emergency contacts</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="bg-[#0f0f0f] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(255,255,255,0.08)]">
                          <div className="text-xs font-medium mb-3 text-[#eaeaea]">Babysitter Instructions</div>
                          <div className="bg-[rgba(215,180,62,0.1)] rounded p-3 mb-3 text-left border border-[rgba(255,255,255,0.08)]">
                            <div className="text-xs font-medium mb-2 text-[#eaeaea]">Instructions for if we can't be reached:</div>
                            <ul className="text-xs space-y-1 text-[#b9b9b9]">
                              <li>• Contact Grandma (phone number)</li>
                              <li>• Contact Dr. Peterson (phone number)</li>
                              <li>• Allergies and food to avoid</li>
                              <li>• Bedtime routine</li>
                              <li>• Emergency room hospitals</li>
                              <li>• Insurance card in wallet</li>
                            </ul>
                          </div>
                          <div className="text-xs">
                            <div className="font-medium text-[#d7b43e]">Emergency Information</div>
                            <div className="text-[#b9b9b9] mt-1">All the details your sitter needs...</div>
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
                                <Baby className="w-6 h-6 text-[#d7b43e]" />
                              </div>
                              <div className="font-medium text-[#eaeaea]">Baby's Records</div>
                            </div>
                            <div className="space-y-1">
                              <div className="bg-[rgba(215,180,62,0.1)] rounded p-2 text-left border border-[rgba(255,255,255,0.08)]">
                                <div className="font-medium text-[#eaeaea]">Birth Certificate</div>
                                <div className="text-[#b9b9b9]">PDF • 2.4 MB</div>
                              </div>
                              <div className="bg-[rgba(215,180,62,0.1)] rounded p-2 text-left border border-[rgba(255,255,255,0.08)]">
                                <div className="font-medium text-[#eaeaea]">Immunization Record</div>
                                <div className="text-[#b9b9b9]">PDF • 1.8 MB</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 3 && (
                        <div className="bg-[#0f0f0f] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(255,255,255,0.08)]">
                          <div className="text-xs mb-3 text-[#eaeaea]">
                            <div className="font-semibold mb-2 text-[#d7b43e]">Full access</div>
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-[rgba(215,180,62,0.2)] rounded-full mr-2 border border-[rgba(215,180,62,0.3)]"></div>
                              <span>David Reynolds</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#d7b43e]" />
                            </div>
                            
                            <div className="font-semibold mb-2 mt-3 text-[#d7b43e]">Partial access</div>
                            <div className="flex items-center mb-1">
                              <div className="w-6 h-6 bg-[rgba(215,180,62,0.1)] rounded-full mr-2 border border-[rgba(255,255,255,0.08)]"></div>
                              <span>Jen Carter</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#d7b43e]" />
                            </div>
                            <div className="text-[#b9b9b9] text-xs ml-8">Trusted family member</div>
                            
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-[rgba(215,180,62,0.1)] rounded-full mr-2 border border-[rgba(255,255,255,0.08)]"></div>
                              <span>Mike Carter</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#d7b43e]" />
                            </div>
                            <div className="text-[#b9b9b9] text-xs ml-8">Trusted family member</div>
                            
                            <div className="font-semibold mb-2 mt-3 text-[#d7b43e]">Legacy access</div>
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-[rgba(215,180,62,0.3)] rounded-full mr-2 border border-[rgba(215,180,62,0.4)]"></div>
                              <span>Anna Reynolds</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#d7b43e]" />
                            </div>
                            <div className="text-[#b9b9b9] text-xs ml-8">Guardian/sister</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="w-7 h-7 rounded-lg grid place-items-center bg-[rgba(215,180,62,0.12)] text-[#d7b43e] mb-6">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#eaeaea] mb-4 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-[#b9b9b9] mb-4 italic text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    <p className="text-[#eaeaea] font-medium text-sm leading-relaxed">
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

      {/* Section divider */}
      <div className="h-px bg-[rgba(255,255,255,0.06)] mx-4 sm:mx-6 lg:mx-8" aria-hidden="true"></div>

      {/* Meet FamilyVault */}
      <section className="py-20 bg-[#0f0f0f] border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#eaeaea] mb-6">
            Meet FamilyVault — Your Life, Organized
          </h2>
          <p className="text-[#b9b9b9] text-lg mb-8 max-w-3xl mx-auto">
            From travel and finances to emergency planning, FamilyVault keeps your key information secure, organized, and within reach so you can focus on what matters.
          </p>
          <a
            href="/signup"
            data-testid="button-get-started-cta"
            className="inline-flex items-center gap-2 bg-[#d7b43e] text-[#111] font-semibold px-8 py-4 rounded-full hover:bg-[#c6a528] transition-colors shadow-[0_6px_16px_rgba(215,180,62,0.35)] focus:outline-none focus:ring-[0_0_0_1px_rgba(215,180,62,0.3),0_0_0_4px_rgba(215,180,62,0.12)] min-h-[44px]"
          >
            Get started free
          </a>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-[rgba(255,255,255,0.06)] mx-4 sm:mx-6 lg:mx-8" aria-hidden="true"></div>

      {/* Bottom Features */}
      <section className="py-20 bg-[#0f0f0f] border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-5">
            {bottomFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#141414] h-48 flex items-center justify-center mb-6 hover:border-[rgba(215,180,62,0.35)] transition-colors duration-300">
                    {feature.image ? (
                      <img 
                        src={feature.image} 
                        alt={feature.imageAlt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width="560"
                        height="350"
                      />
                    ) : (
                      <IconComponent className="w-12 h-12 text-[#d7b43e]" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-[#eaeaea] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#b9b9b9]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-[rgba(255,255,255,0.06)] mx-4 sm:mx-6 lg:mx-8" aria-hidden="true"></div>

      {/* Security Section */}
      <section className="py-20 bg-[#0f0f0f] border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#eaeaea] mb-6">
              Your Data Is Always Protected
            </h2>
            <p className="text-[#b9b9b9] text-lg max-w-3xl mx-auto">
              Your sensitive information stays private and secure with advanced security and compliance practices.
            </p>
            <div className="mt-8">
              <a
                href="/security"
                className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.16)] text-[#eaeaea] bg-transparent px-4 py-2 rounded-full hover:border-[#d7b43e] hover:text-[#d7b43e] transition-colors min-h-[44px] focus:outline-none focus:ring-[0_0_0_1px_rgba(215,180,62,0.3),0_0_0_4px_rgba(215,180,62,0.12)]"
                aria-label="Learn more about our security measures"
              >
                About our security
                <ChevronRight className="w-4 h-4" />
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

      {/* Section divider */}
      <div className="h-px bg-[rgba(255,255,255,0.06)] mx-4 sm:mx-6 lg:mx-8" aria-hidden="true"></div>

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
                <div className="w-16 h-16 bg-gradient-to-br from-[#d7b43e] to-[#c6a528] rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-[#d7b43e]">
                  <span className="text-black text-xl font-bold">{testimonial.name.charAt(0)}</span>
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
              <p className="text-[#D1D5DB] mb-4 h-12">For families starting to organize when starting a family</p>
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

      {/* Final CTA */}
      <section className="py-12 bg-gradient-to-b from-[rgba(215,180,62,0.04)] to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#eaeaea] mb-6">
            Ready to Start Your Family Journey Organized?
          </h2>
          <p className="text-[#b9b9b9] text-lg mb-8 max-w-2xl mx-auto">
            Begin organizing your family's important information with FamilyVault today.
          </p>
          <a
            href="/signup"
            data-testid="button-final-cta"
            className="inline-flex items-center gap-2 bg-[#d7b43e] text-[#111] font-semibold px-8 py-4 rounded-full hover:bg-[#c6a528] transition-colors shadow-[0_6px_16px_rgba(215,180,62,0.35)] focus:outline-none focus:ring-[0_0_0_1px_rgba(215,180,62,0.3),0_0_0_4px_rgba(215,180,62,0.12)] min-h-[44px]"
          >
            Get started free
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}