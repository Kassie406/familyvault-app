import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import travelerAirportImage from "@assets/image_1756094101211.png";
import digitalSecurityImage from "@assets/image_1756094141073.png";
import mobileAppImage from "@assets/image_1756094227046.png";
import askExpertsImage from "@assets/image_1756094303286.png";
import martinProfileImage from "@assets/generated_images/Martin_travel_reviewer_headshot_d2f990ce.png";
import emilyProfileImage from "@assets/generated_images/Emily_travel_reviewer_headshot_3954bfa8.png";
import oscarProfileImage from "@assets/generated_images/Oscar_travel_reviewer_headshot_30a66945.png";
import { 
  Plane, 
  FileText, 
  Heart, 
  Users, 
  Bell,
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

export default function InternationalTravel() {
  const features = [
    {
      icon: FileText,
      title: "Replace Lost Passports & Other IDs",
      description: "You're on a trip when you reach for your passport — only to realize it's missing, and you have no idea what to do now.",
      detail: "Store digital copies of passports, visas, and other IDs securely in FamilyVault for easy replacement."
    },
    {
      icon: Heart,
      title: "Respond to Medical Emergencies",
      description: "You're seriously injured while traveling, and your companion has no details about your medical history or health insurance.",
      detail: "Instantly access medical records, directives, and insurance abroad. Share access in advance as needed."
    },
    {
      icon: Users,
      title: "Manage and Share Travel Info",
      description: "You arrive at your hotel after a long flight, only to realize you can't find your reservation details or confirmation number.",
      detail: "Store and share your travel documents anytime with FamilyVault's mobile app."
    },
    {
      icon: Bell,
      title: "Keep Your Life Organized Back Home",
      description: "You're traveling when an important bill is due — but you've forgotten about it and will face a big penalty.",
      detail: "Access important documents on the go, including financial, property, and business records. Get deadline reminders while traveling."
    }
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
    { name: "Martin F.", title: "Member since 2023", rating: 5, quote: "FamilyVault made international travel so much easier — had everything I needed in one place.", image: martinProfileImage },
    { name: "Emily G.", title: "Member since 2021", rating: 5, quote: "Lost my passport abroad, but having a digital copy in FamilyVault saved me hours of stress.", image: emilyProfileImage },
    { name: "Oscar S.", title: "Member since 2023", rating: 5, quote: "Finally, a secure way to keep my travel documents organized and accessible.", image: oscarProfileImage }
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
                ✈️ International Travel
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#F5F5F5] tracking-tight">
                FamilyVault for International Travel
              </h1>
              <p className="text-[#D1D5DB] max-w-[65ch] text-lg">
                International travel is an adventure, but keeping track of your travel documents shouldn't be. FamilyVault ensures your passport and other docs are secure and accessible.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="/pricing"
                  data-testid="button-get-started-free"
                  className="bg-[#D4AF37] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#C7A233] transition-colors min-h-[44px] flex items-center"
                >
                  Get started free
                </a>
                <a 
                  href="/pricing"
                  data-testid="link-see-travel-features"
                  className="text-[#D1D5DB] hover:text-[#F3F4F6] underline underline-offset-4 min-h-[44px] flex items-center"
                >
                  See travel features →
                </a>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-[rgba(212,175,55,0.35)] bg-[#141414] h-72 md:h-[22rem] flex items-center justify-center">
              <img 
                src={travelerAirportImage} 
                alt="Traveler overlooking scenic mountain landscape at airport"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Travel Problems, Solved */}
      <section className="py-16 bg-[#141414]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#F3F4F6] mb-4">
            Travel Problems, Solved
          </h2>
          <p className="text-lg text-[#FFD700] font-medium max-w-3xl mx-auto">
            Even the best travel plans can go sideways. Lost passport? Emergency? FamilyVault's got your back — keeping you prepared for whatever twist (or chaos) comes your way.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="bg-gradient-to-br from-[rgba(212,175,55,0.05)] to-[rgba(212,175,55,0.02)] border border-[rgba(212,175,55,0.25)] rounded-xl p-8 min-h-[220px] flex items-center justify-center transition-all duration-300 hover:border-[#FFD700] hover:shadow-[0_0_12px_rgba(255,215,0,0.33)]">
                      <div className="text-center">
                        {index === 0 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-xs mx-auto">
                              <div className="bg-blue-600 text-white text-center py-2 rounded-t text-sm font-semibold mb-3">
                                📱 Travel Documents
                              </div>
                              <div className="space-y-2 text-xs">
                                <div className="flex items-center">
                                  <span className="w-6 h-6 bg-blue-100 rounded mr-2 flex items-center justify-center">📄</span>
                                  <span>US Passport</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="w-6 h-6 bg-blue-100 rounded mr-2 flex items-center justify-center">🛂</span>
                                  <span>Entry Visa</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="w-6 h-6 bg-blue-100 rounded mr-2 flex items-center justify-center">🆔</span>
                                  <span>Driver's License</span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 1 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="flex items-center mb-3">
                                <div className="w-6 h-6 bg-blue-100 rounded mr-2 flex items-center justify-center">
                                  <span className="text-xs">🆔</span>
                                </div>
                                <span className="font-semibold text-sm">Family IDs</span>
                              </div>
                              <div className="bg-blue-50 rounded p-3 mb-3">
                                <div className="text-xs font-medium">Medical Directive</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  <div>Sarah Reynolds</div>
                                  <div>Date required: Feb 12, 2024</div>
                                  <div>Location of original: Office desk</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 2 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="text-center mb-4">
                                <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                                  <span className="text-2xl">👤</span>
                                </div>
                                <div className="font-semibold">David Reynolds</div>
                                <div className="text-sm text-gray-600">Husband</div>
                                <div className="text-sm text-blue-600">Full Access Collaborator</div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 3 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="flex items-center mb-3">
                                <Bell className="w-5 h-5 text-blue-600 mr-2" />
                                <span className="font-semibold text-sm">📋 Travel reminders</span>
                              </div>
                              <div className="bg-blue-50 rounded p-3">
                                <div className="flex items-start">
                                  <div className="w-4 h-4 bg-blue-600 rounded-full mr-2 mt-1"></div>
                                  <div className="text-xs">
                                    <div className="font-medium">Travel Guard Insurance expires</div>
                                    <div className="text-gray-600">June 1, 2025 • in 57 days</div>
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
      <section className="py-20 bg-[#141414]">
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
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {bottomFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="rounded-xl overflow-hidden border border-[rgba(212,175,55,0.25)] bg-[#141414] h-[200px] flex items-center justify-center mb-6">
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
      <section className="py-20 bg-[#141414]">
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
            {securityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start">
                  <div className="w-8 h-8 bg-[rgba(212,175,55,0.1)] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <IconComponent className="w-4 h-4 text-[#D4AF37]" />
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
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-xs font-semibold text-[#D1D5DB] px-3 py-1 border border-[rgba(212,175,55,0.25)] rounded">EU GDPR</div>
              <div className="text-xs font-semibold text-[#D1D5DB] px-3 py-1 border border-[rgba(212,175,55,0.25)] rounded">SOC 2 TYPE II</div>
              <div className="text-xs font-semibold text-[#D1D5DB] px-3 py-1 border border-[rgba(212,175,55,0.25)] rounded">SOC 3</div>
              <div className="text-xs font-semibold text-[#D1D5DB] px-3 py-1 border border-[rgba(212,175,55,0.25)] rounded">HIPAA</div>
              <div className="text-xs font-semibold text-[#D1D5DB] px-3 py-1 border border-[rgba(212,175,55,0.25)] rounded">CCPA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F3F4F6] mb-4">
              What Travelers Say About FamilyVault
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#141414] rounded-lg p-6 text-center border border-[rgba(212,175,55,0.2)]">
                <div className="flex justify-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FFD700] fill-current" />
                  ))}
                </div>
                <p className="text-[#D1D5DB] italic mb-4">"{testimonial.quote}"</p>
                {testimonial.image ? (
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-[#FFD700] overflow-hidden">
                    <img 
                      src={testimonial.image} 
                      alt={`${testimonial.name} profile photo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#D4AF37] rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-[#FFD700]">
                    <span className="text-black text-xl font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                )}
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
              <p className="text-[#D1D5DB] mb-4 h-12">For families starting to organize for international travel</p>
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

      {/* Essential Resources */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#F3F4F6] mb-4">
              Essential Resources for International Travel
            </h2>
            <p className="text-lg text-[#D1D5DB]">
              Our travel checklists and articles help you stay prepared and stress-free, no matter where you're headed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Checklist 1 */}
            <div className="bg-[#111] border border-[rgba(212,175,55,0.2)] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#FFD700] hover:shadow-[0_0_12px_rgba(255,215,0,0.33)]">
              <div className="h-48 bg-gradient-to-br from-[rgba(212,175,55,0.05)] to-[rgba(212,175,55,0.02)] flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-[#D4AF37]" />
              </div>
              <div className="p-6">
                <div className="text-sm font-semibold text-[#D4AF37] mb-2">CHECKLIST</div>
                <h3 className="font-semibold text-[#F3F4F6] mb-2">
                  Steps to Take Before International Travel
                </h3>
              </div>
            </div>

            {/* Checklist 2 */}
            <div className="bg-[#111] border border-[rgba(212,175,55,0.2)] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#FFD700] hover:shadow-[0_0_12px_rgba(255,215,0,0.33)]">
              <div className="h-48 bg-gradient-to-br from-[rgba(212,175,55,0.05)] to-[rgba(212,175,55,0.02)] flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-[#D4AF37]" />
              </div>
              <div className="p-6">
                <div className="text-sm font-semibold text-[#D4AF37] mb-2">CHECKLIST</div>
                <h3 className="font-semibold text-[#F3F4F6] mb-2">
                  How to Stay Safe When Traveling Abroad
                </h3>
              </div>
            </div>

            {/* Article */}
            <div className="bg-[#111] border border-[rgba(212,175,55,0.2)] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#FFD700] hover:shadow-[0_0_12px_rgba(255,215,0,0.33)]">
              <div className="h-48 bg-gradient-to-br from-[rgba(212,175,55,0.05)] to-[rgba(212,175,55,0.02)] flex items-center justify-center">
                <FileText className="w-16 h-16 text-[#D4AF37]" />
              </div>
              <div className="p-6">
                <div className="text-sm font-semibold text-[#D4AF37] mb-2">ARTICLE</div>
                <h3 className="font-semibold text-[#F3F4F6] mb-2">
                  International Travel Safety Tips
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}