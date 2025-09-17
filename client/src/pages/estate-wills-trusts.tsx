import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { FileText, CheckCircle, Calendar, Scale, Shield, ArrowRight, Clock, Users, AlertCircle, Heart, UserCheck, Building } from "lucide-react";

export default function EstateWillsTrusts() {
  const willsCategories = [
    {
      category: "Last Will & Testament",
      description: "Legal document outlining asset distribution after death",
      importance: "Critical",
      information: ["Asset distribution instructions", "Guardian appointments for minor children", "Executor designation", "Witness signatures and notarization"],
      tips: "Update your will after major life events like marriage, divorce, births, or significant asset changes"
    },
    {
      category: "Living Trusts",
      description: "Legal entity that holds assets during your lifetime and after",
      importance: "High", 
      information: ["Revocable living trust documents", "Trust funding documentation", "Successor trustee appointments", "Beneficiary designations"],
      tips: "Living trusts can help avoid probate and provide privacy for your estate planning"
    },
    {
      category: "Testamentary Trusts",
      description: "Trusts created through your will that take effect after death",
      importance: "Medium",
      information: ["Trust provisions in will", "Trustee appointments", "Beneficiary terms and conditions", "Distribution schedules"],
      tips: "Useful for managing assets for minor children or beneficiaries with special needs"
    },
    {
      category: "Trust Administration", 
      description: "Ongoing management and operation of existing trusts",
      importance: "High",
      information: ["Trust tax returns", "Distribution records", "Investment statements", "Trustee communications"],
      tips: "Keep detailed records of all trust activities for tax purposes and beneficiary transparency"
    },
    {
      category: "Estate Tax Planning",
      description: "Strategies to minimize estate taxes and maximize inheritance",
      importance: "Medium",
      information: ["Estate tax projections", "Gift tax records", "Generation-skipping transfer planning", "Charitable giving strategies"],
      tips: "Work with estate planning professionals to optimize tax strategies for your specific situation"
    },
    {
      category: "Will & Trust Updates",
      description: "Regular reviews and amendments to estate planning documents",
      importance: "High",
      information: ["Amendment documents", "Codicils to wills", "Trust modifications", "Updated beneficiary information"],
      tips: "Review and update estate planning documents every 3-5 years or after major life changes"
    }
  ];

  const planningSteps = [
    {
      step: 1,
      title: "Inventory Your Assets",
      description: "Create comprehensive list of all assets, debts, and property you own",
      timeframe: "Week 1"
    },
    {
      step: 2, 
      title: "Determine Your Goals",
      description: "Decide how you want assets distributed and who should manage your affairs",
      timeframe: "Week 1"
    },
    {
      step: 3,
      title: "Choose Executors & Trustees",
      description: "Select trusted individuals to manage your will and any trusts", 
      timeframe: "Week 2"
    },
    {
      step: 4,
      title: "Draft Legal Documents",
      description: "Work with attorney to create will, trusts, and related documents",
      timeframe: "Month 1-2"
    },
    {
      step: 5,
      title: "Execute & Fund Documents",
      description: "Sign documents properly and transfer assets into trusts if applicable",
      timeframe: "Month 2"
    }
  ];

  const estatePlanningTips = [
    {
      category: "Legal Requirements",
      icon: Scale,
      tip: "Ensure all documents meet state legal requirements",
      details: "Each state has specific requirements for valid wills and trusts. Work with local attorneys familiar with your state's laws."
    },
    {
      category: "Regular Updates", 
      icon: Calendar,
      tip: "Review and update documents regularly",
      details: "Life changes like marriage, divorce, births, deaths, or major asset changes require document updates."
    },
    {
      category: "Professional Guidance",
      icon: Users,
      tip: "Work with qualified estate planning professionals",
      details: "Complex estates benefit from attorneys, CPAs, and financial planners working together."
    }
  ];

  const willComponents = [
    {
      component: "Asset Distribution",
      details: ["Specific bequests to individuals", "Residual estate distribution", "Alternate beneficiaries", "Charitable donations"]
    },
    {
      component: "Executor Appointment",
      details: ["Primary executor selection", "Alternate executor designation", "Powers and duties granted", "Compensation provisions"]
    },
    {
      component: "Guardian Designations",
      details: ["Guardians for minor children", "Property guardians if needed", "Alternate guardian selections", "Special instructions for care"]
    },
    {
      component: "Trust Provisions",
      details: ["Testamentary trust creation", "Trust terms and conditions", "Trustee appointments", "Distribution guidelines"]
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
              <FileText className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Wills & Trusts
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize and manage your wills, trusts, and beneficiary information in one secure place. 
              Ensure your estate planning documents are accessible when your family needs them most.
            </p>
          </div>
        </div>
      </section>

      {/* Wills & Trusts Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Wills & Trusts Documentation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {willsCategories.map((category, index) => (
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
                    {category.information.map((info, infoIndex) => (
                      <li key={infoIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {info}
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

      {/* Estate Planning Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Estate Planning Process
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

      {/* Estate Planning Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
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

      {/* Will Components Checklist */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Will Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {willComponents.map((component, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{component.component}</h3>
                <ul className="space-y-2">
                  {component.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-[#A5A5A5]">
                      <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <Scale className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium mb-2">Legal Requirement</p>
            <p className="text-[#A5A5A5]">
              Wills must be properly executed according to state law, typically requiring signatures of the testator 
              and witnesses, and sometimes notarization. Consult with an estate planning attorney.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your wills and trusts?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your estate planning documents, wills, and trust information secure and organized with FamilyCircle Secure.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-wills-trusts"
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