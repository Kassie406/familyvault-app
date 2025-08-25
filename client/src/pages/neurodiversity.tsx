import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import thoughtfulWorkerImage from "@assets/image_1756096911806.png";
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

  const testimonials = [
    { name: "Alex R.", title: "Member since 2022", rating: 5, quote: "FamilyVault has been a game-changer for managing my ADHD. Having everything organized in one place reduces my stress and helps me stay on top of important tasks." },
    { name: "Jordan M.", title: "Member since 2021", rating: 5, quote: "As someone with autism, routine and organization are crucial for me. FamilyVault helps maintain my structure while keeping important information accessible." },
    { name: "Sam K.", title: "Member since 2023", rating: 5, quote: "The document organization features help me during executive function challenges. I don't have to stress about finding important paperwork anymore." }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-teal-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                FamilyVault for Neurodivergent Individuals
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Navigate life with confidence: The Family Operating System® keeps your essential information organized, accessible, and stress-free, supporting your own way of thinking and processing.
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
              <div className="bg-teal-50 rounded-2xl p-8 h-96 overflow-hidden">
                <img 
                  src={thoughtfulWorkerImage} 
                  alt="Young man with glasses and cap working thoughtfully, representing focus and concentration"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How FamilyVault Makes It Easier to Feel Prepared and in Control
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            Daniel J. and his partner live with autism and ADHD, and they know it can be hard to keep life organized when juggling documents, deadlines, and decisions.
          </p>
          
          <div className="bg-gradient-to-r from-red-200 to-red-300 rounded-2xl p-8 lg:p-12 relative">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Daniel J.</h3>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Why FamilyVault?<br />The Family Operating System®</h4>
                <div className="bg-gray-900 text-white px-4 py-2 rounded text-sm inline-block mb-4">
                  FamilyVault.
                </div>
                <div className="absolute top-8 right-8 bg-white rounded-full p-4 shadow-lg">
                  <Play className="w-8 h-8 text-gray-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <blockquote className="text-gray-800 italic mb-4">
                  "I use FamilyVault on a daily basis. I found this app to be game-changing for me. And it's not just for me, but for my whole family."
                </blockquote>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Daniel J.</div>
                  <div className="text-sm text-gray-600">FamilyVault member since 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How FamilyVault Helps */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How FamilyVault Helps — Supporting Your Neurodivergent Life
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From medical records to daily schedules, FamilyVault adapts to your cognitive style, reducing overwhelm and keeping your essential information exactly where you need it.
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
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="text-xs mb-3">
                                <div className="flex items-center mb-3">
                                  <div className="w-6 h-6 bg-blue-100 rounded mr-2 flex items-center justify-center">
                                    <Stethoscope className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <span className="font-semibold">Family IDs</span>
                                </div>
                                <div className="bg-blue-50 rounded p-2 mb-3">
                                  <div className="text-center">
                                    <div className="font-medium">Medical Directive</div>
                                    <div className="text-gray-500">Scott Reynolds</div>
                                    <div className="text-xs">February 12, 2016</div>
                                    <div className="text-xs">Created by insurance • Other docs</div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-800">
                                  <div className="font-medium">Managing Medical Information</div>
                                  <div className="text-gray-600 mt-1">You're seeing a medical specialist and can't remember which prescriptions you've tried or when your symptoms started.</div>
                                  <div className="text-gray-800 mt-2">FamilyVault centralizes your medical history, treatment notes, and symptom tracking, so you can quickly access what you need.</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 1 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="text-xs">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between bg-gray-50 rounded p-2">
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
                                      <span>Family IDs</span>
                                    </div>
                                    <div className="text-gray-400">5</div>
                                  </div>
                                  <div className="flex items-center justify-between bg-gray-50 rounded p-2">
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
                                      <span>Finances</span>
                                    </div>
                                    <div className="text-gray-400">4</div>
                                  </div>
                                  <div className="flex items-center justify-between bg-blue-50 rounded p-2">
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 bg-blue-400 rounded mr-2"></div>
                                      <span>2024 John Taxed</span>
                                    </div>
                                    <div className="text-gray-400">5</div>
                                  </div>
                                  <div className="flex items-center justify-between bg-gray-50 rounded p-2">
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
                                      <span>2024 Tax Receipts</span>
                                    </div>
                                    <div className="text-gray-400">5</div>
                                  </div>
                                </div>
                                
                                <div className="border-t pt-3 mt-3">
                                  <div className="flex items-center mb-2">
                                    <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                                    <span className="font-semibold">Staying Organized During Executive Function Challenges</span>
                                  </div>
                                  <div className="text-gray-600">It's tax season and you're overwhelmed trying to gather receipts, W-2s and bank statements while managing work deadlines and daily tasks.</div>
                                  <div className="text-gray-800 mt-2">FamilyVault's automated organization helps you find important documents quickly, reducing cognitive load during stressful periods.</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 2 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-xs mx-auto">
                              <div className="text-xs">
                                <div className="bg-gray-800 rounded-t-lg p-3 mb-3">
                                  <div className="flex items-center justify-center">
                                    <Smartphone className="w-8 h-8 text-white" />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="text-center text-blue-600 mb-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                                      <FileText className="w-4 h-4 text-blue-600" />
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
                                
                                <div className="border-t pt-3 mt-3">
                                  <div className="flex items-center mb-2">
                                    <Phone className="w-4 h-4 text-blue-600 mr-2" />
                                    <span className="font-semibold">Preparing for Life Transitions</span>
                                  </div>
                                  <div className="text-gray-600">You need to provide background check documents for a new job, but gathering all that information is time-consuming and chaotic.</div>
                                  <div className="text-gray-800 mt-2">FamilyVault keeps your professional documents organized and easily shareable, letting you focus on the transition.</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 3 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="text-xs">
                                <div className="bg-gray-100 rounded p-3 mb-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Laptop Settings</span>
                                    <div className="text-gray-400">⚙️</div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span>Luncery</span>
                                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Apertory</span>
                                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Settings</span>
                                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="border-t pt-3">
                                  <div className="flex items-center mb-2">
                                    <Shield className="w-4 h-4 text-blue-600 mr-2" />
                                    <span className="font-semibold">Protecting Your Routine and Information</span>
                                  </div>
                                  <div className="text-gray-600">You lose your phone — and all access to passwords, phone numbers, and the digital copies of documents you'd kept on it.</div>
                                  <div className="text-gray-800 mt-2">FamilyVault securely backs up your essential information and lets you access it from any device.</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                      <IconComponent className="w-4 h-4 text-teal-600" />
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
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <IconComponent className="w-4 h-4 text-teal-600" />
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
              <p className="text-gray-600 mb-4">For families starting to organize for neurodivergence</p>
              <div className="text-3xl font-bold mb-6">$0</div>
              <button
                data-testid="button-get-started-free-plan"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mb-6"
              >
                Get started
              </button>
              <ul className="space-y-2 text-sm">
                <li>• Advanced security</li>
                <li>• 12 items</li>
                <li>• 50GB</li>
                <li>• Autopilot™ by FamilyVault (beta)</li>
                <li>• Tailored onboarding</li>
                <li>• Unlimited collaborators</li>
              </ul>
            </div>

            {/* Silver Plan */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-xl font-bold mb-2">Silver</h3>
              <p className="text-gray-600 mb-4">Build a comprehensive organization plan</p>
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
                <li>• Liability support</li>
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
              <p className="text-gray-600 mb-4">Organize your entire business and financial future</p>
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
                <li>• Entity relationship mapping</li>
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
              Essential Resources for Neurodivergent Support
            </h2>
            <p className="text-lg text-gray-600">
              FamilyVault offers structure you can count on — a calm, secure platform that does the heavy lifting for you.
            </p>
          </div>

          {/* Featured Article */}
          <div className="mb-12">
            <div className="bg-gray-100 rounded-2xl p-8 lg:p-12 flex items-center">
              <div className="flex-1">
                <div className="text-sm font-semibold text-blue-600 mb-2">FEATURED ARTICLE</div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  Tame the Chaos: A Digital Vault for Autism and ADHD
                </h3>
                <p className="text-gray-600 mb-6">
                  You don't have to overhaul your brain to stay on top of everything. You just need tools that support the way you work.
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
                  Read article
                </button>
              </div>
              <div className="hidden lg:block lg:w-1/3 lg:ml-8">
                <div className="h-48 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-16 h-16 text-teal-600" />
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