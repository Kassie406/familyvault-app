import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
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
  CreditCard
} from "lucide-react";

export default function StartingAFamily() {
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

  const bottomFeatures = [
    {
      icon: Shield,
      title: "Easily Organize Your Documents",
      description: "Systematic document upload keeps everything organized"
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
    { name: "Maria S.", title: "Member since 2022", rating: 5, quote: "FamilyVault helped us stay organized throughout pregnancy and after our baby arrived. Everything we needed was right there!" },
    { name: "James R.", title: "Member since 2021", rating: 5, quote: "Having all our baby's medical records and insurance info accessible made doctor visits so much smoother." },
    { name: "Lisa K.", title: "Member since 2023", rating: 5, quote: "The babysitter instructions feature gave us peace of mind when leaving our newborn for the first time." }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Baby className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                FamilyVault for Starting a Family
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                This chapter of your life changes everything — and the Family Operating System® keeps you organized, calm, and ready for what's next.
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
              <div className="bg-blue-50 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Baby className="w-24 h-24 text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Mother holding her baby with striped shirt</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How FamilyVault Helps, From Planning to Parenthood */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How FamilyVault Helps, From Planning to Parenthood
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Keep your information safe, private, and manageable — before your baby arrives and long after.
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
                              <div className="bg-gray-800 rounded-t-lg p-3 mb-3">
                                <div className="flex items-center justify-center">
                                  <Smartphone className="w-8 h-8 text-white" />
                                </div>
                              </div>
                              <div className="text-xs">
                                <div className="flex items-center mb-3">
                                  <div className="w-6 h-6 bg-blue-100 rounded mr-2 flex items-center justify-center">
                                    <Heart className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <span className="font-semibold">McKinley Family Medical</span>
                                </div>
                                <div className="space-y-2">
                                  <div className="bg-blue-50 rounded p-2">
                                    <div className="text-xs">Personal Information</div>
                                  </div>
                                  <div className="bg-blue-50 rounded p-2">
                                    <div className="text-xs">Files</div>
                                  </div>
                                  <div className="bg-blue-50 rounded p-2">
                                    <div className="text-xs">Emergency</div>
                                  </div>
                                </div>
                                <div className="mt-3 text-xs text-blue-600">
                                  <div className="underline">More info about emergency contacts</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 1 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="text-xs font-medium mb-3">Babysitter Instructions</div>
                              <div className="bg-blue-50 rounded p-3 mb-3 text-left">
                                <div className="text-xs font-medium mb-2">Instructions for if we can't be reached:</div>
                                <ul className="text-xs space-y-1">
                                  <li>• Contact Grandma (phone number)</li>
                                  <li>• Contact Dr. Peterson (phone number)</li>
                                  <li>• Allergies and food to avoid</li>
                                  <li>• Bedtime routine</li>
                                  <li>• Emergency room hospitals</li>
                                  <li>• Insurance card in wallet</li>
                                </ul>
                              </div>
                              <div className="text-xs">
                                <div className="font-medium">Emergency Information</div>
                                <div className="text-gray-600 mt-1">All the details your sitter needs...</div>
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
                                <div className="text-center mb-4">
                                  <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                                    <Baby className="w-6 h-6 text-blue-600" />
                                  </div>
                                  <div className="font-medium">Baby's Records</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="bg-blue-50 rounded p-2 text-left">
                                    <div className="font-medium">Birth Certificate</div>
                                    <div className="text-gray-500">PDF • 2.4 MB</div>
                                  </div>
                                  <div className="bg-blue-50 rounded p-2 text-left">
                                    <div className="font-medium">Immunization Record</div>
                                    <div className="text-gray-500">PDF • 1.8 MB</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {index === 3 && (
                          <>
                            <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                              <div className="text-xs mb-3">
                                <div className="font-semibold mb-2">Full access</div>
                                <div className="flex items-center mb-2">
                                  <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                                  <span>David Reynolds</span>
                                  <ChevronRight className="w-3 h-3 ml-auto" />
                                </div>
                                
                                <div className="font-semibold mb-2 mt-3">Partial access</div>
                                <div className="flex items-center mb-1">
                                  <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                                  <span>Jen Carter</span>
                                  <ChevronRight className="w-3 h-3 ml-auto" />
                                </div>
                                <div className="text-gray-500 text-xs ml-8">Trusted family member</div>
                                
                                <div className="flex items-center">
                                  <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                                  <span>Mike Carter</span>
                                  <ChevronRight className="w-3 h-3 ml-auto" />
                                </div>
                                <div className="text-gray-500 text-xs ml-8">Trusted family member</div>
                                
                                <div className="font-semibold mb-2 mt-3">Legacy access</div>
                                <div className="flex items-center">
                                  <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                                  <span>Anna Reynolds</span>
                                  <ChevronRight className="w-3 h-3 ml-auto" />
                                </div>
                                <div className="text-gray-500 text-xs ml-8">Guardian/sister</div>
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
              <p className="text-gray-600 mb-4">For young families starting to organize their information</p>
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
              <p className="text-gray-600 mb-4">A complete record of your family's life, always accessible</p>
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
              <p className="text-gray-600 mb-4">Secure your child's entire history, plus your family's business</p>
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
              Essential Articles for Starting a Family
            </h2>
            <p className="text-lg text-gray-600">
              Get expert guidance to help you feel prepared, protected, and ready for life with your new family.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Featured Article */}
            <div className="md:col-span-2">
              <div className="bg-blue-900 rounded-2xl p-8 text-white h-64 flex items-center">
                <div>
                  <div className="text-sm font-semibold text-blue-400 mb-2">FEATURED ARTICLE</div>
                  <h3 className="text-2xl font-bold mb-4">
                    Organizing Your Important Documents Before Baby Arrives
                  </h3>
                  <p className="text-gray-300 mb-6">
                    You might find yourself scrambling for a bottle or burp cloth — but you shouldn't need to search for an insurance card or immunization record.
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
                    Read article
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Resource */}
            <div>
              <div className="bg-gray-100 rounded-2xl p-6 h-64 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Baby className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-sm font-semibold text-blue-600 mb-2">CHECKLIST</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    New Parent Preparation Guide
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
                <div className="h-48 bg-blue-100 flex items-center justify-center">
                  <Users className="w-16 h-16 text-blue-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-blue-600 mb-2">Family Planning</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    From Couple to Family: What to Update When Life Changes
                  </h4>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-48 bg-blue-100 flex items-center justify-center">
                  <Baby className="w-16 h-16 text-blue-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-blue-600 mb-2">Preparation</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Smarter Prep for the Family You're Starting
                  </h4>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-48 bg-blue-100 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-blue-600" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-blue-600 mb-2">Documentation</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Expert Q&A: What Happens to My Kids if Something Happens to Me?
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