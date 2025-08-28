import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CreditCard, CheckCircle, Calendar, DollarSign, Shield, ArrowRight, Clock, AlertCircle, TrendingUp, Building, Receipt } from "lucide-react";

export default function WhenSomeoneDiesBillsObligations() {
  const obligationCategories = [
    {
      category: "Essential Bills",
      description: "Utilities and services necessary for property maintenance",
      importance: "Critical",
      information: ["Electric, gas, and water utilities", "Home security and monitoring", "Property insurance premiums", "Internet and phone services"],
      tips: "Keep essential services active to protect property and ensure safety during estate administration"
    },
    {
      category: "Housing Obligations",
      description: "Mortgage payments and housing-related expenses",
      importance: "Critical", 
      information: ["Mortgage or rent payments", "Property taxes", "Homeowner association fees", "Maintenance and repair expenses"],
      tips: "Housing payments are critical to prevent foreclosure or eviction during estate settlement"
    },
    {
      category: "Insurance Premiums",
      description: "Life, health, and property insurance payments",
      importance: "High",
      information: ["Life insurance premiums", "Health insurance payments", "Auto insurance premiums", "Disability insurance payments"],
      tips: "Some insurance policies may lapse immediately upon death, while others need continued payments"
    },
    {
      category: "Credit Card Debts", 
      description: "Credit card balances and minimum payments",
      importance: "High",
      information: ["Credit card statements and balances", "Minimum payment amounts", "Interest rates and fees", "Joint account holders"],
      tips: "Credit card debt generally dies with the person unless there are joint holders or the estate has sufficient assets"
    },
    {
      category: "Loan Obligations",
      description: "Personal loans, auto loans, and other debt payments",
      importance: "Medium",
      information: ["Auto loan payments", "Personal loan balances", "Student loan obligations", "Lines of credit"],
      tips: "Some loans may be discharged upon death while others remain obligations of the estate"
    },
    {
      category: "Subscriptions and Memberships",
      description: "Recurring subscription services and memberships",
      importance: "Medium",
      information: ["Streaming services and media subscriptions", "Gym and club memberships", "Professional associations", "Magazine and publication subscriptions"],
      tips: "Cancel unnecessary subscriptions quickly to prevent ongoing charges against estate accounts"
    }
  ];

  const managementSteps = [
    {
      step: 1,
      title: "Identify All Obligations",
      description: "Create comprehensive inventory of all bills, debts, and recurring payments",
      timeframe: "Within 2 weeks"
    },
    {
      step: 2, 
      title: "Prioritize Critical Payments",
      description: "Focus on essential services and secured debts to protect estate assets",
      timeframe: "Immediately"
    },
    {
      step: 3,
      title: "Contact Creditors and Service Providers",
      description: "Notify all creditors of death and discuss payment arrangements", 
      timeframe: "Within 30 days"
    },
    {
      step: 4,
      title: "Manage Ongoing Obligations",
      description: "Continue necessary payments while settling or disputing others",
      timeframe: "Throughout administration"
    },
    {
      step: 5,
      title: "Final Settlement and Closure",
      description: "Pay valid debts from estate assets and close all accounts",
      timeframe: "Before estate closure"
    }
  ];

  const managementTips = [
    {
      category: "Payment Prioritization",
      icon: DollarSign,
      tip: "Focus on secured debts and essential services first",
      details: "Mortgage payments, property taxes, and utilities should take priority to protect estate assets and maintain property value."
    },
    {
      category: "Debt Validation", 
      icon: Shield,
      tip: "Verify all debts and don't pay invalid or disputed claims immediately",
      details: "Require written verification of debts and review all claims carefully before making payments from estate funds."
    },
    {
      category: "Record Keeping",
      icon: Receipt,
      tip: "Maintain detailed records of all payments and communications",
      details: "Document all payments, creditor communications, and debt settlements for estate accounting and legal protection."
    }
  ];

  const debtTypes = [
    {
      type: "Secured Debts",
      description: "Debts backed by collateral such as property or vehicles",
      examples: ["Mortgages", "Auto loans", "Home equity loans", "Secured credit cards"],
      priority: "High",
      treatment: "Generally must be paid to avoid losing collateral",
      considerations: "May transfer with property or need to be paid off"
    },
    {
      type: "Unsecured Debts",
      description: "Debts not backed by specific collateral",
      examples: ["Credit cards", "Personal loans", "Medical bills", "Utility bills"],
      priority: "Medium",
      treatment: "Paid from estate assets if available",
      considerations: "Cannot be collected from heirs if estate lacks funds"
    },
    {
      type: "Joint Debts",
      description: "Debts with co-signers or joint account holders",
      examples: ["Joint credit cards", "Co-signed loans", "Jointly held mortgages", "Shared utility accounts"],
      priority: "High",
      treatment: "Joint holders remain responsible for full debt",
      considerations: "Surviving account holders are liable regardless of estate"
    },
    {
      type: "Government Debts",
      description: "Taxes and government-related obligations",
      examples: ["Income taxes", "Property taxes", "Medicare/Medicaid overpayments", "Student loans (federal)"],
      priority: "High",
      treatment: "Generally must be paid; may have special procedures",
      considerations: "Some government debts may be forgiven upon death"
    }
  ];

  const paymentStrategies = [
    {
      strategy: "Continue Essential Services",
      purpose: "Maintain property and meet immediate needs",
      implementation: ["Keep utilities active", "Pay property insurance", "Maintain security services", "Continue internet/phone if needed"],
      funding: "Use estate funds or family resources temporarily",
      timeline: "Immediate and ongoing"
    },
    {
      strategy: "Negotiate with Creditors",
      purpose: "Arrange manageable payment terms or settlements",
      implementation: ["Contact creditors promptly", "Explain estate situation", "Request payment plans", "Negotiate settlements if appropriate"],
      funding: "Work within estate asset limitations",
      timeline: "Within 30-60 days of death"
    },
    {
      strategy: "Challenge Invalid Debts",
      purpose: "Avoid paying fraudulent or incorrect claims",
      implementation: ["Request debt verification", "Review all documentation", "Dispute incorrect charges", "Seek legal advice if needed"],
      funding: "Protect estate assets from invalid claims",
      timeline: "Before making any payments"
    },
    {
      strategy: "Liquidate Assets for Debt Payment",
      purpose: "Generate funds to pay valid debts from estate assets",
      implementation: ["Sell non-essential property", "Cash in investments", "Use liquid assets first", "Follow probate procedures"],
      funding: "Proceeds from estate asset sales",
      timeline: "After probate approval for asset sales"
    }
  ];

  const billManagementTasks = [
    {
      task: "Utility Services Management",
      description: "Handle electricity, gas, water, and other utility services",
      immediateActions: ["Contact utility companies", "Arrange for continued service", "Update billing information", "Prevent service disconnection"],
      ongoingActions: ["Pay monthly bills", "Monitor usage", "Arrange final readings if property is sold", "Transfer service if appropriate"],
      considerations: "Some utilities may require deposits for continued service"
    },
    {
      task: "Insurance Premium Management",
      description: "Handle various insurance policies and premium payments",
      immediateActions: ["Review all insurance policies", "Determine which need continuation", "Contact insurance companies", "Update beneficiary information"],
      ongoingActions: ["Pay necessary premiums", "File life insurance claims", "Cancel unnecessary policies", "Obtain refunds where appropriate"],
      considerations: "Life insurance proceeds may provide funds for other obligations"
    },
    {
      task: "Credit Account Management",
      description: "Handle credit cards, loans, and lines of credit",
      immediateActions: ["Cancel cards to prevent fraud", "Contact lenders", "Determine outstanding balances", "Identify joint account holders"],
      ongoingActions: ["Make required payments", "Negotiate with creditors", "Close accounts when paid", "Monitor for unauthorized charges"],
      considerations: "Joint account holders remain fully liable for debts"
    },
    {
      task: "Subscription Service Management",
      description: "Handle recurring subscriptions and membership fees",
      immediateActions: ["Identify all subscriptions", "Cancel non-essential services", "Contact service providers", "Prevent automatic renewals"],
      ongoingActions: ["Monitor for charges", "Request refunds for prepaid services", "Transfer beneficial services if possible", "Close all accounts"],
      considerations: "Many subscriptions can be cancelled with death certificate"
    }
  ];

  const creditorCommunication = [
    {
      step: "Initial Death Notification",
      purpose: "Inform creditors of the account holder's death",
      required: ["Death certificate copy", "Account information", "Your relationship to deceased", "Contact information"],
      expectedResponse: "Account freeze and information about next steps",
      timeline: "Within 30 days of death"
    },
    {
      step: "Estate Information Provision",
      purpose: "Provide details about estate administration",
      required: ["Probate court information", "Executor appointment documentation", "Estate attorney contact", "Timeline expectations"],
      expectedResponse: "Information about claims process and deadlines",
      timeline: "After executor appointment"
    },
    {
      step: "Debt Verification Request",
      purpose: "Confirm the validity and amount of debts claimed",
      required: ["Written request for verification", "Account statements and documentation", "Interest and fee calculations", "Legal basis for debt"],
      expectedResponse: "Detailed debt verification and supporting documents",
      timeline: "Before making any payments"
    },
    {
      step: "Payment Arrangement Negotiation",
      purpose: "Establish payment terms that work within estate constraints",
      required: ["Estate asset information", "Payment capacity assessment", "Settlement offer if appropriate", "Agreement documentation"],
      expectedResponse: "Modified payment terms or settlement acceptance",
      timeline: "After debt verification"
    }
  ];

  const legalConsiderations = [
    {
      consideration: "Statute of Limitations",
      description: "Time limits for creditors to file claims against the estate",
      implications: ["Claims filed after deadline may be invalid", "Varies by state (typically 3-6 months)", "Affects estate closing timeline", "May protect estate assets"],
      actions: "Understand deadlines and ensure proper notice to creditors"
    },
    {
      consideration: "Executor Liability",
      description: "Personal responsibility of executor for improper debt payments",
      implications: ["May be personally liable for improper payments", "Must follow proper procedures", "Should obtain court approval when unsure", "Can be sued by beneficiaries"],
      actions: "Follow legal procedures and seek professional advice when needed"
    },
    {
      consideration: "Asset Protection",
      description: "Protecting estate assets from invalid or excessive claims",
      implications: ["Some assets may be exempt from creditor claims", "Family allowances may take priority", "Homestead exemptions may apply", "Life insurance may be protected"],
      actions: "Understand asset protection laws and exemptions in your state"
    },
    {
      consideration: "Priority of Claims",
      description: "Legal order for paying debts when estate assets are limited",
      implications: ["Administrative expenses come first", "Secured debts have priority over unsecured", "Some claims may go unpaid", "Beneficiaries may receive less"],
      actions: "Follow legal priority order to avoid personal liability"
    }
  ];

  const commonMistakes = [
    {
      mistake: "Paying Debts Too Quickly",
      consequence: "May pay invalid debts or deplete estate assets unnecessarily",
      solution: "Always verify debts and understand estate's obligation before paying",
      prevention: "Require written verification and seek legal advice for large debts"
    },
    {
      mistake: "Using Personal Funds for Estate Debts",
      consequence: "Personal liability for debts that aren't legally required",
      solution: "Only pay estate debts from estate assets unless you're legally obligated",
      prevention: "Understand that heirs are generally not responsible for deceased's debts"
    },
    {
      mistake: "Ignoring Secured Debt Obligations",
      consequence: "Risk of foreclosure or repossession of valuable estate assets",
      solution: "Prioritize secured debts and communicate with secured creditors",
      prevention: "Understand which debts are secured and maintain payments to protect collateral"
    },
    {
      mistake: "Failing to Cancel Recurring Services",
      consequence: "Ongoing charges that drain estate resources unnecessarily",
      solution: "Promptly identify and cancel all unnecessary recurring services",
      prevention: "Maintain comprehensive list of all subscriptions and services"
    }
  ];

  const resourceContacts = [
    {
      resource: "National Association of Consumer Bankruptcy Attorneys",
      purpose: "Legal advice on debt obligations and consumer rights",
      contact: "Website: nacba.org | Phone: 1-800-499-9040",
      services: ["Debt validation assistance", "Consumer protection advice", "Attorney referrals", "Educational resources"],
      whenToUse: "When facing complex debt issues or creditor disputes"
    },
    {
      resource: "Consumer Financial Protection Bureau",
      purpose: "Consumer protection and complaint resolution",
      contact: "Website: consumerfinance.gov | Phone: 1-855-411-2372",
      services: ["Complaint filing", "Educational resources", "Regulatory guidance", "Consumer protection"],
      whenToUse: "When experiencing problems with financial service providers"
    },
    {
      resource: "State Bar Association",
      purpose: "Legal referrals and professional guidance",
      contact: "Contact your state's bar association website",
      services: ["Attorney referrals", "Legal aid information", "Professional standards", "Ethics guidance"],
      whenToUse: "When needing legal representation for complex estate matters"
    },
    {
      resource: "Probate Court",
      purpose: "Legal procedures and estate administration guidance",
      contact: "Local probate or surrogate's court",
      services: ["Filing procedures", "Legal requirements", "Forms and documents", "Deadline information"],
      whenToUse: "For formal probate procedures and legal requirements"
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
              <CreditCard className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Bills & Obligations
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Manage and track all financial obligations including bills, debts, and recurring payments 
              during estate administration. Ensure proper handling of all financial responsibilities.
            </p>
          </div>
        </div>
      </section>

      {/* Obligation Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Financial Obligation Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {obligationCategories.map((category, index) => (
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
                  <h4 className="text-sm font-medium text-white mb-2">Common Obligations:</h4>
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
            Bills and Obligations Management Process
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
            Bills and Obligations Management Best Practices
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

      {/* Debt Types and Treatment */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Types of Debts and Their Treatment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {debtTypes.map((debt, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{debt.type}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    debt.priority === 'High' 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/20'
                  }`}>
                    {debt.priority} Priority
                  </span>
                </div>
                <p className="text-[#A5A5A5] mb-4">{debt.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Examples:</h4>
                  <ul className="space-y-1 mb-4">
                    {debt.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <span className="text-[#FFD43B] mr-2">•</span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-sm font-medium">Treatment: {debt.treatment}</p>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm">{debt.considerations}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Strategies */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Payment Strategies for Different Situations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {paymentStrategies.map((strategy, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{strategy.strategy}</h3>
                <p className="text-[#A5A5A5] mb-4">{strategy.purpose}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Implementation:</h4>
                  <ul className="space-y-1 mb-4">
                    {strategy.implementation.map((impl, implIndex) => (
                      <li key={implIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {impl}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                    <p className="text-[#FFD43B] text-sm font-medium">Funding: {strategy.funding}</p>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm font-medium">Timeline: {strategy.timeline}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bill Management Tasks */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Specific Bill Management Tasks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {billManagementTasks.map((task, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{task.task}</h3>
                <p className="text-[#A5A5A5] mb-4">{task.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Immediate Actions:</h4>
                  <ul className="space-y-1 mb-4">
                    {task.immediateActions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <AlertCircle className="w-3 h-3 text-red-400 mr-2 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                  <h4 className="text-sm font-medium text-white mb-2">Ongoing Actions:</h4>
                  <ul className="space-y-1 mb-4">
                    {task.ongoingActions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-blue-400 text-sm">{task.considerations}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creditor Communication */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Creditor Communication Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {creditorCommunication.map((comm, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{comm.step}</h3>
                <p className="text-[#A5A5A5] mb-4">{comm.purpose}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Required Information:</h4>
                  <ul className="space-y-1 mb-4">
                    {comm.required.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-sm font-medium">Expected Response: {comm.expectedResponse}</p>
                  </div>
                  <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                    <p className="text-[#FFD43B] text-sm font-medium">Timeline: {comm.timeline}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Considerations */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Legal Considerations for Debt Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {legalConsiderations.map((consideration, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{consideration.consideration}</h3>
                <p className="text-[#A5A5A5] mb-4">{consideration.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Legal Implications:</h4>
                  <ul className="space-y-1 mb-4">
                    {consideration.implications.map((implication, implicationIndex) => (
                      <li key={implicationIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <TrendingUp className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {implication}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-blue-400 text-sm font-medium">Recommended Actions: {consideration.actions}</p>
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
            Common Bill and Debt Management Mistakes
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
        </div>
      </section>

      {/* Resource Contacts */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Helpful Resources and Contacts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resourceContacts.map((resource, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{resource.resource}</h3>
                <p className="text-[#A5A5A5] mb-3">{resource.purpose}</p>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3 mb-4">
                  <p className="text-[#FFD43B] text-sm font-medium">{resource.contact}</p>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Services:</h4>
                  <ul className="space-y-1 mb-4">
                    {resource.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-blue-400 text-sm font-medium">When to Use: {resource.whenToUse}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6 text-center">
            <Building className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-medium mb-2">Important Legal Reminder</p>
            <p className="text-[#A5A5A5]">
              Estate debt management involves complex legal issues that vary by state. Consider consulting 
              with an estate attorney or probate lawyer to ensure proper handling of all financial obligations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize bills and obligations?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all financial obligations, bills, and debt information organized and manageable with FamilyVault.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-bills-obligations"
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