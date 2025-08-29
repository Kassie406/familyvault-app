import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Phone, CheckCircle, Calendar, Users, Shield, ArrowRight, Clock, Scale, AlertCircle, FileText, UserCheck, Building } from "lucide-react";

export default function EstateProfessionalContacts() {
  const professionalCategories = [
    {
      category: "Estate Planning Attorney",
      description: "Legal counsel specializing in wills, trusts, and estate law",
      importance: "Critical",
      information: ["Wills and trusts expertise", "Estate tax planning knowledge", "Probate and administration experience", "Local court familiarity"],
      tips: "Choose an attorney who specializes in estate planning and is familiar with your state's laws"
    },
    {
      category: "Financial Advisor",
      description: "Professional managing investments and financial planning",
      importance: "High", 
      information: ["Investment management services", "Retirement planning expertise", "Estate planning coordination", "Tax-efficient strategies"],
      tips: "Look for advisors with estate planning experience who can coordinate with your attorney and CPA"
    },
    {
      category: "Certified Public Accountant (CPA)",
      description: "Tax professional handling estate and gift tax matters",
      importance: "High",
      information: ["Estate tax preparation", "Gift tax planning", "Income tax coordination", "Business valuation services"],
      tips: "Choose a CPA with estate and trust tax experience, especially for complex estates"
    },
    {
      category: "Insurance Professionals", 
      description: "Agents and brokers for life and disability insurance needs",
      importance: "Medium",
      information: ["Life insurance planning", "Disability insurance coverage", "Long-term care insurance", "Estate liquidity planning"],
      tips: "Work with professionals who understand how insurance fits into estate planning strategies"
    },
    {
      category: "Trust Officers",
      description: "Bank or trust company professionals managing trust assets",
      importance: "Medium",
      information: ["Trust administration services", "Investment management", "Beneficiary relations", "Tax reporting and compliance"],
      tips: "Essential if you have established trusts that require professional management"
    },
    {
      category: "Business Valuation Experts",
      description: "Specialists in valuing business interests and complex assets",
      importance: "Medium",
      information: ["Business appraisal services", "Complex asset valuation", "Tax-related valuations", "Litigation support services"],
      tips: "Important for estates with business interests or unique assets requiring professional valuation"
    }
  ];

  const organizationSteps = [
    {
      step: 1,
      title: "Identify Your Needs",
      description: "Determine which professionals you need based on your estate complexity",
      timeframe: "Week 1"
    },
    {
      step: 2, 
      title: "Research and Interview",
      description: "Find qualified professionals and interview potential candidates",
      timeframe: "Week 2-3"
    },
    {
      step: 3,
      title: "Check Credentials",
      description: "Verify licenses, certifications, and professional references", 
      timeframe: "Week 3"
    },
    {
      step: 4,
      title: "Establish Relationships",
      description: "Engage professionals and ensure they communicate with each other",
      timeframe: "Week 4"
    },
    {
      step: 5,
      title: "Maintain Contact Information",
      description: "Keep current contact details and regularly review your professional team",
      timeframe: "Ongoing"
    }
  ];

  const selectionTips = [
    {
      category: "Credentials & Experience",
      icon: UserCheck,
      tip: "Verify professional licenses and estate planning experience",
      details: "Look for relevant certifications, years of experience, and specialization in estate planning matters."
    },
    {
      category: "Team Coordination", 
      icon: Users,
      tip: "Choose professionals who work well together",
      details: "Your estate planning team should communicate and coordinate to provide comprehensive service."
    },
    {
      category: "Regular Communication",
      icon: Phone,
      tip: "Establish regular review schedules with your team",
      details: "Regular meetings ensure your estate plan stays current with law changes and life circumstances."
    }
  ];

  const professionalRoles = [
    {
      professional: "Estate Planning Attorney",
      responsibilities: ["Draft wills and trusts", "Provide legal advice", "Handle probate matters", "Update documents as needed"],
      whenNeeded: "Essential for all estate plans, especially complex situations"
    },
    {
      professional: "Financial Advisor",
      responsibilities: ["Manage investments", "Provide retirement planning", "Coordinate with estate plan", "Monitor financial goals"],
      whenNeeded: "Valuable for investment management and financial planning coordination"
    },
    {
      professional: "CPA/Tax Professional",
      responsibilities: ["Prepare tax returns", "Estate tax planning", "Gift tax strategies", "Tax-efficient structures"],
      whenNeeded: "Important for tax planning and estates above exemption thresholds"
    },
    {
      professional: "Insurance Professional",
      responsibilities: ["Analyze insurance needs", "Recommend coverage", "Policy reviews", "Estate liquidity planning"],
      whenNeeded: "Needed when insurance is part of estate planning strategy"
    }
  ];

  const redFlags = [
    {
      warning: "Lacks Proper Credentials",
      signs: ["No relevant licenses", "Unclear qualifications", "Unwillingness to provide references"],
      action: "Verify all credentials through state licensing boards"
    },
    {
      warning: "Poor Communication",
      signs: ["Doesn't return calls promptly", "Uses confusing jargon", "Doesn't explain strategies clearly"],
      action: "Look for professionals who communicate clearly and regularly"
    },
    {
      warning: "Conflicts of Interest",
      signs: ["Pushes specific products", "Has undisclosed financial interests", "Won't coordinate with other professionals"],
      action: "Choose professionals who prioritize your interests above their own"
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
              <Phone className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Professional Contacts
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize contact information for your estate planning professional team. 
              Maintain current details for attorneys, financial advisors, and other key professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Professional Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Estate Planning Professionals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {professionalCategories.map((category, index) => (
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
                  <h4 className="text-sm font-medium text-white mb-2">Key Services:</h4>
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

      {/* Organization Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Building Your Professional Team
          </h2>
          <div className="space-y-8">
            {organizationSteps.map((step, index) => (
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

      {/* Selection Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Professional Selection Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {selectionTips.map((tip, index) => {
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

      {/* Professional Roles */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Professional Roles and Responsibilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {professionalRoles.map((role, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{role.professional}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Key Responsibilities:</h4>
                  <ul className="space-y-1">
                    {role.responsibilities.map((responsibility, respIndex) => (
                      <li key={respIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">{role.whenNeeded}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Red Flags to Avoid */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Red Flags When Selecting Professionals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {redFlags.map((flag, index) => (
              <div key={index} className="bg-[#121212] border border-red-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-red-400 mb-3">{flag.warning}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Warning Signs:</h4>
                  <ul className="space-y-1">
                    {flag.signs.map((sign, signIndex) => (
                      <li key={signIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <AlertCircle className="w-3 h-3 text-red-400 mr-2 flex-shrink-0" />
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-green-400 text-sm font-medium">{flag.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Organization Template */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Professional Contact Information Template
          </h2>
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">For Each Professional, Include:</h3>
                <ul className="space-y-2 text-[#A5A5A5]">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Full name and title/credentials
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Firm or company name
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Phone, email, and mailing address
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Specialty areas and services provided
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Additional Information:</h3>
                <ul className="space-y-2 text-[#A5A5A5]">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Date relationship established
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Fee structure and billing arrangements
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Emergency contact procedures
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Notes about their role in your estate plan
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your professional contacts?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your estate planning professional contact information secure and organized with FamilyCircle Secure.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-professional-contacts"
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