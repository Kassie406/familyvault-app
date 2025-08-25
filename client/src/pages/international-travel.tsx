import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import travelerAirportImage from "@assets/image_1756094101211.png";
import digitalSecurityImage from "@assets/image_1756094141073.png";
import mobileAppImage from "@assets/image_1756094227046.png";
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

  const testimonials = [
    { name: "Martin F.", title: "Member since 2023", rating: 5, quote: "FamilyVault made international travel so much easier — had everything I needed in one place." },
    { name: "Emily G.", title: "Member since 2021", rating: 5, quote: "Lost my passport abroad, but having a digital copy in FamilyVault saved me hours of stress." },
    { name: "Oscar S.", title: "Member since 2023", rating: 5, quote: "Finally, a secure way to keep my travel documents organized and accessible." }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <Plane className="w-6 h-6 text-orange-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                FamilyVault for International Travel
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                International travel is an adventure, but keeping track of your travel documents shouldn't be. FamilyVault ensures your passport and other docs are secure and accessible.
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
              <div className="bg-orange-50 rounded-2xl p-8 h-96 flex items-center justify-center overflow-hidden">
                <img 
                  src={travelerAirportImage} 
                  alt="Traveler overlooking scenic mountain landscape at airport"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Problems, Solved */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Travel Problems, Solved
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Even the best travel plans can go sideways. Lost passport? Emergency? FamilyVault's got your back — keeping you prepared for whatever twist (or chaos) comes your way.
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
                  <div className="bg-gray-100 rounded-2xl p-8 h-48 flex items-center justify-center mb-6 overflow-hidden">
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

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Travelers Say About FamilyVault
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="flex justify-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-800 italic mb-4">"{testimonial.quote}"</p>
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3"></div>
                <div className="font-semibold text-sm">{testimonial.name}</div>
                <div className="text-xs text-gray-600">{testimonial.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              No hidden fees. No surprises. Just complete peace of mind.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <p className="text-gray-600 mb-4">For families looking to get started</p>
              <div className="text-3xl font-bold mb-6">$0</div>
              <button
                data-testid="button-get-started-free-plan"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mb-6"
              >
                Get started
              </button>
              <ul className="space-y-2 text-sm">
                <li>• Advanced security</li>
                <li>• 10 items</li>
                <li>• 500MB</li>
                <li>• Autopilot™ by FamilyVault (beta)</li>
                <li>• Unlimited collaborators</li>
              </ul>
            </div>

            {/* Silver Plan */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-xl font-bold mb-2">Silver</h3>
              <p className="text-gray-600 mb-4">Unlock unlimited items and unlock additional resources</p>
              <div className="text-3xl font-bold mb-6">$10</div>
              <button
                data-testid="button-get-started-silver-plan"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mb-6"
              >
                Get started
              </button>
              <ul className="space-y-2 text-sm">
                <li>• Everything in Free plus:</li>
                <li>• Unlimited items</li>
                <li>• Autopilot™ by FamilyVault</li>
                <li>• Archive support</li>
                <li>• Priority customer expert</li>
                <li>• The FamilyVault Marketplace</li>
              </ul>
            </div>

            {/* Gold Plan */}
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-6 border-2 border-purple-300 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Gold</h3>
              <p className="text-gray-600 mb-4">Total peace of mind for your family & your family business</p>
              <div className="text-3xl font-bold mb-6">$20</div>
              <button
                data-testid="button-get-started-gold-plan"
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold mb-6"
              >
                Get started
              </button>
              <ul className="space-y-2 text-sm">
                <li>• Everything in Silver plus:</li>
                <li>• Business information</li>
                <li>• Organization (LLC, S Corp, S Corp, INC, etc.)</li>
                <li>• Friendly expert support</li>
                <li>• And more...</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-gray-600">
            30-day money-back guarantee | We support first responders with a hero discount.
          </div>
        </div>
      </section>

      {/* Essential Resources */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Essential Resources for International Travel
            </h2>
            <p className="text-lg text-gray-600">
              Our travel checklists and articles help you stay prepared and stress-free, no matter where you're headed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Checklist 1 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="h-48 bg-orange-100 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-orange-600" />
              </div>
              <div className="p-6">
                <div className="text-sm font-semibold text-orange-600 mb-2">CHECKLIST</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Steps to Take Before International Travel
                </h3>
              </div>
            </div>

            {/* Checklist 2 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="h-48 bg-orange-100 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-orange-600" />
              </div>
              <div className="p-6">
                <div className="text-sm font-semibold text-orange-600 mb-2">CHECKLIST</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  How to Stay Safe When Traveling Abroad
                </h3>
              </div>
            </div>

            {/* Article */}
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="h-48 bg-orange-100 flex items-center justify-center">
                <FileText className="w-16 h-16 text-orange-600" />
              </div>
              <div className="p-6">
                <div className="text-sm font-semibold text-orange-600 mb-2">ARTICLE</div>
                <h3 className="font-semibold text-gray-900 mb-2">
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