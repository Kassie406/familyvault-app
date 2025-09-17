import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Users, CheckCircle, Calendar, CreditCard, Shield, ArrowRight, Clock, Heart, AlertCircle, FileText, UserCheck, Building } from "lucide-react";

export default function EstateBeneficiaryInformation() {
  const beneficiaryCategories = [
    {
      category: "Primary Beneficiaries",
      description: "First-line recipients of your assets and benefits",
      importance: "Critical",
      information: ["Spouse and children designations", "Full legal names and relationships", "Social Security numbers", "Percentage allocations"],
      tips: "Always designate primary beneficiaries on all accounts and policies - they receive assets directly without probate"
    },
    {
      category: "Contingent Beneficiaries",
      description: "Backup recipients if primary beneficiaries are unavailable",
      importance: "Critical", 
      information: ["Secondary beneficiary choices", "Alternative distribution plans", "Contingent percentage allocations", "Conditions for inheritance"],
      tips: "Contingent beneficiaries ensure your assets go where you want even if circumstances change"
    },
    {
      category: "Retirement Account Beneficiaries",
      description: "Designated recipients for 401(k), IRA, and pension accounts",
      importance: "High",
      information: ["401(k) and 403(b) designations", "Traditional and Roth IRA beneficiaries", "Pension plan recipients", "Required distribution considerations"],
      tips: "Retirement account beneficiaries override will provisions - keep these designations current"
    },
    {
      category: "Life Insurance Beneficiaries", 
      description: "Recipients of life insurance policy proceeds",
      importance: "High",
      information: ["Term and whole life policy beneficiaries", "Group life insurance designations", "Beneficiary percentage splits", "Per stirpes vs. per capita elections"],
      tips: "Life insurance proceeds go directly to beneficiaries tax-free, bypassing probate entirely"
    },
    {
      category: "Bank Account Beneficiaries",
      description: "Payable-on-death (POD) and transfer-on-death (TOD) designations",
      importance: "Medium",
      information: ["Checking and savings POD designations", "CD and money market beneficiaries", "Investment account TOD designations", "Joint account survivor rights"],
      tips: "POD and TOD designations provide simple asset transfer without probate complications"
    },
    {
      category: "Trust Beneficiaries",
      description: "Recipients and terms for trust distributions",
      importance: "High",
      information: ["Current trust beneficiaries", "Remainder beneficiaries", "Distribution terms and conditions", "Trustee succession plans"],
      tips: "Trust beneficiaries can include multiple generations with specific distribution rules and timing"
    }
  ];

  const organizationSteps = [
    {
      step: 1,
      title: "Inventory All Accounts",
      description: "Create comprehensive list of all accounts, policies, and assets requiring beneficiary designations",
      timeframe: "Week 1"
    },
    {
      step: 2, 
      title: "Review Current Designations",
      description: "Check existing beneficiary information on all accounts and policies",
      timeframe: "Week 1"
    },
    {
      step: 3,
      title: "Update Beneficiary Information",
      description: "Submit beneficiary changes to financial institutions and insurance companies", 
      timeframe: "Week 2"
    },
    {
      step: 4,
      title: "Document All Changes",
      description: "Keep records of all beneficiary designations and confirmation receipts",
      timeframe: "Week 2"
    },
    {
      step: 5,
      title: "Regular Review Schedule",
      description: "Schedule annual reviews and updates after major life events",
      timeframe: "Annually"
    }
  ];

  const beneficiaryTips = [
    {
      category: "Regular Updates",
      icon: Calendar,
      tip: "Update beneficiaries after major life events",
      details: "Marriage, divorce, births, deaths, and other major changes should trigger beneficiary reviews."
    },
    {
      category: "Clear Designations", 
      icon: FileText,
      tip: "Use full legal names and specific relationships",
      details: "Avoid nicknames or unclear designations that could cause confusion or delays."
    },
    {
      category: "Multiple Generations",
      icon: Users,
      tip: "Consider per stirpes designations for fairness",
      details: "Per stirpes ensures that if a beneficiary dies, their children receive that person's share."
    }
  ];

  const beneficiaryAccounts = [
    {
      type: "Retirement Accounts",
      accounts: ["401(k) and 403(b) plans", "Traditional and Roth IRAs", "SEP-IRAs and SIMPLE IRAs", "Pension and annuity plans"],
      considerations: "Required minimum distributions and tax implications vary by beneficiary type"
    },
    {
      type: "Insurance Policies",
      accounts: ["Term life insurance", "Whole life insurance", "Group life insurance", "Disability insurance"],
      considerations: "Proceeds are generally tax-free to beneficiaries and avoid probate"
    },
    {
      type: "Investment Accounts",
      accounts: ["Brokerage accounts (TOD)", "Mutual fund accounts", "Stock certificates", "Savings bonds"],
      considerations: "Transfer-on-death registrations allow direct transfer to beneficiaries"
    },
    {
      type: "Bank Accounts",
      accounts: ["Checking accounts (POD)", "Savings accounts (POD)", "Certificates of deposit", "Money market accounts"],
      considerations: "Payable-on-death designations provide simple, immediate transfer"
    }
  ];

  const commonMistakes = [
    {
      mistake: "Outdated Beneficiaries",
      consequences: ["Ex-spouse receives assets", "Deceased person named", "Children not included"],
      solution: "Review and update beneficiaries regularly, especially after major life changes"
    },
    {
      mistake: "Missing Contingent Beneficiaries",
      consequences: ["Assets go to estate", "Probate complications", "Unintended recipients"],
      solution: "Always name both primary and contingent beneficiaries on every account"
    },
    {
      mistake: "Vague Designations",
      consequences: ["Legal disputes", "Delayed distributions", "Court involvement"],
      solution: "Use full legal names, birth dates, and Social Security numbers when possible"
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
              <Users className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Beneficiary Information
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Keep track of all beneficiary designations across your accounts and policies. 
              Ensure your assets transfer smoothly to your chosen recipients without complications.
            </p>
          </div>
        </div>
      </section>

      {/* Beneficiary Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Types of Beneficiary Designations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beneficiaryCategories.map((category, index) => (
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
                  <h4 className="text-sm font-medium text-white mb-2">Key Information:</h4>
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
            Beneficiary Organization Process
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

      {/* Beneficiary Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Beneficiary Management Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {beneficiaryTips.map((tip, index) => {
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

      {/* Account Types */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Common Account Types Requiring Beneficiaries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {beneficiaryAccounts.map((account, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{account.type}</h3>
                <ul className="space-y-2 mb-4">
                  {account.accounts.map((acc, accIndex) => (
                    <li key={accIndex} className="flex items-center text-[#A5A5A5]">
                      <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {acc}
                    </li>
                  ))}
                </ul>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">{account.considerations}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Common Beneficiary Mistakes to Avoid
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {commonMistakes.map((mistake, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-red-400 mb-3">{mistake.mistake}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Consequences:</h4>
                  <ul className="space-y-1">
                    {mistake.consequences.map((consequence, consIndex) => (
                      <li key={consIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <AlertCircle className="w-3 h-3 text-red-400 mr-2 flex-shrink-0" />
                        {consequence}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-green-400 text-sm font-medium">{mistake.solution}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <UserCheck className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium mb-2">Pro Tip</p>
            <p className="text-[#A5A5A5]">
              Create an annual beneficiary review reminder. Check all accounts, update any changes, 
              and ensure contact information for beneficiaries is current.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your beneficiary information?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your beneficiary designations and related information secure and organized with FamilyCircle Secure.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-beneficiary-info"
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