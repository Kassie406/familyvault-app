import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import familyImage from "@assets/image_1756096399044.png";
import digitalSecurityImage from "@assets/image_1756096462942.png";
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
      description: "Access your information anywhere with our mobile app"
    },
    {
      icon: Phone,
      title: "Share With the Right People, the Right Way",
      description: "Control who sees what with granular sharing permissions"
    }
  ];

  const testimonials = [
    { name: "Maria S.", title: "Member since 2022", rating: 5, quote: "FamilyVault helped us stay organized throughout pregnancy and after our baby arrived. Everything we needed was right there!" },
    { name: "James R.", title: "Member since 2021", rating: 5, quote: "Having all our baby's medical records and insurance info accessible made doctor visits so much smoother." },
    { name: "Lisa K.", title: "Member since 2023", rating: 5, quote: "The babysitter instructions feature gave us peace of mind when leaving our newborn for the first time." }
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
                👶 Starting a Family
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#F3F4F6] tracking-tight">
                FamilyVault for Starting a Family
              </h1>
              <p className="text-[#D1D5DB] max-w-[65ch] text-lg">
                This chapter of your life changes everything — and the Family Operating System® keeps you organized, calm, and ready for what's next.
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
                  data-testid="link-see-family-features"
                  className="text-[#D1D5DB] hover:text-[#F3F4F6] underline underline-offset-4 min-h-[44px] flex items-center"
                >
                  See family planning features →
                </a>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-[rgba(212,175,55,0.35)] bg-[#141414] h-72 md:h-[22rem]">
              <img 
                src={familyImage} 
                alt="Happy family with mother, father, and newborn baby in white clothing"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Family Planning Cards */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F3F4F6] mb-4">
              How FamilyVault Helps, From Planning to Parenthood
            </h2>
            <p className="text-[#D1D5DB] text-lg max-w-2xl mx-auto">
              Keep your information safe, private, and manageable — before your baby arrives and long after.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {familyPlanningCards.map((card, index) => {
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
                                <Heart className="w-4 h-4 text-[#D4AF37]" />
                              </div>
                              <span className="font-semibold text-[#F3F4F6]">McKinley Family Medical</span>
                            </div>
                            <div className="space-y-2">
                              <div className="bg-[rgba(212,175,55,0.1)] rounded p-2 border border-[rgba(212,175,55,0.2)]">
                                <div className="text-xs text-[#D1D5DB]">Personal Information</div>
                              </div>
                              <div className="bg-[rgba(212,175,55,0.1)] rounded p-2 border border-[rgba(212,175,55,0.2)]">
                                <div className="text-xs text-[#D1D5DB]">Files</div>
                              </div>
                              <div className="bg-[rgba(212,175,55,0.1)] rounded p-2 border border-[rgba(212,175,55,0.2)]">
                                <div className="text-xs text-[#D1D5DB]">Emergency</div>
                              </div>
                            </div>
                            <div className="mt-3 text-xs text-[#D4AF37]">
                              <div className="underline">More info about emergency contacts</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="bg-[#141414] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(212,175,55,0.2)]">
                          <div className="text-xs font-medium mb-3 text-[#F3F4F6]">Babysitter Instructions</div>
                          <div className="bg-[rgba(212,175,55,0.1)] rounded p-3 mb-3 text-left border border-[rgba(212,175,55,0.2)]">
                            <div className="text-xs font-medium mb-2 text-[#F3F4F6]">Instructions for if we can't be reached:</div>
                            <ul className="text-xs space-y-1 text-[#D1D5DB]">
                              <li>• Contact Grandma (phone number)</li>
                              <li>• Contact Dr. Peterson (phone number)</li>
                              <li>• Allergies and food to avoid</li>
                              <li>• Bedtime routine</li>
                              <li>• Emergency room hospitals</li>
                              <li>• Insurance card in wallet</li>
                            </ul>
                          </div>
                          <div className="text-xs">
                            <div className="font-medium text-[#D4AF37]">Emergency Information</div>
                            <div className="text-[#D1D5DB] mt-1">All the details your sitter needs...</div>
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
                                <Baby className="w-6 h-6 text-[#D4AF37]" />
                              </div>
                              <div className="font-medium text-[#F3F4F6]">Baby's Records</div>
                            </div>
                            <div className="space-y-1">
                              <div className="bg-[rgba(212,175,55,0.1)] rounded p-2 text-left border border-[rgba(212,175,55,0.2)]">
                                <div className="font-medium text-[#F3F4F6]">Birth Certificate</div>
                                <div className="text-[#D1D5DB]">PDF • 2.4 MB</div>
                              </div>
                              <div className="bg-[rgba(212,175,55,0.1)] rounded p-2 text-left border border-[rgba(212,175,55,0.2)]">
                                <div className="font-medium text-[#F3F4F6]">Immunization Record</div>
                                <div className="text-[#D1D5DB]">PDF • 1.8 MB</div>
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
                              <span>Jen Carter</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />
                            </div>
                            <div className="text-[#D1D5DB] text-xs ml-8">Trusted family member</div>
                            
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-[rgba(212,175,55,0.1)] rounded-full mr-2 border border-[rgba(212,175,55,0.2)]"></div>
                              <span>Mike Carter</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />
                            </div>
                            <div className="text-[#D1D5DB] text-xs ml-8">Trusted family member</div>
                            
                            <div className="font-semibold mb-2 mt-3 text-[#D4AF37]">Legacy access</div>
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-[rgba(212,175,55,0.3)] rounded-full mr-2 border border-[rgba(212,175,55,0.4)]"></div>
                              <span>Anna Reynolds</span>
                              <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]" />
                            </div>
                            <div className="text-[#D1D5DB] text-xs ml-8">Guardian/sister</div>
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
            Start your family journey organized and prepared.
          </h2>
          <p className="text-[#D1D5DB] mb-8 text-lg">
            Begin organizing your family's important information with FamilyVault today.
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