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
  Play
} from "lucide-react";

export default function DisasterPlanning() {
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
      icon: Heart,
      title: "Ensure Your Pet's Safety",
      description: "An evacuation shelter won't accept your pet without vaccination proof, but you didn't think to grab those records when you left home at a rush.",
      detail: "Uploading veterinary records to the Family Operating System® provides proof of your pet's vaccinations and your ownership."
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
      icon: AlertTriangle,
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
    { name: "Jennifer M.", title: "Member since 2022", rating: 5, quote: "After Hurricane Laura hit, having all our documents in FamilyVault was a lifesaver for insurance claims." },
    { name: "Robert K.", title: "Member since 2021", rating: 5, quote: "When we had to evacuate for wildfires, I could access our family's medical info instantly from my phone." },
    { name: "Maria S.", title: "Member since 2023", rating: 5, quote: "FamilyVault helped us get organized before disaster struck. Now we feel prepared for anything." }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                FamilyVault for Disaster Planning
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                A natural disaster can turn life upside down in an instant — but being prepared can be the difference between order and chaos for you and your family.
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
              <div className="bg-gray-900 rounded-2xl p-8 h-96 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-80"></div>
                <div className="relative text-center text-white">
                  <AlertTriangle className="w-24 h-24 text-red-400 mx-auto mb-4" />
                  <p className="text-gray-300 text-lg">Dramatic disaster scene with emergency responders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            After the California Wildfires, FamilyVault Became a Family's Lifeline
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            FamilyVault helped Jeremy W.'s family navigate the trauma of losing their home to the Alameda fire — and gave them the tools to start their recovery.
          </p>
          
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="bg-gray-800 rounded-2xl p-6 h-64 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-black opacity-50 rounded-2xl"></div>
              <div className="relative text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <div className="text-white text-sm">
                  <div className="font-semibold">After the California Wildfires,</div>
                  <div className="font-semibold">FamilyVault Became</div>
                  <div className="font-semibold">a Lifeline</div>
                  <div className="text-xs text-gray-300 mt-2">
                    How FamilyVault helped Jeremy W.'s<br />
                    family through their loss
                  </div>
                </div>
              </div>
            </div>
            <div className="text-left">
              <p className="text-gray-600 italic mb-4">
                "3 years after a wildfire ran its devastating effects immediately without scrambling to replace paperwork or remember what we lost. As tragic as this situation was, FamilyVault made the process so much easier. It gave us a head start when we needed it the most."
              </p>
              <div className="font-semibold text-gray-900">Jeremy W.</div>
              <div className="text-sm text-gray-600">FamilyVault member since 2022</div>
            </div>
          </div>
        </div>
      </section>

      {/* How FamilyVault Helps */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How FamilyVault Helps — Before and After a Disaster
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From securing family IDs to accessing vital insurance documents, FamilyVault ensures your most important information is safe and available when you need it.
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
                              <div className="bg-blue-600 rounded-t-lg p-3 mb-3">
                                <div className="flex items-center justify-center">
                                  <Smartphone className="w-8 h-8 text-white" />
                                </div>
                              </div>
                              <div className="text-xs">
                                <div className="font-medium mb-2">Emergency Contacts</div>
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
                          </>
                        )}
                        {index === 1 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="flex items-center mb-3">
                                <div className="w-6 h-6 bg-red-100 rounded mr-2 flex items-center justify-center">
                                  <Heart className="w-4 h-4 text-red-600" />
                                </div>
                                <span className="font-semibold text-sm">Medical Directive</span>
                              </div>
                              <div className="bg-red-50 rounded p-3 mb-3">
                                <div className="text-xs font-medium">Sarah Reynolds</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  <div>Date required: Feb 12, 2025</div>
                                  <div>Location of original: Office desk</div>
                                  <div className="mt-2 text-red-600 font-medium">ALLERGIES: Penicillin</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 2 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="text-xs font-medium mb-3">Allstate Homeowners Insurance</div>
                              <div className="space-y-2">
                                <div className="bg-blue-50 rounded p-2">
                                  <div className="text-xs">Policy Number</div>
                                  <div className="font-mono text-xs">HO-123456789</div>
                                </div>
                                <div className="bg-blue-50 rounded p-2">
                                  <div className="text-xs">Coverage Amount</div>
                                  <div className="font-semibold text-xs">$750,000</div>
                                </div>
                                <div className="bg-blue-50 rounded p-2">
                                  <div className="text-xs">Agent Contact</div>
                                  <div className="text-xs">(555) 456-7890</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 3 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="flex items-center mb-3">
                                <div className="w-6 h-6 bg-orange-100 rounded mr-2 flex items-center justify-center">
                                  <Heart className="w-4 h-4 text-orange-600" />
                                </div>
                                <span className="font-semibold text-sm">Pet Records - Max</span>
                              </div>
                              <div className="bg-orange-50 rounded p-3">
                                <div className="text-xs">
                                  <div className="font-medium">Vaccinations Current</div>
                                  <div className="text-gray-600 mt-1">
                                    <div>Rabies: 03/15/2024</div>
                                    <div>DHPP: 03/15/2024</div>
                                    <div>Vet: Dr. Smith Animal Clinic</div>
                                    <div>Microchip: 982000123456789</div>
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
              <p className="text-gray-600 mb-4">For families starting to prepare for emergencies</p>
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
              <p className="text-gray-600 mb-4">Build a comprehensive emergency plan</p>
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
              <p className="text-gray-600 mb-4">Organize your business and financial future</p>
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
              Essential Resources for Your Family's Disaster Planning
            </h2>
            <p className="text-lg text-gray-600">
              Explore expert advice on safeguarding your essential documents before, during, and after a disaster.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Featured Article */}
            <div className="md:col-span-2">
              <div className="bg-red-900 rounded-2xl p-8 text-white h-64 flex items-center">
                <div>
                  <div className="text-sm font-semibold text-red-400 mb-2">FEATURED GUIDE</div>
                  <h3 className="text-2xl font-bold mb-4">
                    Be Ready for Any Disaster
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Give yourself the peace of mind that comes with knowing you've done everything possible to keep your family safe.
                  </p>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold">
                    Download
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Resource */}
            <div>
              <div className="bg-gray-100 rounded-2xl p-6 h-64 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="text-sm font-semibold text-red-600 mb-2">CHECKLIST</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Emergency Preparedness Checklist
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
                <div className="h-48 bg-red-100 flex items-center justify-center">
                  <Shield className="w-16 h-16 text-red-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-red-600 mb-2">Disaster Planning</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    How to Protect Your Documents From Fire
                  </h4>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-48 bg-red-100 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-red-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-red-600 mb-2">Emergency Planning</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    4 Types of Documents You'll Need in an Emergency
                  </h4>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-48 bg-red-100 flex items-center justify-center">
                  <Upload className="w-16 h-16 text-red-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-red-600 mb-2">Document Storage</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Emergency Document Storage: Creating a Document Inventory
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