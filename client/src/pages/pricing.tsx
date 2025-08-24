import { Check, X, Star, Shield, Zap, Users, HelpCircle, ChevronDown, Heart } from "lucide-react";
import { useState, Fragment } from "react";
import Navbar from "@/components/navbar";

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const plans = [
    {
      name: "Starter",
      description: "Perfect for families just beginning their organization journey",
      price: { monthly: 0, annual: 0 },
      badge: "",
      color: "border-gray-200",
      buttonStyle: "bg-gray-100 hover:bg-gray-200 text-gray-800",
      features: [
        "Advanced encryption & security",
        "Up to 15 documents",
        "Smart organization trial",
        "Unlimited family members",
        "Mobile & desktop access"
      ],
      limitations: ["Limited document storage", "Basic support only"]
    },
    {
      name: "Family",
      description: "Comprehensive protection for growing families",
      price: { monthly: 12, annual: 8 },
      badge: "Most Popular",
      color: "border-primary ring-2 ring-primary",
      buttonStyle: "bg-primary hover:bg-secondary text-white",
      features: [
        "Everything in Starter",
        "Unlimited document storage",
        "Full smart organization system",
        "Priority email support",
        "Advanced sharing controls",
        "Document templates & guides",
        "Secure emergency access",
        "Family marketplace discounts"
      ],
      limitations: []
    },
    {
      name: "Premium",
      description: "Complete peace of mind for families with complex needs",
      price: { monthly: 25, annual: 18 },
      badge: "",
      color: "border-gray-200",
      buttonStyle: "bg-gray-900 hover:bg-gray-800 text-white",
      features: [
        "Everything in Family",
        "Business document organization",
        "Compliance & deadline reminders",
        "Multi-business management",
        "Priority support (email, chat & phone)",
        "Advanced security features",
        "Custom document categories",
        "Professional advisor access"
      ],
      limitations: []
    },
    {
      name: "Enterprise",
      description: "Tailored solutions for professionals and advisors",
      price: { monthly: "Custom", annual: "Custom" },
      badge: "",
      color: "border-gray-200",
      buttonStyle: "bg-purple-600 hover:bg-purple-700 text-white",
      features: [
        "Everything in Premium",
        "White-label solutions",
        "Bulk client management",
        "API access & integrations",
        "Custom training programs",
        "Dedicated account manager",
        "Volume-based pricing",
        "SLA guarantees"
      ],
      limitations: []
    }
  ];

  const comparisonFeatures = [
    {
      category: "Storage & Limits",
      features: [
        { name: "Documents", starter: "15", family: "Unlimited", premium: "Unlimited", enterprise: "Unlimited" },
        { name: "Smart Organization", starter: "Trial", family: "Full Access", premium: "Full Access", enterprise: "Full Access" },
        { name: "Family Members", starter: "Unlimited", family: "Unlimited", premium: "Unlimited", enterprise: "Unlimited" },
        { name: "Storage Space", starter: "1GB", family: "25GB", premium: "100GB", enterprise: "Custom" }
      ]
    },
    {
      category: "Core Features",
      features: [
        { name: "Advanced Security", starter: true, family: true, premium: true, enterprise: true },
        { name: "Mobile & Desktop Apps", starter: true, family: true, premium: true, enterprise: true },
        { name: "Secure Document Sharing", starter: true, family: true, premium: true, enterprise: true },
        { name: "Emergency Access", starter: false, family: true, premium: true, enterprise: true },
        { name: "Document Templates", starter: false, family: true, premium: true, enterprise: true },
        { name: "Advanced Search", starter: false, family: true, premium: true, enterprise: true }
      ]
    },
    {
      category: "Business Features",
      features: [
        { name: "Business Document Organization", starter: false, family: false, premium: true, enterprise: true },
        { name: "Compliance Tracking", starter: false, family: false, premium: true, enterprise: true },
        { name: "Multi-Business Support", starter: false, family: false, premium: true, enterprise: true },
        { name: "Professional Advisor Tools", starter: false, family: false, premium: true, enterprise: true }
      ]
    },
    {
      category: "Support",
      features: [
        { name: "Help Center Access", starter: true, family: true, premium: true, enterprise: true },
        { name: "Email Support", starter: "Basic", family: "Priority", premium: "Priority", enterprise: "Dedicated" },
        { name: "Chat Support", starter: false, family: false, premium: true, enterprise: true },
        { name: "Phone Support", starter: false, family: false, premium: true, enterprise: true }
      ]
    }
  ];

  const includedFeatures = {
    security: [
      { name: "Multi-Factor Authentication", description: "Advanced authentication prevents unauthorized access to your family's documents." },
      { name: "Data Tokenization", description: "Sensitive information is replaced with secure tokens, keeping it protected and isolated." },
      { name: "Real-Time Threat Monitoring", description: "Continuous monitoring detects unusual activities and potential security threats." },
      { name: "256-Bit AES Encryption", description: "Military-grade encryption protects all data in transit and at rest." },
      { name: "Biometric Security", description: "Facial recognition and fingerprint authentication available on all devices." },
      { name: "24/7 Security Operations", description: "Round-the-clock security monitoring with strict access controls and protocols." },
      { name: "Automated Backups", description: "Encrypted data is automatically backed up across multiple secure servers." },
      { name: "Password Breach Alerts", description: "Continuous monitoring alerts you to compromised passwords and security risks." }
    ],
    organization: [
      { name: "Smart Organization System", description: "AI-powered tools automatically categorize and organize your documents." },
      { name: "Family Collaboration", description: "Securely share access with family members and trusted professionals." },
      { name: "Intuitive Document Management", description: "Easy-to-use interface for organizing documents by category and importance." },
      { name: "Cross-Platform Access", description: "Access your documents from desktop, mobile, or tablet wherever you are." },
      { name: "Smart Reminders", description: "Automated reminders for important dates, renewals, and document updates." },
      { name: "Secure Link Sharing", description: "Share specific documents safely with time-limited, encrypted links." },
      { name: "Disaster Recovery", description: "Cloud-based storage ensures your documents survive any local disaster." },
      { name: "Version Control", description: "Track document changes and maintain historical versions automatically." }
    ],
    automation: [
      { name: "Document Analysis", description: "Advanced AI analyzes document content to extract key information automatically." },
      { name: "Data Extraction", description: "Important details are automatically identified and organized from uploaded documents." },
      { name: "Smart Auto-Fill", description: "Automatically populate forms and profiles using information from your documents." },
      { name: "Organization Suggestions", description: "Get intelligent recommendations for where documents should be filed." },
      { name: "Document Summaries", description: "AI-generated summaries make complex documents easily searchable and shareable." },
      { name: "Smart File Naming", description: "Automatically convert unclear filenames into descriptive, searchable titles." },
      { name: "Information Enrichment", description: "Enhance document records with additional context like contact info and dates." },
      { name: "Duplicate Detection", description: "Automatically identify and manage duplicate documents to keep storage clean." }
    ]
  };

  const faqItems = [
    {
      question: "How long has FamilyVault been protecting families?",
      answer: "FamilyVault has been helping families organize and secure their important documents since 2021. We've grown to serve thousands of families worldwide, continuously improving our platform based on real family needs."
    },
    {
      question: "What happens to my documents if I cancel my subscription?",
      answer: "You can securely export all your documents and data before your subscription ends. We provide easy-to-use export tools that ensure you maintain access to your important information even after cancellation."
    },
    {
      question: "How does FamilyVault compare to other document storage solutions?",
      answer: "Unlike generic cloud storage, FamilyVault is purpose-built for family document management. We provide intelligent organization, family-specific templates, emergency access features, and security designed specifically for sensitive family information. Most other solutions are just storage folders without the smart organization and family-focused features you need."
    },
    {
      question: "Is my family's information secure with FamilyVault?",
      answer: "Absolutely. FamilyVault uses military-grade 256-bit encryption, multi-factor authentication, and advanced security measures that exceed industry standards. Your documents are actually more secure with us than in a home filing cabinet where they could be lost, damaged, or stolen."
    },
    {
      question: "Do family members need their own subscriptions?",
      answer: "No. All plans include unlimited family member access. You can invite as many family members as needed to collaborate on your family's documents without additional subscription costs."
    },
    {
      question: "Can I try FamilyVault before committing to a paid plan?",
      answer: "Yes! Our Starter plan is completely free and lets you store up to 15 documents with full security features. You can also try our Family plan with a 30-day money-back guarantee."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            For every family, at every stage of life,<br />
            FamilyVault has the perfect plan
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose the plan that fits your family's needs. Start free and upgrade anytime as your requirements grow.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <span className={`mr-3 ${billingPeriod === 'monthly' ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              data-testid="billing-toggle"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'annual' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${billingPeriod === 'annual' ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Annual
            </span>
            <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Save 33%
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border-2 ${plan.color} bg-white p-8 shadow-lg hover:shadow-xl transition-shadow`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                      {plan.badge}
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    {typeof plan.price[billingPeriod] === 'number' ? (
                      <>
                        <span className="text-5xl font-bold text-gray-900">
                          ${plan.price[billingPeriod]}
                        </span>
                        {plan.price[billingPeriod] > 0 && (
                          <span className="text-gray-500 text-lg">
                            /{billingPeriod === 'annual' ? 'month' : 'month'}
                          </span>
                        )}
                        {plan.price[billingPeriod] > 0 && billingPeriod === 'annual' && (
                          <p className="text-sm text-gray-500 mt-1">Paid annually</p>
                        )}
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900">Custom Pricing</span>
                    )}
                  </div>
                  
                  <button 
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors ${plan.buttonStyle}`}
                    data-testid={`get-started-${plan.name.toLowerCase()}`}
                  >
                    {plan.name === 'Enterprise' ? 'Schedule Demo' : 'Get Started'}
                  </button>
                </div>
                
                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, limitIndex) => (
                    <div key={limitIndex} className="flex items-center">
                      <X className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-500 text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Guarantee & Discount */}
          <div className="text-center mt-12">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                30-day money-back guarantee
              </div>
              <div className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                <span>
                  We support community heroes with a{' '}
                  <a href="mailto:support@familyvault.com?subject=Hero%20Discount%20Request" className="text-primary hover:underline">
                    40% discount
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Compare Plans
          </h2>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Features</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Starter</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      <div className="flex flex-col items-center">
                        Family
                        <Star className="w-4 h-4 text-yellow-400 mt-1" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Premium</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((category, categoryIndex) => (
                    <Fragment key={categoryIndex}>
                      <tr className="bg-gray-100">
                        <td colSpan={5} className="px-6 py-3 text-sm font-semibold text-gray-900">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature, featureIndex) => (
                        <tr key={featureIndex} className="border-t border-gray-200">
                          <td className="px-6 py-4 text-sm text-gray-900">{feature.name}</td>
                          <td className="px-6 py-4 text-center text-sm">
                            {typeof feature.starter === 'boolean' ? (
                              feature.starter ? (
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-gray-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-gray-600">{feature.starter}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center text-sm">
                            {typeof feature.family === 'boolean' ? (
                              feature.family ? (
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-gray-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-gray-600">{feature.family}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center text-sm">
                            {typeof feature.premium === 'boolean' ? (
                              feature.premium ? (
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-gray-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-gray-600">{feature.premium}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center text-sm">
                            {typeof feature.enterprise === 'boolean' ? (
                              feature.enterprise ? (
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-gray-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-gray-600">{feature.enterprise}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            What's included in every plan
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Advanced tools for secure, effortless family organization — yes, even with the free plan.
          </p>
          
          <div className="space-y-16">
            {/* Security Features */}
            <div>
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Security</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {includedFeatures.security.map((feature, index) => (
                  <div key={index} className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-2">{feature.name}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Organization Features */}
            <div>
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Organization</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {includedFeatures.organization.map((feature, index) => (
                  <div key={index} className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-2">{feature.name}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Automation Features */}
            <div>
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Automation</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {includedFeatures.automation.map((feature, index) => (
                  <div key={index} className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-2">{feature.name}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors"
                  data-testid={`pricing-faq-${index}`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{item.question}</h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to secure your family's future?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start with our free plan and experience the peace of mind that comes with organized, secure family documents.
          </p>
          <button 
            data-testid="button-start-free-pricing"
            className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Start Free Today
          </button>
        </div>
      </section>
    </div>
  );
}