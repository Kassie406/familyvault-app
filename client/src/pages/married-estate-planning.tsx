import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Shield, CheckCircle, Calendar, FileText, Users, ArrowRight, Clock, Scale, AlertCircle, DollarSign, Heart, UserCheck } from "lucide-react";

export default function MarriedEstateePlanning() {
  const estateCategories = [
    {
      category: "Wills & Testaments",
      description: "Legal documents outlining asset distribution after death",
      importance: "Critical",
      documents: ["Last will and testament", "Witness signatures", "Notarization documents", "Will storage information"],
      tips: "Update your will immediately after marriage and whenever major life events occur"
    },
    {
      category: "Power of Attorney",
      description: "Legal authority for financial and healthcare decisions",
      importance: "Critical", 
      documents: ["Financial power of attorney", "Healthcare power of attorney", "Living will/advance directive", "HIPAA authorization forms"],
      tips: "Choose someone you trust completely and discuss your wishes with them in detail"
    },
    {
      category: "Beneficiary Updates",
      description: "Update beneficiaries on all accounts and policies",
      importance: "Critical",
      documents: ["Retirement account beneficiaries", "Life insurance beneficiaries", "Bank account beneficiaries", "Investment account updates"],
      tips: "Review and update beneficiaries annually or after any major life changes"
    },
    {
      category: "Trust Documents", 
      description: "Advanced estate planning tools for asset protection",
      importance: "High",
      documents: ["Living trust agreements", "Trust funding documents", "Trustee appointments", "Trust tax documents"],
      tips: "Consider trusts if you have significant assets, complex family situations, or want to avoid probate"
    },
    {
      category: "Guardian Designations",
      description: "Appointments for future children or dependents",
      importance: "High",
      documents: ["Guardian appointment forms", "Backup guardian designations", "Care instructions for children", "Financial provisions for guardians"],
      tips: "Discuss guardian appointments with your chosen guardians before making it official"
    },
    {
      category: "Digital Assets",
      description: "Management of online accounts and digital property",
      importance: "Medium",
      documents: ["Digital asset inventory", "Account access information", "Digital executor appointments", "Online account instructions"],
      tips: "Keep a secure record of all digital accounts and how you want them handled after death"
    }
  ];

  const planningSteps = [
    {
      step: 1,
      title: "Inventory Your Assets",
      description: "Create a comprehensive list of all assets, debts, and accounts for both partners",
      timeframe: "Week 1-2"
    },
    {
      step: 2, 
      title: "Draft Basic Estate Documents",
      description: "Create wills, power of attorney documents, and advance directives",
      timeframe: "Month 1"
    },
    {
      step: 3,
      title: "Update All Beneficiaries",
      description: "Change beneficiaries on retirement accounts, insurance policies, and bank accounts", 
      timeframe: "Month 1-2"
    },
    {
      step: 4,
      title: "Consider Advanced Planning",
      description: "Evaluate need for trusts, tax planning, or other sophisticated estate planning tools",
      timeframe: "Month 2-3"
    },
    {
      step: 5,
      title: "Review and Update Regularly",
      description: "Schedule annual reviews and updates whenever major life events occur",
      timeframe: "Annually"
    }
  ];

  const estatePlanningTips = [
    {
      category: "Legal Consultation",
      icon: Scale,
      tip: "Work with qualified estate planning attorneys",
      details: "While basic forms are available online, complex estates and family situations require professional legal guidance."
    },
    {
      category: "Regular Updates", 
      icon: Calendar,
      tip: "Review estate plans annually or after major life events",
      details: "Marriage, children, divorce, new assets, or changes in tax laws all require estate plan updates."
    },
    {
      category: "Communication",
      icon: Users,
      tip: "Discuss your plans with family members and executors",
      details: "Make sure your chosen executors and beneficiaries understand their roles and your wishes."
    }
  ];

  const assetCategories = [
    {
      type: "Financial Assets",
      items: ["Checking/savings accounts", "Investment accounts", "Retirement accounts (401k, IRA)", "Life insurance policies"]
    },
    {
      type: "Real Estate",
      items: ["Primary residence", "Vacation homes", "Investment properties", "Undeveloped land"]
    },
    {
      type: "Personal Property",
      items: ["Vehicles", "Jewelry & valuable items", "Art & collectibles", "Family heirlooms"]
    },
    {
      type: "Business Interests",
      items: ["Business ownership", "Partnership interests", "Professional practices", "Intellectual property"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Estate Planning
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Protect your family's future with comprehensive estate planning. Organize wills, power of attorney 
              documents, beneficiary information, and important legal documents in one secure location.
            </p>
          </div>
        </div>
      </section>

      {/* Estate Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Estate Planning Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {estateCategories.map((category, index) => (
              <div 
                key={index}
                className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6 hover:border-[#FFD43B]/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{category.category}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    category.importance === 'Critical' 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : category.importance === 'High'
                      ? 'bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {category.importance}
                  </span>
                </div>
                <p className="text-[#A5A5A5] mb-4">{category.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Key Documents:</h4>
                  <ul className="space-y-1">
                    {category.documents.map((document, docIndex) => (
                      <li key={docIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {document}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium flex items-start">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    {category.tips}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planning Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Estate Planning Process for Newlyweds
          </h2>
          <div className="space-y-8">
            {planningSteps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#FFD43B] rounded-full flex items-center justify-center text-[#0E0E0E] font-bold text-lg">
                    {step.step}
                  </div>
                </div>
                <div className="ml-6 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                    <span className="text-[#FFD43B] text-sm font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {step.timeframe}
                    </span>
                  </div>
                  <p className="text-[#A5A5A5] leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Asset Inventory */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Asset Inventory Checklist
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {assetCategories.map((asset, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{asset.type}</h3>
                <ul className="space-y-2">
                  {asset.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-[#A5A5A5]">
                      <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estate Planning Tips */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Estate Planning Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {estatePlanningTips.map((tip, index) => {
              const IconComponent = tip.icon;
              return (
                <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="w-12 h-12 bg-[#FFD43B]/10 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-[#FFD43B]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{tip.category}</h3>
                  <p className="text-[#FFD43B] font-medium mb-2">{tip.tip}</p>
                  <p className="text-[#A5A5A5] text-sm">{tip.details}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your estate planning documents?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your wills, power of attorney documents, and estate planning materials secure and organized with FamilyCircle Secure.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-estate"
            className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-4 rounded-full hover:bg-[#E6C140] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:ring-offset-2 focus:ring-offset-[#0E0E0E] min-h-[44px]"
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}