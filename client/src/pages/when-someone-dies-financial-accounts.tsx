import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { DollarSign, CheckCircle, Calendar, CreditCard, Shield, ArrowRight, Clock, Users, AlertCircle, TrendingUp, Building, Phone } from "lucide-react";

export default function WhenSomeoneDiesFinancialAccounts() {
  const accountCategories = [
    {
      category: "Bank Accounts",
      description: "Checking, savings, and money market accounts",
      importance: "Critical",
      information: ["Account numbers and statements", "Online banking credentials", "Automatic deposits and withdrawals", "Joint account holders and beneficiaries"],
      tips: "Contact banks immediately to freeze sole accounts and update joint accounts"
    },
    {
      category: "Investment Accounts",
      description: "Brokerage, mutual fund, and investment accounts",
      importance: "Critical", 
      information: ["Brokerage statements", "Investment portfolios", "Beneficiary designations", "Financial advisor contacts"],
      tips: "Investment accounts may transfer directly to beneficiaries, bypassing probate"
    },
    {
      category: "Retirement Accounts",
      description: "401(k), IRA, pension, and retirement benefit accounts",
      importance: "High",
      information: ["Account statements", "Beneficiary forms", "Employer contacts", "Distribution elections"],
      tips: "Retirement accounts have special tax implications and required distribution rules"
    },
    {
      category: "Insurance Policies", 
      description: "Life insurance, annuities, and insurance-related accounts",
      importance: "High",
      information: ["Policy numbers and documents", "Beneficiary designations", "Premium payment records", "Insurance company contacts"],
      tips: "Life insurance proceeds are generally not taxable income to beneficiaries"
    },
    {
      category: "Credit Cards and Loans",
      description: "Credit card accounts, personal loans, and lines of credit",
      importance: "Medium",
      information: ["Account statements", "Outstanding balances", "Payment schedules", "Co-signers or joint holders"],
      tips: "Credit card debt typically dies with the person unless there are joint holders or co-signers"
    },
    {
      category: "Digital and Cryptocurrency",
      description: "Digital wallets, cryptocurrency, and online financial accounts",
      importance: "Medium",
      information: ["Wallet addresses and private keys", "Exchange account information", "Digital asset inventories", "Access credentials"],
      tips: "Cryptocurrency can be permanently lost without proper key management and documentation"
    }
  ];

  const managementSteps = [
    {
      step: 1,
      title: "Immediate Account Security",
      description: "Secure accounts and prevent unauthorized access or transactions",
      timeframe: "Within 24-48 hours"
    },
    {
      step: 2, 
      title: "Inventory All Financial Accounts",
      description: "Create comprehensive list of all accounts, balances, and beneficiaries",
      timeframe: "Within 2 weeks"
    },
    {
      step: 3,
      title: "Notify Financial Institutions",
      description: "Contact all banks, investment firms, and financial service providers", 
      timeframe: "Within 30 days"
    },
    {
      step: 4,
      title: "Process Beneficiary Claims",
      description: "Submit required documentation for accounts with named beneficiaries",
      timeframe: "Within 60 days"
    },
    {
      step: 5,
      title: "Manage Estate Accounts",
      description: "Handle probate accounts and ongoing financial obligations",
      timeframe: "Throughout estate administration"
    }
  ];

  const managementTips = [
    {
      category: "Account Access",
      icon: Shield,
      tip: "Secure immediate access to essential accounts while protecting assets",
      details: "Work with financial institutions to freeze sole accounts and maintain access to joint accounts for ongoing expenses."
    },
    {
      category: "Beneficiary Processing", 
      icon: Users,
      tip: "Process beneficiary designations quickly to avoid delays and complications",
      details: "Accounts with proper beneficiary designations transfer outside of probate and can provide immediate funds to beneficiaries."
    },
    {
      category: "Documentation",
      icon: CreditCard,
      tip: "Maintain detailed records of all account activities and communications",
      details: "Keep records of all transactions, communications with institutions, and beneficiary distributions for estate accounting."
    }
  ];

  const institutionContacts = [
    {
      institution: "Major Banks",
      contactMethod: "Estate services departments",
      documentation: ["Death certificate", "Letters testamentary", "Account information", "Beneficiary identification"],
      timeline: "Contact within 1-2 weeks",
      specialConsiderations: "May freeze accounts immediately upon notification of death"
    },
    {
      institution: "Investment Firms",
      contactMethod: "Client services and estate departments",
      documentation: ["Death certificate", "Beneficiary forms", "Account statements", "Transfer authorizations"],
      timeline: "Contact within 2 weeks",
      specialConsiderations: "May require additional documentation for account transfers"
    },
    {
      institution: "Retirement Plan Administrators",
      contactMethod: "Plan administrator or HR department",
      documentation: ["Death certificate", "Beneficiary claims", "Distribution election forms", "Spousal waivers if applicable"],
      timeline: "Contact within 30 days",
      specialConsiderations: "Required minimum distributions may continue for beneficiaries"
    },
    {
      institution: "Insurance Companies",
      contactMethod: "Claims departments",
      documentation: ["Death certificate", "Policy documents", "Beneficiary identification", "Claim forms"],
      timeline: "Contact within 30-60 days",
      specialConsiderations: "Life insurance claims typically processed quickly once documentation is complete"
    }
  ];

  const accountTypes = [
    {
      type: "Joint Accounts with Right of Survivorship",
      ownership: "Automatically transfers to surviving account holder",
      probate: "Avoids probate",
      requirements: ["Death certificate to remove deceased's name", "Updated account documentation"],
      considerations: "Surviving owner has immediate access to funds"
    },
    {
      type: "Accounts with Payable-on-Death (POD) Beneficiaries",
      ownership: "Transfers directly to named beneficiaries",
      probate: "Avoids probate",
      requirements: ["Death certificate", "Beneficiary identification", "Account closure or transfer forms"],
      considerations: "Multiple beneficiaries may need to coordinate account management"
    },
    {
      type: "Sole Owner Accounts (No Beneficiaries)",
      ownership: "Becomes part of probate estate",
      probate: "Goes through probate",
      requirements: ["Court appointment as executor", "Letters testamentary", "Probate court authorization"],
      considerations: "May be frozen until executor is appointed by court"
    },
    {
      type: "Trust Accounts",
      ownership: "Managed according to trust terms",
      probate: "Avoids probate",
      requirements: ["Trust document", "Death certificate", "Successor trustee documentation"],
      considerations: "Successor trustee assumes management responsibilities"
    }
  ];

  const financialObligations = [
    {
      obligation: "Ongoing Bill Payments",
      description: "Utilities, mortgage, insurance, and other recurring payments",
      action: ["Identify automatic payments", "Ensure continued payment for estate expenses", "Cancel unnecessary services", "Update payment methods"],
      priority: "High - prevent service interruptions"
    },
    {
      obligation: "Credit Card Debts",
      description: "Outstanding credit card balances and ongoing charges",
      action: ["Notify credit card companies", "Cancel cards to prevent fraud", "Review charges for disputes", "Determine estate liability"],
      priority: "Medium - prevent additional charges and fraud"
    },
    {
      obligation: "Loan Payments",
      description: "Mortgage, auto loans, personal loans, and lines of credit",
      action: ["Contact loan servicers", "Review loan terms and insurance", "Determine continuation or payoff options", "Update contact information"],
      priority: "High - protect collateral and credit"
    },
    {
      obligation: "Investment Management",
      description: "Ongoing management of investment portfolios",
      action: ["Review investment strategies", "Contact financial advisors", "Assess market risks", "Consider distribution timing"],
      priority: "Medium - protect and optimize asset values"
    }
  ];

  const beneficiaryProcess = [
    {
      step: "Notification of Death",
      description: "Contact financial institutions to report the death",
      required: ["Death certificate", "Account information", "Contact information"],
      timeframe: "As soon as possible"
    },
    {
      step: "Beneficiary Identification",
      description: "Provide documentation proving beneficiary status",
      required: ["Beneficiary designation forms", "Government-issued ID", "Social Security numbers", "Tax ID numbers"],
      timeframe: "Within 30 days"
    },
    {
      step: "Claim Processing",
      description: "Submit formal claims for account transfers or distributions",
      required: ["Completed claim forms", "Notarized signatures", "Additional documentation as requested", "Bank account information"],
      timeframe: "Within 60 days"
    },
    {
      step: "Fund Distribution",
      description: "Receive transferred funds or account ownership",
      required: ["Account setup for transfers", "Tax documentation", "Receipt confirmations"],
      timeframe: "30-90 days after claim submission"
    }
  ];

  const taxConsiderations = [
    {
      category: "Income Tax Filing",
      description: "Final tax returns and income reporting requirements",
      considerations: ["File final income tax return", "Report income through date of death", "Consider joint vs. separate filing if married", "Estimate tax liabilities"],
      deadlines: "April 15th following year of death (or extended due date)"
    },
    {
      category: "Estate Tax Planning",
      description: "Federal and state estate tax obligations",
      considerations: ["Calculate gross estate value", "Determine if estate tax return required", "Plan for estate tax payments", "Consider estate tax elections"],
      deadlines: "9 months after death (with possible 6-month extension)"
    },
    {
      category: "Inherited Account Taxation",
      description: "Tax implications for beneficiaries receiving accounts",
      considerations: ["Understand step-up in basis rules", "Plan retirement account distributions", "Consider Roth conversions", "Manage taxable vs. tax-deferred accounts"],
      deadlines: "Various deadlines depending on account type"
    },
    {
      category: "Fiduciary Tax Returns",
      description: "Tax returns for estate and trust accounts",
      considerations: ["File estate income tax returns if required", "Report estate income and deductions", "Distribute income to beneficiaries efficiently", "Coordinate with beneficiary tax planning"],
      deadlines: "March 15th following year (or extended due date)"
    }
  ];

  const commonMistakes = [
    {
      mistake: "Delaying Financial Institution Notifications",
      consequence: "Risk of fraud, unauthorized access, and continued fees",
      solution: "Create prioritized contact list and notify major institutions within 48-72 hours",
      prevention: "Maintain current list of all financial institutions and account information"
    },
    {
      mistake: "Ignoring Automatic Payments and Deposits",
      consequence: "Service interruptions, late fees, and returned deposit complications",
      solution: "Review all automatic transactions and update or cancel as appropriate",
      prevention: "Maintain comprehensive list of all automatic payments and deposits"
    },
    {
      mistake: "Assuming All Debts Die with the Person",
      consequence: "Missed obligations that could affect estate and beneficiaries",
      solution: "Review all debts and obligations to determine estate liability",
      prevention: "Understand which debts survive death and which don't"
    },
    {
      mistake: "Rushing Investment and Retirement Account Decisions",
      consequence: "Unnecessary taxes, penalties, and lost benefits",
      solution: "Consult with financial advisors before making major account decisions",
      prevention: "Understand beneficiary options and tax implications before acting"
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
              <DollarSign className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Financial Accounts
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Manage and organize all financial accounts including bank accounts, investments, retirement funds, 
              and insurance policies during estate administration.
            </p>
          </div>
        </div>
      </section>

      {/* Account Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Financial Account Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accountCategories.map((category, index) => (
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

      {/* Management Process */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Financial Account Management Process
          </h2>
          <div className="space-y-8">
            {managementSteps.map((step, index) => (
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

      {/* Management Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Financial Account Management Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {managementTips.map((tip, index) => {
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

      {/* Institution Contact Guide */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Financial Institution Contact Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {institutionContacts.map((contact, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{contact.institution}</h3>
                <div className="mb-4">
                  <p className="text-[#A5A5A5] mb-3">Contact: {contact.contactMethod}</p>
                  <h4 className="text-sm font-medium text-white mb-2">Required Documentation:</h4>
                  <ul className="space-y-1 mb-4">
                    {contact.documentation.map((doc, docIndex) => (
                      <li key={docIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                    <p className="text-[#FFD43B] text-sm font-medium">Timeline: {contact.timeline}</p>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm">{contact.specialConsiderations}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Account Types and Ownership */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Account Types and Ownership Transfer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {accountTypes.map((account, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{account.type}</h3>
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                      <p className="text-green-400 text-sm font-medium">Ownership: {account.ownership}</p>
                    </div>
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                      <p className="text-blue-400 text-sm font-medium">Probate: {account.probate}</p>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium text-white mb-2">Requirements:</h4>
                  <ul className="space-y-1 mb-4">
                    {account.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm">{account.considerations}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Obligations */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Managing Financial Obligations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {financialObligations.map((obligation, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{obligation.obligation}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    obligation.priority.includes('High') 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/20'
                  }`}>
                    {obligation.priority.split(' - ')[0]}
                  </span>
                </div>
                <p className="text-[#A5A5A5] mb-4">{obligation.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Required Actions:</h4>
                  <ul className="space-y-1">
                    {obligation.action.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">{obligation.priority}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficiary Process */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Beneficiary Claim Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {beneficiaryProcess.map((process, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{process.step}</h3>
                <p className="text-[#A5A5A5] mb-4">{process.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Required Items:</h4>
                  <ul className="space-y-1">
                    {process.required.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">Timeframe: {process.timeframe}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tax Considerations */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Tax Considerations for Financial Accounts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {taxConsiderations.map((tax, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{tax.category}</h3>
                <p className="text-[#A5A5A5] mb-4">{tax.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Key Considerations:</h4>
                  <ul className="space-y-1">
                    {tax.considerations.map((consideration, considerationIndex) => (
                      <li key={considerationIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <TrendingUp className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {consideration}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm font-medium">Deadlines: {tax.deadlines}</p>
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
            Common Financial Account Mistakes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {commonMistakes.map((mistake, index) => (
              <div key={index} className="bg-[#121212] border border-red-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-red-400 mb-3">{mistake.mistake}</h3>
                <p className="text-[#A5A5A5] mb-4">{mistake.consequence}</p>
                <div className="space-y-3">
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-sm font-medium">Solution: {mistake.solution}</p>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm font-medium">Prevention: {mistake.prevention}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <Building className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium mb-2">Professional Guidance Recommended</p>
            <p className="text-[#A5A5A5]">
              Financial account management during estate administration involves complex legal and tax considerations. 
              Consider working with estate attorneys, accountants, and financial advisors for optimal outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize financial accounts?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all bank accounts, investments, and financial information organized and accessible with FamilyCircle Secure.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-financial-accounts"
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