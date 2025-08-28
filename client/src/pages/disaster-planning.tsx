import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { 
  AlertTriangle, 
  Shield, 
  Users, 
  Smartphone,
  Star,
  Zap,
  Eye,
  Key,
  Phone,
  FileText,
  Heart,
  ChevronRight,
  UserCheck,
  Upload,
  Play,
  CheckCircle,
  Download,
  Home,
  Car,
  Activity,
  PawPrint
} from "lucide-react";
import disasterSceneImage from "@assets/image_1756095132487.png";
import digitalSecurityImage from "@assets/image_1756095170275.png";
import mobileAppImage from "@assets/image_1756095280262.png";
import askExpertsImage from "@assets/image_1756095363487.png";

export default function DisasterPlanning() {
  const disasterPlanCards = [
    {
      icon: Phone,
      title: "Emergency Contacts",
      description: "Store family, medical, and emergency service contact information for quick access.",
      action: "Add contacts",
      href: "/disaster-emergency-contacts"
    },
    {
      icon: FileText,
      title: "Important Documents",
      description: "Keep insurance policies, IDs, and legal documents safe and accessible.",
      action: "Upload documents",
      href: "/disaster-important-documents"
    },
    {
      icon: Heart,
      title: "Medical Information",
      description: "Store medical records, prescriptions, and allergy information for family.",
      action: "Add medical info",
      href: "/disaster-medical-information"
    },
    {
      icon: Home,
      title: "Property Information",
      description: "Document your home, belongings, and assets for insurance claims.",
      action: "Add property details",
      href: "/disaster-property-information"
    },
    {
      icon: PawPrint,
      title: "Pet Records",
      description: "Keep vaccination records and identification for pet shelter access.",
      action: "Add pet info",
      href: "/disaster-pet-records"
    },
    {
      icon: Shield,
      title: "Emergency Plan",
      description: "Create and share evacuation routes and meeting points with family.",
      action: "Create plan",
      href: "/disaster-emergency-plan"
    }
  ];

  const features = [
    {
      icon: Phone,
      title: "Access Contact Information and IDs",
      description: "With only minutes to evacuate, you scramble to find your family's emergency contacts, but you can't remember where everything is.",
      detail: "Store your contacts and IDs with FamilyVault, making it easy to grab what you need from your phone at any time."
    },
    {
      icon: Heart,
      title: "Respond to Medical Emergencies",
      description: "A family member is injured during a disaster, and you're missing critical information about prescriptions or drug allergies.",
      detail: "With FamilyVault, you can access family medical information and healthcare directives instantly, and share your own in advance."
    },
    {
      icon: FileText,
      title: "File an Insurance Claim Quickly",
      description: "A storm damages your home, but your insurance claim is delayed because your policy details are lost in the wreckage.",
      detail: "With your home, auto, and health insurance policies stored in FamilyVault's Family Operating System®, you can file a claim immediately."
    },
    {
      icon: PawPrint,
      title: "Ensure Your Pet's Safety",
      description: "An evacuation shelter won't accept your pet without vaccination proof, but you didn't think to grab those records when you left home at a rush.",
      detail: "Uploading veterinary records to the Family Operating System® provides proof of your pet's vaccinations and your ownership."
    }
  ];

  const checklistItems = [
    "Emergency contact access",
    "Digital document backup", 
    "Medical information ready",
    "Insurance claim support"
  ];

  const bottomFeatures = [
    {
      icon: Shield,
      title: "Back Up Your Data Easily",
      description: "Automatic cloud backup keeps everything safe",
      image: digitalSecurityImage,
      imageAlt: "Digital security shield with circuit board background representing secure cloud backup"
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
      title: "Connect With an Expert",
      description: "Get personalized help organizing your family's documents",
      image: askExpertsImage,
      imageAlt: "Ask the Experts blackboard with light bulbs showing expert consultation concept"
    }
  ];

  const testimonials = [
    { name: "Jennifer M.", title: "Member since 2022", rating: 5, quote: "After Hurricane Laura hit, having all our documents in FamilyVault was a lifesaver for insurance claims." },
    { name: "Robert K.", title: "Member since 2021", rating: 5, quote: "When we had to evacuate for wildfires, I could access our family's medical info instantly from my phone." },
    { name: "Maria S.", title: "Member since 2023", rating: 5, quote: "FamilyVault helped us get organized before disaster struck. Now we feel prepared for anything." }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F3F4F6]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 text-[#FFD93D] font-medium bg-[rgba(255,217,61,0.08)] px-3 py-1 rounded-full border border-[rgba(255,217,61,0.25)]">
                ⚠️ Disaster Planning
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#FFFFFF] tracking-tight">
                FamilyVault for Disaster Planning
              </h1>
              <p className="text-[#CCCCCC] max-w-[65ch] text-lg">
                A natural disaster can turn life upside down in an instant — but being prepared can be the difference between order and chaos for you and your family.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="/pricing"
                  data-testid="button-get-started-free"
                  className="bg-[#FFD93D] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#FFD93D]/90 transition-colors min-h-[44px] flex items-center"
                >
                  Get started free
                </a>
                <a 
                  href="/pricing"
                  data-testid="link-see-disaster-features"
                  className="text-[#FFD93D] hover:underline font-medium min-h-[44px] flex items-center"
                >
                  See disaster planning features →
                </a>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-[rgba(255,217,61,0.35)] bg-[#141414] h-72 md:h-[22rem]">
              <img 
                src={disasterSceneImage} 
                alt="Firefighter at disaster scene with debris and destruction, representing emergency response"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Customer Story */}
      <section className="py-20 bg-[#0b0b0b]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FFFFFF] mb-4">
            After the California Wildfires, FamilyVault Became a Family's Lifeline
          </h2>
          <p className="text-[#CCCCCC] text-lg max-w-3xl mx-auto mb-12">
            FamilyVault helped Jeremy W.'s family navigate the trauma of losing their home to the Alameda fire — and gave them the tools to start their recovery.
          </p>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-xl overflow-hidden border border-[rgba(255,217,61,0.25)] bg-[#111111] h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-[rgba(255,217,61,0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-[#FFD93D] ml-1" />
                </div>
                <div className="text-[#FFFFFF] text-sm">
                  <div className="font-semibold">After the California Wildfires,</div>
                  <div className="font-semibold">FamilyVault Became</div>
                  <div className="font-semibold">a Lifeline</div>
                  <div className="text-xs text-[#CCCCCC] mt-2">
                    How FamilyVault helped Jeremy W.'s<br />
                    family through their loss
                  </div>
                </div>
              </div>
            </div>
            <div className="text-left">
              <p className="text-[#CCCCCC] italic mb-4 text-lg">
                "3 years after a wildfire ran its devastating effects immediately without scrambling to replace paperwork or remember what we lost. As tragic as this situation was, FamilyVault made the process so much easier. It gave us a head start when we needed it the most."
              </p>
              <div className="font-semibold text-[#FFFFFF]">Jeremy W.</div>
              <div className="text-sm text-[#CCCCCC]">FamilyVault member since 2022</div>
            </div>
          </div>
        </div>
      </section>

      {/* Disaster Planning Cards */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#FFFFFF] mb-4">
              How FamilyVault Helps — Before and After a Disaster
            </h2>
            <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto">
              From securing family IDs to accessing vital insurance documents, FamilyVault ensures your most important information is safe and available when you need it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disasterPlanCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div 
                  key={index}
                  className="bg-[#111111] border border-[rgba(255,217,61,0.2)] rounded-xl p-6 hover:border-[#FFD93D] transition-colors duration-300"
                >
                  <div className="w-12 h-12 bg-[rgba(255,217,61,0.1)] rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-[#FFD93D]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#FFFFFF] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-[#CCCCCC] mb-4">
                    {card.description}
                  </p>
                  <a 
                    href={card.href}
                    data-testid={`link-${card.action.replace(/\s+/g, '-').toLowerCase()}`}
                    className="text-[#FFD93D] hover:underline font-medium inline-flex items-center min-h-[44px] focus:outline-2 focus:outline-[#FFD93D] focus:outline-offset-2"
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
      <section className="py-12 bg-[#111111]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {checklistItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-[#FFD93D] flex-shrink-0" />
                <span className="text-[#CCCCCC] font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="rounded-xl overflow-hidden border border-[rgba(255,217,61,0.25)] bg-[#111111] h-80 flex items-center justify-center hover:border-[#FFD93D] transition-colors duration-300">
                      {index === 0 && (
                        <div className="bg-[#0B0B0B] rounded-lg p-4 max-w-xs mx-auto border border-[rgba(255,217,61,0.2)]">
                          <div className="bg-[#FFD93D] rounded-t-lg p-3 mb-3">
                            <div className="flex items-center justify-center">
                              <Smartphone className="w-8 h-8 text-black" />
                            </div>
                          </div>
                          <div className="text-xs text-[#FFFFFF]">
                            <div className="font-medium mb-2 text-[#FFD93D]">Emergency Contacts</div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span>Dad - Michael</span>
                                <span>(555) 123-4567</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Mom - Sarah</span>
                                <span>(555) 987-6543</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Dr. Johnson</span>
                                <span>(555) 246-8135</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Insurance</span>
                                <span>(555) 369-2580</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="bg-[#0B0B0B] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(255,217,61,0.2)]">
                          <div className="flex items-center mb-3">
                            <div className="w-6 h-6 bg-[rgba(255,217,61,0.2)] rounded mr-2 flex items-center justify-center">
                              <Heart className="w-4 h-4 text-[#FFD93D]" />
                            </div>
                            <span className="font-semibold text-sm text-[#FFFFFF]">Medical Directive</span>
                          </div>
                          <div className="bg-[rgba(255,217,61,0.1)] rounded p-3 mb-3 border border-[rgba(255,217,61,0.2)]">
                            <div className="text-xs font-medium text-[#FFFFFF]">Sarah Reynolds</div>
                            <div className="text-xs text-[#CCCCCC] mt-1">
                              <div>Date required: Feb 12, 2025</div>
                              <div>Location of original: Office desk</div>
                              <div className="mt-2 text-[#FFD93D] font-medium">ALLERGIES: Penicillin</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 2 && (
                        <div className="bg-[#0B0B0B] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(255,217,61,0.2)]">
                          <div className="text-xs font-medium mb-3 text-[#FFFFFF]">Allstate Homeowners Insurance</div>
                          <div className="space-y-2">
                            <div className="bg-[rgba(255,217,61,0.1)] rounded p-2 border border-[rgba(255,217,61,0.2)]">
                              <div className="text-xs text-[#CCCCCC]">Policy Number</div>
                              <div className="font-mono text-xs text-[#FFFFFF]">HO-123456789</div>
                            </div>
                            <div className="bg-[rgba(255,217,61,0.1)] rounded p-2 border border-[rgba(255,217,61,0.2)]">
                              <div className="text-xs text-[#CCCCCC]">Coverage Amount</div>
                              <div className="font-semibold text-xs text-[#FFD93D]">$750,000</div>
                            </div>
                            <div className="bg-[rgba(255,217,61,0.1)] rounded p-2 border border-[rgba(255,217,61,0.2)]">
                              <div className="text-xs text-[#CCCCCC]">Agent Contact</div>
                              <div className="text-xs text-[#FFFFFF]">(555) 456-7890</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 3 && (
                        <div className="bg-[#0B0B0B] rounded-lg p-4 max-w-sm mx-auto border border-[rgba(255,217,61,0.2)]">
                          <div className="flex items-center mb-3">
                            <div className="w-6 h-6 bg-[rgba(255,217,61,0.2)] rounded mr-2 flex items-center justify-center">
                              <PawPrint className="w-4 h-4 text-[#FFD93D]" />
                            </div>
                            <span className="font-semibold text-sm text-[#FFFFFF]">Pet Records - Max</span>
                          </div>
                          <div className="bg-[rgba(255,217,61,0.1)] rounded p-3 border border-[rgba(255,217,61,0.2)]">
                            <div className="text-xs text-[#FFFFFF]">
                              <div className="font-medium text-[#FFD93D]">Vaccinations Current</div>
                              <div className="text-[#CCCCCC] mt-1">
                                <div>Rabies: 03/15/2024</div>
                                <div>DHPP: 03/15/2024</div>
                                <div>Vet: Dr. Smith Animal Clinic</div>
                                <div>Microchip: 982000123456789</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="w-12 h-12 bg-[rgba(255,217,61,0.1)] rounded-lg flex items-center justify-center mb-6">
                      <IconComponent className="w-6 h-6 text-[#FFD93D]" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#FFFFFF] mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-[#CCCCCC] mb-4 italic text-lg leading-relaxed">
                      {feature.description}
                    </p>
                    <p className="text-[#FFFFFF] font-medium text-lg leading-relaxed">
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
      <section className="py-20 bg-[#0b0b0b]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FFFFFF] mb-6">
            Meet FamilyVault — Your Life, Organized
          </h2>
          <p className="text-[#CCCCCC] text-lg mb-8 max-w-3xl mx-auto">
            From travel and finances to emergency planning, FamilyVault keeps your key information secure, organized, and within reach so you can focus on what matters.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-cta"
            className="bg-[#FFD93D] hover:bg-[#FFD93D]/90 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block min-h-[44px]"
          >
            Get started free
          </a>
        </div>
      </section>

      {/* Bottom Features */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {bottomFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="rounded-xl overflow-hidden border border-[rgba(255,217,61,0.25)] bg-[#111111] h-48 flex items-center justify-center mb-6 hover:border-[#FFD93D] transition-colors duration-300">
                    {feature.image ? (
                      <img 
                        src={feature.image} 
                        alt={feature.imageAlt}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <IconComponent className="w-12 h-12 text-[#FFD93D]" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-[#FFFFFF] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#CCCCCC]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-[#0b0b0b]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#FFFFFF] mb-6">
              Your Data Is Always Protected
            </h2>
            <p className="text-[#CCCCCC] text-lg max-w-3xl mx-auto">
              Your sensitive information stays private and secure with advanced security and compliance practices.
            </p>
            <div className="mt-8">
              <a
                href="/security"
                className="text-[#FFD93D] hover:underline font-medium inline-flex items-center min-h-[44px]"
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
              { icon: AlertTriangle, title: "Data encryption", description: "Your data is securely encrypted both stored and in transit" },
              { icon: Zap, title: "Stolen password alerts", description: "Get notified instantly if your password is compromised" },
              { icon: UserCheck, title: "Biometric authentication", description: "Safe, instant access with fingerprint or face ID" }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start">
                  <div className="w-10 h-10 bg-[rgba(255,217,61,0.1)] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-[#FFD93D]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#FFFFFF] mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#CCCCCC]">
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
                <div key={index} className="text-xs font-semibold text-[#CCCCCC] px-3 py-1 border border-[rgba(255,255,255,.1)] rounded">
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#FFFFFF] mb-4">
              What Our Members Say About FamilyVault
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#111111] border border-[rgba(255,217,61,0.2)] rounded-lg p-6 text-center hover:border-[rgba(255,217,61,0.4)] transition-colors duration-300">
                <div className="flex justify-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FFD93D] fill-current" />
                  ))}
                </div>
                <p className="text-[#CCCCCC] italic mb-4">"{testimonial.quote}"</p>
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFD93D] to-[#FFD700] rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-[#FFD93D]">
                  <span className="text-black text-xl font-bold">{testimonial.name.charAt(0)}</span>
                </div>
                <div className="font-semibold text-sm text-[#FFFFFF]">{testimonial.name}</div>
                <div className="text-xs text-[#CCCCCC]">{testimonial.title}</div>
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
              <p className="text-[#D1D5DB] mb-4 h-12">For families starting to organize for disaster planning</p>
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
      <section className="py-20 bg-gradient-to-b from-[#FFD93D] to-[#0b0b0b]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FFFFFF] mb-6">
            Be Ready for Anything Life Throws Your Way
          </h2>
          <p className="text-[#CCCCCC] text-lg mb-8 max-w-2xl mx-auto">
            Don't wait for disaster to strike. Start organizing your family's critical information today with FamilyVault.
          </p>
          <a
            href="/pricing"
            data-testid="button-final-cta"
            className="bg-[#FFD93D] hover:bg-[#FFD93D]/90 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block min-h-[44px]"
          >
            Get started free
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}