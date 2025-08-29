import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Scale, CheckCircle, Calendar, FileText, Shield, ArrowRight, Clock, AlertCircle, Building, Gavel, BookOpen } from "lucide-react";

export default function WhenSomeoneDiesLegalResponsibilities() {
  const legalCategories = [
    {
      category: "Probate Court Procedures",
      description: "Legal proceedings for estate administration",
      importance: "Critical",
      information: ["Filing probate petition", "Obtaining letters testamentary", "Court-required notifications", "Probate court deadlines"],
      tips: "Probate procedures vary significantly by state and must be followed precisely to avoid legal complications"
    },
    {
      category: "Executor and Fiduciary Duties",
      description: "Legal responsibilities of estate representatives",
      importance: "Critical", 
      information: ["Fiduciary duty to beneficiaries", "Asset protection obligations", "Accounting and reporting requirements", "Personal liability for breaches"],
      tips: "Executors have significant legal responsibilities and can be personally liable for improper actions"
    },
    {
      category: "Tax Filing Requirements",
      description: "Federal and state tax obligations",
      importance: "High",
      information: ["Final income tax returns", "Estate tax returns", "Fiduciary tax returns", "Tax payment deadlines"],
      tips: "Tax deadlines are strict and penalties can be severe - consider professional tax assistance"
    },
    {
      category: "Creditor Notice Requirements", 
      description: "Legal notifications to creditors and claim procedures",
      importance: "High",
      information: ["Published creditor notices", "Known creditor notifications", "Claim filing deadlines", "Claim validation procedures"],
      tips: "Proper creditor notice protects the estate from late claims and ensures orderly debt payment"
    },
    {
      category: "Beneficiary Rights and Notifications",
      description: "Legal obligations to estate beneficiaries",
      importance: "Medium",
      information: ["Beneficiary notification requirements", "Rights to estate information", "Distribution procedures", "Dispute resolution processes"],
      tips: "Beneficiaries have legal rights to information and proper treatment throughout estate administration"
    },
    {
      category: "Property and Asset Management",
      description: "Legal responsibilities for managing estate assets",
      importance: "Medium",
      information: ["Asset preservation duties", "Investment responsibilities", "Property maintenance obligations", "Insurance requirements"],
      tips: "Estate assets must be protected and managed prudently until final distribution to beneficiaries"
    }
  ];

  const responsibilitySteps = [
    {
      step: 1,
      title: "Understand Your Legal Authority",
      description: "Determine your legal standing and authority to act on behalf of the estate",
      timeframe: "Immediately"
    },
    {
      step: 2, 
      title: "File Required Court Documents",
      description: "Submit probate petition and other required legal documents with the court",
      timeframe: "Within 30-120 days (varies by state)"
    },
    {
      step: 3,
      title: "Provide Legal Notifications",
      description: "Give required notice to beneficiaries, creditors, and government agencies", 
      timeframe: "As specified by state law"
    },
    {
      step: 4,
      title: "Manage Legal Compliance",
      description: "Ensure ongoing compliance with all legal requirements and deadlines",
      timeframe: "Throughout administration"
    },
    {
      step: 5,
      title: "Complete Legal Closure",
      description: "File final documents and obtain court approval to close the estate",
      timeframe: "After all obligations are satisfied"
    }
  ];

  const legalTips = [
    {
      category: "Professional Guidance",
      icon: Building,
      tip: "Work with qualified estate attorneys for complex legal matters",
      details: "Estate law is complex and varies by state. Professional legal guidance helps avoid costly mistakes and ensures proper compliance."
    },
    {
      category: "Documentation", 
      icon: FileText,
      tip: "Maintain meticulous records of all legal actions and communications",
      details: "Detailed documentation protects you from liability and provides necessary records for court filings and beneficiary communications."
    },
    {
      category: "Deadline Management",
      icon: Clock,
      tip: "Track all legal deadlines carefully and file documents well before due dates",
      details: "Missing legal deadlines can result in penalties, loss of rights, and personal liability for executors and administrators."
    }
  ];

  const probateProcess = [
    {
      stage: "Probate Initiation",
      description: "Beginning formal probate proceedings",
      requirements: ["Death certificate", "Original will (if any)", "Probate petition", "Filing fees"],
      timeline: "File within state deadline (usually 30-120 days)",
      courtActions: "Court reviews petition and schedules hearing if necessary"
    },
    {
      stage: "Executor Appointment",
      description: "Court appointment of personal representative",
      requirements: ["Executor qualification", "Oath of office", "Bond (if required)", "Letters testamentary"],
      timeline: "Usually 2-4 weeks after petition filing",
      courtActions: "Court issues letters testamentary authorizing executor to act"
    },
    {
      stage: "Asset Inventory and Appraisal",
      description: "Comprehensive listing and valuation of estate assets",
      requirements: ["Complete asset inventory", "Professional appraisals", "Asset valuations", "Court filing"],
      timeline: "Typically 90-180 days after appointment",
      courtActions: "Court reviews and approves inventory and valuations"
    },
    {
      stage: "Creditor Claims Period",
      description: "Period for creditors to file claims against the estate",
      requirements: ["Published notice to creditors", "Notice to known creditors", "Claims review and payment", "Disputed claim resolution"],
      timeline: "Usually 3-6 months from first publication",
      courtActions: "Court may need to resolve disputed claims"
    },
    {
      stage: "Final Accounting and Distribution",
      description: "Settlement of all obligations and distribution to beneficiaries",
      requirements: ["Final accounting", "Beneficiary receipts", "Tax clearances", "Petition for final distribution"],
      timeline: "After all claims are resolved",
      courtActions: "Court approves final accounting and authorizes distributions"
    },
    {
      stage: "Estate Closure",
      description: "Formal closure of probate proceedings",
      requirements: ["Final report", "Discharge of executor", "Closing documents", "Asset transfer completion"],
      timeline: "After final distributions are completed",
      courtActions: "Court closes estate and discharges executor"
    }
  ];

  const fiduciaryDuties = [
    {
      duty: "Loyalty",
      description: "Acting solely in the best interests of the estate and beneficiaries",
      requirements: ["Avoid conflicts of interest", "Don't benefit personally from estate transactions", "Disclose any potential conflicts", "Act impartially among beneficiaries"],
      violations: "Self-dealing, preferential treatment, undisclosed conflicts",
      consequences: "Personal liability, removal, disgorgement of profits"
    },
    {
      duty: "Care and Prudence",
      description: "Managing estate assets with reasonable skill and caution",
      requirements: ["Protect and preserve assets", "Make prudent investment decisions", "Maintain property and insurance", "Avoid unnecessary risks"],
      violations: "Negligent management, imprudent investments, failure to protect assets",
      consequences: "Liability for losses, surcharge, removal from position"
    },
    {
      duty: "Impartiality",
      description: "Treating all beneficiaries fairly and according to their rights",
      requirements: ["Follow will or state law distribution", "Don't favor certain beneficiaries", "Provide equal access to information", "Make distributions as required"],
      violations: "Preferential treatment, unequal information sharing, improper distributions",
      consequences: "Beneficiary challenges, court intervention, personal liability"
    },
    {
      duty: "Accounting",
      description: "Maintaining accurate records and providing required reports",
      requirements: ["Keep detailed financial records", "File required court accountings", "Provide information to beneficiaries", "Obtain receipts for distributions"],
      violations: "Poor record keeping, failure to account, lack of transparency",
      consequences: "Court orders, increased oversight, potential removal"
    }
  ];

  const taxResponsibilities = [
    {
      taxType: "Final Income Tax Return",
      description: "Last income tax return for the deceased",
      filingRequirement: "Required if income exceeds filing threshold",
      dueDate: "April 15th following year of death (or extended due date)",
      responsibility: "Executor or surviving spouse",
      considerations: "Report income through date of death; consider joint vs. separate filing"
    },
    {
      taxType: "Estate Income Tax Return (Form 1041)",
      description: "Tax return for income earned by the estate",
      filingRequirement: "Required if estate gross income is $600 or more",
      dueDate: "4th month after estate's fiscal year end",
      responsibility: "Executor or administrator",
      considerations: "Estate operates as separate tax entity; may distribute income to beneficiaries"
    },
    {
      taxType: "Federal Estate Tax Return (Form 706)",
      description: "Tax return for large estates",
      filingRequirement: "Required if gross estate exceeds federal exemption ($12.92M in 2023)",
      dueDate: "9 months after death (6-month extension available)",
      responsibility: "Executor",
      considerations: "Complex calculations; professional assistance typically needed"
    },
    {
      taxType: "State Estate or Inheritance Taxes",
      description: "State-level estate or inheritance taxes",
      filingRequirement: "Varies by state; some states have lower exemptions",
      dueDate: "Varies by state",
      responsibility: "Executor",
      considerations: "State laws vary significantly; some states have no estate tax"
    }
  ];

  const creditorNotice = [
    {
      noticeType: "Published Notice to Creditors",
      purpose: "Notify unknown creditors of death and claims process",
      requirements: ["Publish in local newspaper", "Include required legal language", "Specify claims deadline", "Include contact information"],
      timeline: "Usually within 30-60 days of appointment",
      legalEffect: "Starts statute of limitations for creditor claims"
    },
    {
      noticeType: "Direct Notice to Known Creditors",
      purpose: "Notify creditors known to the estate",
      requirements: ["Written notice to each known creditor", "Include claims procedure", "Specify deadline for claims", "Send by certified mail"],
      timeline: "Usually within 30-90 days of appointment",
      legalEffect: "May shorten claims period for notified creditors"
    },
    {
      noticeType: "Notice to Government Agencies",
      purpose: "Notify government agencies of death",
      requirements: ["Social Security Administration", "IRS and state tax agencies", "Medicare and Medicaid", "Veterans Affairs if applicable"],
      timeline: "As soon as possible after death",
      legalEffect: "Stops benefits and establishes death date for agencies"
    },
    {
      noticeType: "Notice to Beneficiaries",
      purpose: "Inform beneficiaries of probate proceedings",
      requirements: ["Formal notice of probate filing", "Copy of will (if any)", "Information about rights", "Contact information"],
      timeline: "Usually within 30-60 days of probate filing",
      legalEffect: "Satisfies due process requirements; starts contest period"
    }
  ];

  const commonLegalIssues = [
    {
      issue: "Will Contest or Challenge",
      description: "Legal challenges to the validity of the will",
      causes: ["Lack of testamentary capacity", "Undue influence", "Improper execution", "Fraud or forgery"],
      prevention: ["Proper will execution", "Medical documentation of capacity", "Independent witnesses", "Regular updates"],
      resolution: "Court hearing; may require litigation"
    },
    {
      issue: "Beneficiary Disputes",
      description: "Conflicts between beneficiaries over distributions",
      causes: ["Unclear will language", "Family conflicts", "Disagreements over asset values", "Claims of promises made"],
      prevention: ["Clear will language", "Regular family communication", "Professional appraisals", "Mediation when possible"],
      resolution: "Court intervention; mediation; litigation if necessary"
    },
    {
      issue: "Creditor Claim Disputes",
      description: "Challenges to the validity or amount of creditor claims",
      causes: ["Invalid or fraudulent claims", "Disputed debt amounts", "Statute of limitations issues", "Lack of proper documentation"],
      prevention: ["Thorough debt verification", "Proper creditor notice", "Detailed record keeping", "Legal review of large claims"],
      resolution: "Court hearing on disputed claims"
    },
    {
      issue: "Executor Misconduct",
      description: "Allegations of improper conduct by the executor",
      causes: ["Self-dealing", "Failure to account", "Negligent management", "Conflicts of interest"],
      prevention: ["Follow fiduciary duties", "Maintain detailed records", "Seek court approval when unsure", "Professional guidance"],
      resolution: "Court oversight; potential removal; personal liability"
    }
  ];

  const stateSpecificIssues = [
    {
      issue: "Community Property States",
      description: "Special rules for marital property in community property states",
      states: ["Arizona", "California", "Idaho", "Louisiana", "Nevada", "New Mexico", "Texas", "Washington", "Wisconsin"],
      implications: ["Different property rights", "Spousal inheritance rules", "Community vs. separate property", "Tax considerations"],
      actions: "Understand community property laws; determine character of assets"
    },
    {
      issue: "Small Estate Procedures",
      description: "Simplified probate procedures for small estates",
      availability: "Most states offer simplified procedures",
      implications: ["Lower asset thresholds", "Reduced court oversight", "Faster processing", "Lower costs"],
      actions: "Determine if estate qualifies; follow simplified procedures if available"
    },
    {
      issue: "Homestead and Family Allowance",
      description: "Protected assets and allowances for surviving family",
      availability: "Most states provide some protections",
      implications: ["Assets exempt from creditor claims", "Family support allowances", "Priority over general creditors", "Varies by state"],
      actions: "Understand state protections; claim allowances if appropriate"
    },
    {
      issue: "No-Contest Clauses",
      description: "Will provisions that disinherit contestants",
      enforceability: "Varies by state",
      implications: ["May discourage will contests", "Can be challenged in court", "May not apply to all types of challenges", "Enforcement varies"],
      actions: "Understand state law on no-contest clauses; seek legal advice if contest threatened"
    }
  ];

  const professionalResources = [
    {
      professional: "Estate Attorney",
      whenNeeded: "Complex estates, legal disputes, unfamiliar with probate law",
      services: ["Legal advice", "Court filings", "Dispute resolution", "Compliance guidance"],
      selection: "Look for estate law specialization, local court experience, good references",
      costs: "Hourly rates vary; may be paid from estate assets"
    },
    {
      professional: "Probate Accountant",
      whenNeeded: "Complex tax issues, large estates, business interests",
      services: ["Tax return preparation", "Estate accounting", "Tax planning", "Audit support"],
      selection: "Estate tax experience, professional credentials, local knowledge",
      costs: "Usually hourly; essential for large or complex estates"
    },
    {
      professional: "Financial Advisor",
      whenNeeded: "Investment management, asset valuation, financial planning",
      services: ["Asset management", "Investment advice", "Valuations", "Distribution planning"],
      selection: "Fiduciary standards, estate experience, appropriate credentials",
      costs: "Varies by service; may be percentage of assets managed"
    },
    {
      professional: "Real Estate Professional",
      whenNeeded: "Property sales, valuations, property management",
      services: ["Property appraisals", "Real estate sales", "Property management", "Market analysis"],
      selection: "Local market expertise, estate sale experience, professional certification",
      costs: "Commission-based for sales; hourly or flat fee for other services"
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
              <Scale className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Legal Responsibilities
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Understand and manage all legal responsibilities including probate procedures, fiduciary duties, 
              and compliance requirements during estate administration.
            </p>
          </div>
        </div>
      </section>

      {/* Legal Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Key Legal Responsibility Areas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {legalCategories.map((category, index) => (
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
                  <h4 className="text-sm font-medium text-white mb-2">Key Responsibilities:</h4>
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

      {/* Responsibility Process */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Legal Responsibility Management Process
          </h2>
          <div className="space-y-8">
            {responsibilitySteps.map((step, index) => (
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

      {/* Legal Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Legal Management Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {legalTips.map((tip, index) => {
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

      {/* Probate Process */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Probate Process Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {probateProcess.map((stage, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-[#FFD43B] rounded-full flex items-center justify-center text-[#0E0E0E] font-bold text-sm mr-3">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{stage.stage}</h3>
                </div>
                <p className="text-[#A5A5A5] mb-4 text-sm">{stage.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Requirements:</h4>
                  <ul className="space-y-1 mb-4">
                    {stage.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center text-[#A5A5A5] text-xs">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-2">
                    <p className="text-[#FFD43B] text-xs font-medium">Timeline: {stage.timeline}</p>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-2">
                    <p className="text-blue-400 text-xs">{stage.courtActions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fiduciary Duties */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Fiduciary Duties and Responsibilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fiduciaryDuties.map((duty, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{duty.duty}</h3>
                <p className="text-[#A5A5A5] mb-4">{duty.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Requirements:</h4>
                  <ul className="space-y-1 mb-4">
                    {duty.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm font-medium">Common Violations: {duty.violations}</p>
                  </div>
                  <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                    <p className="text-[#FFD43B] text-sm font-medium">Consequences: {duty.consequences}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tax Responsibilities */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Tax Filing Responsibilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {taxResponsibilities.map((tax, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{tax.taxType}</h3>
                <p className="text-[#A5A5A5] mb-4">{tax.description}</p>
                <div className="grid grid-cols-1 gap-3 mb-4">
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm font-medium">Filing Requirement: {tax.filingRequirement}</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm font-medium">Due Date: {tax.dueDate}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-sm font-medium">Responsibility: {tax.responsibility}</p>
                  </div>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm">{tax.considerations}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creditor Notice Requirements */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Creditor Notice Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {creditorNotice.map((notice, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{notice.noticeType}</h3>
                <p className="text-[#A5A5A5] mb-4">{notice.purpose}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Requirements:</h4>
                  <ul className="space-y-1 mb-4">
                    {notice.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <Gavel className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                    <p className="text-[#FFD43B] text-sm font-medium">Timeline: {notice.timeline}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-sm font-medium">Legal Effect: {notice.legalEffect}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Legal Issues */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Common Legal Issues and Solutions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {commonLegalIssues.map((issue, index) => (
              <div key={index} className="bg-[#121212] border border-red-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-red-400 mb-3">{issue.issue}</h3>
                <p className="text-[#A5A5A5] mb-4">{issue.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Common Causes:</h4>
                  <ul className="space-y-1 mb-4">
                    {issue.causes.map((cause, causeIndex) => (
                      <li key={causeIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <AlertCircle className="w-3 h-3 text-red-400 mr-2 flex-shrink-0" />
                        {cause}
                      </li>
                    ))}
                  </ul>
                  <h4 className="text-sm font-medium text-white mb-2">Prevention Strategies:</h4>
                  <ul className="space-y-1 mb-4">
                    {issue.prevention.map((prev, prevIndex) => (
                      <li key={prevIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                        {prev}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-blue-400 text-sm font-medium">Resolution: {issue.resolution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* State-Specific Issues */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            State-Specific Legal Considerations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stateSpecificIssues.map((issue, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{issue.issue}</h3>
                <p className="text-[#A5A5A5] mb-4">{issue.description}</p>
                {issue.states && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-white mb-2">Applicable States:</h4>
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 mb-4">
                      <p className="text-blue-400 text-sm">{issue.states.join(", ")}</p>
                    </div>
                  </div>
                )}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Key Implications:</h4>
                  <ul className="space-y-1 mb-4">
                    {issue.implications.map((implication, implicationIndex) => (
                      <li key={implicationIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <BookOpen className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {implication}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">Recommended Actions: {issue.actions}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Resources */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Professional Legal Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {professionalResources.map((professional, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{professional.professional}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">When Needed:</h4>
                  <p className="text-[#A5A5A5] text-sm mb-4">{professional.whenNeeded}</p>
                  <h4 className="text-sm font-medium text-white mb-2">Services Provided:</h4>
                  <ul className="space-y-1 mb-4">
                    {professional.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm font-medium">Selection Criteria: {professional.selection}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-sm font-medium">Cost Considerations: {professional.costs}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6 text-center">
            <Gavel className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-medium mb-2">Legal Disclaimer</p>
            <p className="text-[#A5A5A5]">
              This information is for educational purposes only and does not constitute legal advice. 
              Estate law varies significantly by state and individual circumstances. Always consult with 
              a qualified estate attorney for specific legal guidance.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize legal responsibilities?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all legal requirements, deadlines, and documentation organized and manageable with FamilyCircle Secure.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-legal-responsibilities"
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