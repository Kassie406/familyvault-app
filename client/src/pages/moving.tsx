import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { 
  Package, 
  FileText, 
  Home, 
  Users, 
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
  Phone,
  Bell
} from "lucide-react";
import movingCoupleImage from "@assets/image_1756094383182.png";
import digitalSecurityImage from "@assets/image_1756094591825.png";
import mobileAppImage from "@assets/image_1756094660501.png";
import askExpertsImage from "@assets/image_1756094723870.png";

export default function Moving() {
  const features = [
    {
      icon: Shield,
      title: "Protect Your Data While Moving",
      description: "Your laptop gets stolen from your car during the move — and the information is not backed up.",
      detail: "FamilyVault secures sensitive documents with encryption and lets you manage who can access them."
    },
    {
      icon: FileText,
      title: "Keep Track of Moving Documents",
      description: "Your movers broke a lamp — but you can't file a claim until you find the contract, which is lost amid your boxes.",
      detail: "Store the movers' contract and related receipts in FamilyVault's Family Operating System® so they're secure and easy to find."
    },
    {
      icon: Smartphone,
      title: "Access What You Need on the Go",
      description: "You're enrolling your child at their new school — and you need a birth certificate on the spot.",
      detail: "Instantly pull up your child's birth certificate, vaccination record, and other essential documents."
    },
    {
      icon: Users,
      title: "Share New Details With Contacts",
      description: "Your babysitter can't get into your new backyard because she needs a gate access code and you can't be reached.",
      detail: "Grant partial account access or use FamilyVault's SecureLinks™ to share information with family and professionals."
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
    { name: "Jessica M.", title: "Member since 2022", rating: 5, quote: "FamilyVault made our cross-country move so much smoother — everything was organized and accessible." },
    { name: "Michael K.", title: "Member since 2023", rating: 5, quote: "Lost our moving contract during the chaos, but having it in FamilyVault saved us from a huge headache." },
    { name: "Amanda R.", title: "Member since 2021", rating: 5, quote: "Being able to share documents with our family during the move was invaluable." }
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
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                FamilyVault for Moving to a New Home
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                A new home brings big changes — and the Family Operating System® keeps your essential information secure and accessible before, during, and after your move.
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
              <div className="bg-orange-50 rounded-2xl p-8 h-96 overflow-hidden">
                <img 
                  src={movingCoupleImage} 
                  alt="Couple carrying moving boxes outside their new home"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How FamilyVault Helps */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How FamilyVault Helps — Through All Stages of Moving
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Whether you're confirming movers or settling into your new home, your important documents stay private, protected, and ready to use.
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
                              <div className="flex items-center mb-3">
                                <div className="w-6 h-6 bg-blue-100 rounded mr-2 flex items-center justify-center">
                                  <Home className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="font-semibold text-sm">Property</span>
                              </div>
                              <div className="bg-blue-50 rounded p-3 mb-3">
                                <div className="text-xs font-medium">Home Warranty</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  <div>Replace Items</div>
                                  <div>End date: Feb 12, 2025</div>
                                  <div>Premium $0.00 - Office desk</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 1 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="bg-blue-600 text-white text-center py-2 rounded-t text-sm font-semibold mb-3">
                                📋 MOVING
                              </div>
                              <div className="space-y-2 text-xs">
                                <div className="bg-blue-50 rounded p-2">
                                  <div className="font-medium">Moving Contract</div>
                                  <div className="text-gray-600">ABC Moving Services • Jun 15, 2024</div>
                                  <div className="text-blue-600">$2,450</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 2 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-xs mx-auto">
                              <div className="bg-gray-800 rounded-t-lg p-3 mb-3">
                                <div className="flex items-center justify-center">
                                  <Smartphone className="w-8 h-8 text-white" />
                                </div>
                              </div>
                              <div className="text-xs">
                                <div className="font-medium">Birth Certificate</div>
                                <div className="text-gray-600 mt-1">Emily Johnson</div>
                                <div className="text-gray-600">Born: March 15, 2018</div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 3 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="text-xs font-medium mb-3">Partial access</div>
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <div className="w-6 h-6 bg-green-500 rounded-full mr-2 flex items-center justify-center text-white text-xs">C</div>
                                  <div>
                                    <div className="text-xs font-medium">Christine Vasquez</div>
                                    <div className="text-xs text-gray-600">Sitter</div>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-6 h-6 bg-blue-500 rounded-full mr-2 flex items-center justify-center text-white text-xs">D</div>
                                  <div>
                                    <div className="text-xs font-medium">Desirae Phris</div>
                                    <div className="text-xs text-gray-600">Lawyer</div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs font-medium mt-3">Legacy access</div>
                              <div className="flex items-center mt-1">
                                <div className="w-6 h-6 bg-purple-500 rounded-full mr-2 flex items-center justify-center text-white text-xs">A</div>
                                <div>
                                  <div className="text-xs font-medium">Anna Reynolds</div>
                                  <div className="text-xs text-gray-600">Mother</div>
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
              What Our Members Say About FamilyVault
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
              Essential Resources for Moving to a New Home
            </h2>
            <p className="text-lg text-gray-600">
              Get expert guidance to stay organized, avoid common pitfalls, and settle in with less stress.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Featured Guide */}
            <div className="md:col-span-2">
              <div className="bg-gray-900 rounded-2xl p-8 text-white h-64 flex items-center">
                <div>
                  <div className="text-sm font-semibold text-blue-400 mb-2">FEATURED GUIDE</div>
                  <h3 className="text-2xl font-bold mb-4">
                    The Ultimate Moving Guide: Less Stress, More Control, a Smoother Start
                  </h3>
                  <p className="text-gray-300 mb-6">
                    From timelines to checklists to document storage, FamilyVault helps you stay organized and in control through every part of your move.
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
                    Download
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Resource */}
            <div>
              <div className="bg-gray-100 rounded-2xl p-6 h-64 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-sm font-semibold text-orange-600 mb-2">CHECKLIST</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Moving Checklist: 8 Weeks to Moving Day
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Articles */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Articles</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-48 bg-orange-100 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-orange-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-orange-600 mb-2">Moving</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Why It's Time to Ditch Your Paper Filing System
                  </h4>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-48 bg-orange-100 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-orange-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-orange-600 mb-2">Moving</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    How to Organize Important Documents Before You Move
                  </h4>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-48 bg-orange-100 flex items-center justify-center">
                  <Home className="w-16 h-16 text-orange-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-orange-600 mb-2">Moving</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Moving for Work: How to Stay Organized
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}