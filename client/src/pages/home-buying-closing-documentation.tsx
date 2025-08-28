import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { FileText, CheckCircle, Calendar, Key, Shield, ArrowRight, Clock, Users, AlertCircle, DollarSign, Building, PenTool } from "lucide-react";

export default function HomeBuyingClosingDocumentation() {
  const closingCategories = [
    {
      category: "Purchase Agreement Documents",
      description: "Legal contracts and amendments for the property purchase",
      importance: "Critical",
      information: ["Original purchase contract", "Contract amendments and addenda", "Inspection contingency removals", "Financing contingency documents"],
      tips: "Keep all versions of contracts and amendments - they establish your legal rights and obligations"
    },
    {
      category: "Loan Documentation",
      description: "Mortgage and financing paperwork",
      importance: "Critical", 
      information: ["Loan estimate and closing disclosure", "Mortgage note and deed of trust", "Truth in lending disclosure", "Loan application and approval"],
      tips: "Review loan terms carefully before closing - rates, payments, and terms should match your approval"
    },
    {
      category: "Title and Deed Documents",
      description: "Ownership transfer and title insurance paperwork",
      importance: "Critical",
      information: ["Warranty deed or quitclaim deed", "Title insurance policy", "Title search and commitment", "Property survey documents"],
      tips: "Title insurance protects your ownership rights - keep the policy for as long as you own the property"
    },
    {
      category: "Financial Settlement Statements", 
      description: "Detailed breakdown of all closing costs and payments",
      importance: "High",
      information: ["HUD-1 or Closing Disclosure form", "Wire transfer confirmations", "Cashier's check receipts", "Property tax prorations"],
      tips: "Review settlement statements before closing to ensure all charges are accurate and expected"
    },
    {
      category: "Property Disclosures",
      description: "Seller disclosures and property condition reports",
      importance: "High",
      information: ["Seller's disclosure statement", "Lead paint disclosure", "Natural hazard disclosures", "HOA documents and bylaws"],
      tips: "Property disclosures can be important for future warranty claims or liability issues"
    },
    {
      category: "Closing Logistics",
      description: "Scheduling and coordination of closing activities",
      importance: "Medium",
      information: ["Closing appointment details", "Key and garage remote transfer", "Utility transfer confirmations", "Moving coordination"],
      tips: "Plan closing logistics early - coordinate with movers, utility companies, and other services"
    }
  ];

  const closingSteps = [
    {
      step: 1,
      title: "Final Loan Approval",
      description: "Complete underwriting process and receive final loan approval",
      timeframe: "5-7 days before closing"
    },
    {
      step: 2, 
      title: "Final Walk-Through",
      description: "Inspect property one last time to ensure agreed-upon condition",
      timeframe: "24-48 hours before closing"
    },
    {
      step: 3,
      title: "Review Closing Documents",
      description: "Examine closing disclosure and all settlement documents", 
      timeframe: "3 days before closing"
    },
    {
      step: 4,
      title: "Prepare Funds",
      description: "Arrange certified funds for down payment and closing costs",
      timeframe: "1-2 days before closing"
    },
    {
      step: 5,
      title: "Attend Closing",
      description: "Sign documents, transfer funds, and receive property keys",
      timeframe: "Closing day"
    }
  ];

  const closingTips = [
    {
      category: "Document Review",
      icon: FileText,
      tip: "Review all documents carefully before signing",
      details: "Don't rush through closing documents. Ask questions about anything you don't understand."
    },
    {
      category: "Fund Preparation", 
      icon: DollarSign,
      tip: "Prepare certified funds in advance",
      details: "Wire transfers or cashier's checks are typically required. Personal checks aren't accepted."
    },
    {
      category: "Professional Support",
      icon: Users,
      tip: "Bring your real estate agent and attorney if needed",
      details: "Having professional support during closing can help identify issues and protect your interests."
    }
  ];

  const closingCosts = [
    {
      category: "Loan-Related Costs",
      items: ["Loan origination fee", "Appraisal fee", "Credit report fee", "Underwriting fee"],
      typical: "0.5-1% of loan amount",
      paidBy: "Usually buyer"
    },
    {
      category: "Title and Escrow",
      items: ["Title search and insurance", "Escrow/closing fees", "Recording fees", "Attorney fees"],
      typical: "0.5-2% of purchase price",
      paidBy: "Varies by location"
    },
    {
      category: "Property-Related",
      items: ["Property taxes (prorated)", "Homeowners insurance", "HOA fees (prorated)", "Home warranty"],
      typical: "Varies by property",
      paidBy: "Usually buyer"
    },
    {
      category: "Inspections and Surveys",
      items: ["Home inspection", "Property survey", "Pest inspection", "Specialized inspections"],
      typical: "$500-1,500 total",
      paidBy: "Usually buyer"
    }
  ];

  const closingChecklist = [
    {
      timing: "One Week Before",
      tasks: ["Confirm closing date and location", "Arrange final walk-through", "Secure homeowner's insurance", "Prepare certified funds"]
    },
    {
      timing: "Three Days Before",
      tasks: ["Review closing disclosure", "Compare with loan estimate", "Resolve any discrepancies", "Confirm wire transfer details"]
    },
    {
      timing: "Day of Closing",
      tasks: ["Bring valid photo ID", "Bring certified funds", "Review all documents", "Get keys and garage remotes"]
    },
    {
      timing: "After Closing",
      tasks: ["Record deed (if required)", "Set up utilities in your name", "Change locks for security", "File important documents"]
    }
  ];

  const documentStorage = [
    {
      document: "Deed and Title Insurance",
      importance: "Permanent",
      storage: "Original in safe deposit box or fireproof safe",
      copies: "Copies with attorney and digital backup"
    },
    {
      document: "Mortgage Documents",
      importance: "Duration of loan",
      storage: "Secure file at home",
      copies: "Digital copies in secure cloud storage"
    },
    {
      document: "Closing Disclosure",
      importance: "7 years minimum",
      storage: "With tax records",
      copies: "Digital backup recommended"
    },
    {
      document: "Home Inspection Reports",
      importance: "Duration of ownership",
      storage: "Home file system",
      copies: "Digital copies for warranty claims"
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
              <Key className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Closing Documentation
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize all your closing documents, contracts, and settlement papers. 
              Keep important homeownership documents secure and accessible for the future.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Closing Documentation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {closingCategories.map((category, index) => (
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

      {/* Closing Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Closing Process Timeline
          </h2>
          <div className="space-y-8">
            {closingSteps.map((step, index) => (
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

      {/* Closing Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Closing Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {closingTips.map((tip, index) => {
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

      {/* Closing Costs Breakdown */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Common Closing Costs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {closingCosts.map((cost, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{cost.category}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Typical Items:</h4>
                  <ul className="space-y-1">
                    {cost.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                    <p className="text-[#FFD43B] text-sm font-medium">Typical Cost: {cost.typical}</p>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm font-medium">Paid By: {cost.paidBy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <DollarSign className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium mb-2">Closing Cost Estimate</p>
            <p className="text-[#A5A5A5]">
              Total closing costs typically range from 2-5% of the home's purchase price. 
              Use your Closing Disclosure to verify all charges match your expectations.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Checklist */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Closing Timeline Checklist
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {closingChecklist.map((phase, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{phase.timing}</h3>
                <ul className="space-y-2">
                  {phase.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-center text-[#A5A5A5]">
                      <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Document Storage Guidelines */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Document Storage Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {documentStorage.map((doc, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{doc.document}</h3>
                  <span className="bg-[#FFD43B]/10 text-[#FFD43B] px-3 py-1 rounded-full text-sm font-medium">
                    {doc.importance}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                    <p className="text-[#FFD43B] text-sm font-medium">Storage: {doc.storage}</p>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm font-medium">Copies: {doc.copies}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-green-500/5 border border-green-500/20 rounded-xl p-6 text-center">
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <p className="text-green-400 font-medium mb-2">Document Security</p>
            <p className="text-[#A5A5A5]">
              Store original documents in a secure, fireproof location. Keep digital copies in encrypted, 
              backed-up cloud storage for easy access when needed.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your closing documents?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your closing paperwork, contracts, and settlement documents secure and organized with FamilyVault.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-closing-docs"
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