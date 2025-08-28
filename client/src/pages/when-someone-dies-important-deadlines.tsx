import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Calendar, CheckCircle, Clock, AlertTriangle, Shield, ArrowRight, TrendingUp, AlertCircle, FileText, Building } from "lucide-react";

export default function WhenSomeoneDiesImportantDeadlines() {
  const deadlineCategories = [
    {
      category: "Immediate Actions (0-7 days)",
      description: "Critical tasks that must be completed within the first week",
      importance: "Critical",
      information: ["Obtain death certificates", "Contact funeral home", "Notify immediate family", "Secure property and assets"],
      tips: "These deadlines are the most time-sensitive and form the foundation for all subsequent estate administration"
    },
    {
      category: "Early Legal Requirements (1-30 days)",
      description: "Legal filings and notifications required within the first month",
      importance: "Critical", 
      information: ["File probate petition", "Notify beneficiaries", "Contact estate attorney", "Begin creditor notification process"],
      tips: "Missing these deadlines can delay estate administration and create legal complications"
    },
    {
      category: "Financial and Tax Deadlines (30-120 days)",
      description: "Financial institution notifications and initial tax requirements",
      importance: "High",
      information: ["Notify banks and financial institutions", "File for executor appointment", "Begin asset inventory", "Notify Social Security Administration"],
      tips: "These deadlines affect access to funds and government benefits - prompt action prevents complications"
    },
    {
      category: "Ongoing Administrative Deadlines", 
      description: "Continuing obligations throughout estate administration",
      importance: "High",
      information: ["Creditor claim periods", "Asset inventory deadlines", "Accounting requirements", "Distribution deadlines"],
      tips: "These deadlines continue throughout estate administration and vary significantly by state"
    },
    {
      category: "Annual Tax Deadlines",
      description: "Yearly tax filing requirements and deadlines",
      importance: "Medium",
      information: ["Final income tax returns", "Estate tax returns", "Fiduciary income tax returns", "State tax obligations"],
      tips: "Tax deadlines are strict with significant penalties for late filing - consider professional assistance"
    },
    {
      category: "Long-term Closure Deadlines",
      description: "Requirements for final estate closure and distribution",
      importance: "Medium",
      information: ["Final accounting", "Beneficiary distributions", "Estate closure petition", "Asset transfer completion"],
      tips: "Final deadlines vary based on estate complexity but are essential for legal closure"
    }
  ];

  const timelineSteps = [
    {
      step: 1,
      title: "First 24-48 Hours",
      description: "Handle immediate death-related tasks and secure estate",
      timeframe: "0-2 days"
    },
    {
      step: 2, 
      title: "First Week",
      description: "Complete essential notifications and begin legal processes",
      timeframe: "3-7 days"
    },
    {
      step: 3,
      title: "First Month",
      description: "File legal documents and establish estate administration", 
      timeframe: "1-4 weeks"
    },
    {
      step: 4,
      title: "First Quarter",
      description: "Complete major notifications and begin asset management",
      timeframe: "1-3 months"
    },
    {
      step: 5,
      title: "Ongoing Administration",
      description: "Manage continuing obligations and work toward closure",
      timeframe: "3 months to 2+ years"
    }
  ];

  const timelineTips = [
    {
      category: "Deadline Tracking",
      icon: Calendar,
      tip: "Create comprehensive deadline calendar with reminders and buffer time",
      details: "Use calendar systems with alerts to track all deadlines. Build in buffer time for unexpected delays or complications."
    },
    {
      category: "Priority Management", 
      icon: AlertTriangle,
      tip: "Focus on legal and time-sensitive deadlines first",
      details: "Prioritize deadlines that have legal consequences or significant penalties for missing. Handle critical deadlines before administrative ones."
    },
    {
      category: "Professional Coordination",
      icon: Building,
      tip: "Work with professionals to ensure compliance with all deadlines",
      details: "Estate attorneys and accountants can help identify and manage critical deadlines that vary by state and situation."
    }
  ];

  const immediateDeadlines = [
    {
      deadline: "Death Certificate Requests",
      timeframe: "Within 24-72 hours",
      importance: "Critical",
      description: "Order multiple certified copies of death certificate",
      consequences: "Cannot proceed with most estate administration tasks",
      actionSteps: ["Contact funeral home or vital records office", "Order 10-15 certified copies", "Expedite if possible", "Keep originals secure"],
      whoResponsible: "Family member or funeral director"
    },
    {
      deadline: "Property and Asset Security",
      timeframe: "Immediately",
      importance: "Critical",
      description: "Secure home, vehicles, and valuable personal property",
      consequences: "Risk of theft, vandalism, or loss of assets",
      actionSteps: ["Change locks if necessary", "Notify security companies", "Secure vehicles", "Protect valuable items"],
      whoResponsible: "Executor or family members"
    },
    {
      deadline: "Employer Notification",
      timeframe: "Within 1-3 business days",
      importance: "High",
      description: "Notify current employer of death for benefits and final pay",
      consequences: "Delayed benefits processing, continued deductions",
      actionSteps: ["Contact HR department", "Inquire about benefits continuation", "Request final paycheck", "Ask about survivor benefits"],
      whoResponsible: "Spouse or executor"
    },
    {
      deadline: "Social Security Death Report",
      timeframe: "As soon as possible",
      importance: "High",
      description: "Report death to Social Security Administration",
      consequences: "Benefit overpayments that must be returned",
      actionSteps: ["Call 1-800-772-1213", "Report death and stop benefits", "Inquire about survivor benefits", "Return benefit payments received after death"],
      whoResponsible: "Executor or surviving spouse"
    }
  ];

  const legalDeadlines = [
    {
      deadline: "Probate Petition Filing",
      timeframe: "30-120 days (varies by state)",
      importance: "Critical",
      requirements: ["Death certificate", "Original will", "Probate petition", "Filing fees"],
      consequences: "Delayed estate administration, potential challenges to executor authority",
      stateVariation: "Deadline varies significantly by state - some require filing within 30 days, others allow up to 4 months"
    },
    {
      deadline: "Creditor Notice Publication",
      timeframe: "30-90 days after executor appointment",
      importance: "Critical",
      requirements: ["Legal notice in approved newspaper", "Specific language requirements", "Publication period (usually 3-4 weeks)", "Proof of publication"],
      consequences: "Extended creditor claim period, inability to close estate",
      stateVariation: "Notice requirements and timing vary by state"
    },
    {
      deadline: "Beneficiary Notification",
      timeframe: "30-60 days after probate filing",
      importance: "High",
      requirements: ["Written notice to all beneficiaries", "Copy of will (if any)", "Information about probate proceedings", "Contact information"],
      consequences: "Due process violations, potential challenges to probate",
      stateVariation: "Notice timing and content requirements vary by jurisdiction"
    },
    {
      deadline: "Asset Inventory and Appraisal",
      timeframe: "90-180 days after appointment",
      importance: "High",
      requirements: ["Complete asset inventory", "Professional appraisals", "Asset valuations as of death date", "Court filing"],
      consequences: "Court oversight issues, potential executor liability",
      stateVariation: "Deadlines and filing requirements vary, some states require court approval"
    }
  ];

  const financialDeadlines = [
    {
      deadline: "Bank Account Notifications",
      timeframe: "Within 1-2 weeks",
      priority: "High",
      tasks: ["Notify all banks of death", "Freeze sole accounts", "Update joint accounts", "Obtain account statements"],
      considerations: "Some banks may freeze accounts immediately upon notification",
      timeline: "Process varies by institution but generally 1-3 weeks for account changes"
    },
    {
      deadline: "Investment Account Management",
      timeframe: "Within 2-4 weeks",
      priority: "High",
      tasks: ["Contact investment firms", "Review beneficiary designations", "Prevent unauthorized transactions", "Begin transfer processes"],
      considerations: "Investment accounts may have automatic transfers to beneficiaries",
      timeline: "Beneficiary transfers typically take 2-6 weeks after documentation"
    },
    {
      deadline: "Insurance Claim Filing",
      timeframe: "30-60 days for life insurance",
      priority: "Medium",
      tasks: ["Contact insurance companies", "File life insurance claims", "Review policy terms", "Submit required documentation"],
      considerations: "Life insurance claims are generally processed within 30-60 days",
      timeline: "Claims processing typically 2-8 weeks depending on policy and circumstances"
    },
    {
      deadline: "Credit Account Management",
      timeframe: "Within 30 days",
      priority: "Medium",
      tasks: ["Cancel credit cards", "Notify loan servicers", "Review outstanding balances", "Identify joint account holders"],
      considerations: "Joint account holders remain liable for debts",
      timeline: "Account closures typically processed within 1-2 weeks"
    }
  ];

  const taxDeadlines = [
    {
      taxType: "Final Individual Income Tax Return",
      dueDate: "April 15 of year following death",
      filingEntity: "Executor or surviving spouse",
      requirements: ["Income through date of death", "Final Form 1040", "Death certificate copy", "Executor identification"],
      penalties: "Late filing and payment penalties apply",
      extensions: "6-month extension available with Form 4868"
    },
    {
      taxType: "Estate Income Tax Return (Form 1041)",
      dueDate: "15th day of 4th month after fiscal year end",
      filingEntity: "Executor",
      requirements: ["Estate gross income ≥ $600", "Estate tax ID number", "Income and deduction records", "Beneficiary information"],
      penalties: "Penalties for late filing can be substantial",
      extensions: "5.5-month extension available with Form 7004"
    },
    {
      taxType: "Federal Estate Tax Return (Form 706)",
      dueDate: "9 months after death",
      filingEntity: "Executor",
      requirements: ["Gross estate > $12.92M (2023)", "Complete asset inventory", "Valuations as of death date", "All required schedules"],
      penalties: "Significant penalties for late filing",
      extensions: "6-month extension available with Form 4768"
    },
    {
      taxType: "State Estate/Inheritance Tax Returns",
      dueDate: "Varies by state",
      filingEntity: "Executor",
      requirements: ["State-specific forms", "Asset valuations", "Beneficiary information", "State death certificate"],
      penalties: "Varies by state",
      extensions: "State-specific extension rules apply"
    }
  ];

  const ongoingDeadlines = [
    {
      category: "Creditor Claim Period",
      typicalDuration: "3-6 months from first publication",
      description: "Period for creditors to file claims against the estate",
      keyActions: ["Monitor claim filings", "Review and validate claims", "Pay valid claims", "Dispute invalid claims"],
      endResult: "Creditor claim period closes, allowing estate to proceed to closure"
    },
    {
      category: "Asset Management Period",
      typicalDuration: "Throughout estate administration",
      description: "Ongoing responsibility to protect and manage estate assets",
      keyActions: ["Maintain property insurance", "Collect income and dividends", "Make prudent investments", "Pay necessary expenses"],
      endResult: "Assets preserved and potentially grown for beneficiary distribution"
    },
    {
      category: "Accounting and Reporting",
      typicalDuration: "Periodic throughout administration",
      description: "Regular accounting to court and beneficiaries",
      keyActions: ["Maintain detailed financial records", "Prepare periodic accountings", "File required court reports", "Communicate with beneficiaries"],
      endResult: "Transparent administration and court approval for actions taken"
    },
    {
      category: "Distribution Preparation",
      typicalDuration: "After all obligations satisfied",
      description: "Preparing for final distributions to beneficiaries",
      keyActions: ["Resolve all debts and claims", "Obtain tax clearances", "Prepare distribution plan", "Get beneficiary consents"],
      endResult: "Estate ready for final distribution and closure"
    }
  ];

  const deadlineMistakes = [
    {
      mistake: "Relying on Outdated Information",
      consequence: "Missing deadlines due to changed laws or incorrect assumptions",
      solution: "Verify all deadlines with current state law and local court rules",
      prevention: "Consult with local estate attorney for current requirements"
    },
    {
      mistake: "Not Building in Buffer Time",
      consequence: "Missing deadlines due to unexpected delays or complications",
      solution: "Plan to complete tasks well before actual deadlines",
      prevention: "Build 1-2 weeks buffer time into your deadline calendar"
    },
    {
      mistake: "Ignoring State-Specific Variations",
      consequence: "Missing deadlines that vary from general information",
      solution: "Research specific requirements for your state and county",
      prevention: "Work with local professionals who know jurisdiction-specific rules"
    },
    {
      mistake: "Poor Communication with Professionals",
      consequence: "Missed deadlines due to lack of coordination",
      solution: "Establish clear communication protocols with all professionals",
      prevention: "Regular check-ins and shared deadline calendars with your professional team"
    }
  ];

  const deadlineManagementTools = [
    {
      tool: "Digital Calendar Systems",
      benefits: ["Automatic reminders", "Recurring deadline setup", "Shared access for family/professionals", "Mobile accessibility"],
      recommendations: ["Google Calendar", "Outlook", "Apple Calendar", "Specialized estate software"],
      bestPractices: "Set multiple reminders (2 weeks, 1 week, 2 days before each deadline)"
    },
    {
      tool: "Task Management Apps",
      benefits: ["Detailed task breakdowns", "Progress tracking", "Team collaboration", "Document attachment"],
      recommendations: ["Todoist", "Asana", "Trello", "Microsoft Project"],
      bestPractices: "Break complex deadlines into smaller, manageable tasks with their own deadlines"
    },
    {
      tool: "Estate Administration Software",
      benefits: ["Estate-specific features", "Deadline tracking", "Document management", "Professional integration"],
      recommendations: ["EstateExec", "EstateMaster", "Trust & Will", "Professional estate software"],
      bestPractices: "Look for software that integrates with your attorney's or accountant's systems"
    },
    {
      tool: "Professional Management",
      benefits: ["Expert knowledge", "Compliance assurance", "Reduced personal stress", "Professional accountability"],
      recommendations: ["Estate attorneys", "Probate consultants", "Estate administrators", "CPA firms"],
      bestPractices: "Establish clear expectations about deadline management and communication"
    }
  ];

  const emergencyDeadlines = [
    {
      situation: "Estate Tax Return Extension Needed",
      normalDeadline: "9 months after death",
      extensionProcess: "File Form 4768 before original due date",
      additionalTime: "6 months",
      requirements: ["Reasonable estimate of tax owed", "Payment of estimated tax", "Executor signature"],
      urgency: "Must file before original deadline to avoid penalties"
    },
    {
      situation: "Probate Filing Deadline Approaching",
      normalDeadline: "Varies by state (30-120 days)",
      extensionProcess: "Petition court for extension",
      additionalTime: "Varies by court discretion",
      requirements: ["Good cause for delay", "Court petition", "Notice to interested parties"],
      urgency: "File petition before original deadline passes"
    },
    {
      situation: "Creditor Claim Period Extension",
      normalDeadline: "As published in legal notice",
      extensionProcess: "Court petition for extended claim period",
      additionalTime: "Varies by court order",
      requirements: ["Discovery of additional debts", "Court petition", "Notice to creditors and beneficiaries"],
      urgency: "Must petition before original claim period expires"
    },
    {
      situation: "Asset Sale Deadline Pressure",
      normalDeadline: "Before estate closure",
      extensionProcess: "Court approval for sale terms",
      additionalTime: "As needed for proper sale",
      requirements: ["Asset appraisal", "Sale justification", "Court approval of sale terms"],
      urgency: "Plan sales well in advance of closure deadline"
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
              <Calendar className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Important Deadlines
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Track and manage all critical deadlines for estate administration including legal filings, 
              tax returns, and administrative requirements to ensure proper compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Deadline Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Critical Deadline Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deadlineCategories.map((category, index) => (
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
                  <h4 className="text-sm font-medium text-white mb-2">Key Deadlines:</h4>
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

      {/* Timeline Overview */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Estate Administration Timeline
          </h2>
          <div className="space-y-8">
            {timelineSteps.map((step, index) => (
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

      {/* Timeline Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Deadline Management Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {timelineTips.map((tip, index) => {
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

      {/* Immediate Deadlines */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Immediate Critical Deadlines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {immediateDeadlines.map((deadline, index) => (
              <div key={index} className="bg-[#121212] border border-red-500/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{deadline.deadline}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    deadline.importance === 'Critical' 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/20'
                  }`}>
                    {deadline.importance}
                  </span>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 mb-4">
                  <p className="text-red-400 text-sm font-medium">Timeframe: {deadline.timeframe}</p>
                </div>
                <p className="text-[#A5A5A5] mb-4">{deadline.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Action Steps:</h4>
                  <ul className="space-y-1 mb-4">
                    {deadline.actionSteps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                    <p className="text-[#FFD43B] text-sm font-medium">Consequences: {deadline.consequences}</p>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm font-medium">Who's Responsible: {deadline.whoResponsible}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Deadlines */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Legal Filing Deadlines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {legalDeadlines.map((deadline, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{deadline.deadline}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    deadline.importance === 'Critical' 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/20'
                  }`}>
                    {deadline.importance}
                  </span>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3 mb-4">
                  <p className="text-[#FFD43B] text-sm font-medium">Timeframe: {deadline.timeframe}</p>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Requirements:</h4>
                  <ul className="space-y-1 mb-4">
                    {deadline.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <FileText className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm font-medium">Consequences: {deadline.consequences}</p>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm">{deadline.stateVariation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Deadlines */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Financial Institution Deadlines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {financialDeadlines.map((deadline, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{deadline.deadline}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    deadline.priority === 'High' 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/20'
                  }`}>
                    {deadline.priority}
                  </span>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3 mb-4">
                  <p className="text-[#FFD43B] text-sm font-medium">Timeframe: {deadline.timeframe}</p>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Key Tasks:</h4>
                  <ul className="space-y-1 mb-4">
                    {deadline.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm font-medium">Considerations: {deadline.considerations}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-sm font-medium">Typical Timeline: {deadline.timeline}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tax Deadlines */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Tax Filing Deadlines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {taxDeadlines.map((tax, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{tax.taxType}</h3>
                <div className="grid grid-cols-1 gap-3 mb-4">
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm font-medium">Due Date: {tax.dueDate}</p>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm font-medium">Filed By: {tax.filingEntity}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Requirements:</h4>
                  <ul className="space-y-1 mb-4">
                    {tax.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <TrendingUp className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                    <p className="text-[#FFD43B] text-sm font-medium">Penalties: {tax.penalties}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-sm font-medium">Extensions: {tax.extensions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ongoing Deadlines */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Ongoing Administration Deadlines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ongoingDeadlines.map((deadline, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{deadline.category}</h3>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 mb-4">
                  <p className="text-blue-400 text-sm font-medium">Duration: {deadline.typicalDuration}</p>
                </div>
                <p className="text-[#A5A5A5] mb-4">{deadline.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Key Actions:</h4>
                  <ul className="space-y-1 mb-4">
                    {deadline.keyActions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">End Result: {deadline.endResult}</p>
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
            Common Deadline Management Mistakes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {deadlineMistakes.map((mistake, index) => (
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
        </div>
      </section>

      {/* Management Tools */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Deadline Management Tools and Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {deadlineManagementTools.map((tool, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{tool.tool}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Benefits:</h4>
                  <ul className="space-y-1 mb-4">
                    {tool.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <h4 className="text-sm font-medium text-white mb-2">Recommendations:</h4>
                  <ul className="space-y-1 mb-4">
                    {tool.recommendations.map((rec, recIndex) => (
                      <li key={recIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <span className="text-[#FFD43B] mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-blue-400 text-sm font-medium">Best Practices: {tool.bestPractices}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Extensions */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Emergency Deadline Extensions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {emergencyDeadlines.map((emergency, index) => (
              <div key={index} className="bg-[#121212] border border-[#FFD43B]/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{emergency.situation}</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-xs font-medium">Normal: {emergency.normalDeadline}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-xs font-medium">Extension: {emergency.additionalTime}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Extension Requirements:</h4>
                  <ul className="space-y-1 mb-4">
                    {emergency.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <AlertTriangle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                    <p className="text-[#FFD43B] text-sm font-medium">Process: {emergency.extensionProcess}</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm font-medium">Urgency: {emergency.urgency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-medium mb-2">Critical Reminder</p>
            <p className="text-[#A5A5A5]">
              Extension requests must typically be filed before original deadlines expire. Plan ahead and 
              seek professional help if you're approaching any critical deadlines without proper preparation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to manage important deadlines?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep track of all critical deadlines and requirements with FamilyVault's organized deadline management system.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-important-deadlines"
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