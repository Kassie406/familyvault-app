import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { FileText, CheckCircle, Calendar, CreditCard, Shield, ArrowRight, Clock, Users, AlertCircle, DollarSign, Building, TrendingUp } from "lucide-react";

export default function HomeBuyingPreapprovalDocuments() {
  const documentCategories = [
    {
      category: "Income Documentation",
      description: "Proof of income and employment for loan qualification",
      importance: "Critical",
      information: ["Pay stubs (last 2-3 months)", "W-2 forms (last 2 years)", "Tax returns (last 2 years)", "Employment verification letter"],
      tips: "Self-employed buyers may need additional documentation including profit/loss statements and business tax returns"
    },
    {
      category: "Asset Documentation",
      description: "Bank statements and investment account records",
      importance: "Critical", 
      information: ["Bank statements (last 2-3 months)", "Investment account statements", "Retirement account statements", "Gift letter documentation"],
      tips: "Document any large deposits to show they aren't undisclosed loans that would affect your debt-to-income ratio"
    },
    {
      category: "Credit Documentation",
      description: "Credit history and score information",
      importance: "High",
      information: ["Credit reports from all three bureaus", "Credit score documentation", "Explanation letters for credit issues", "Debt verification statements"],
      tips: "Review credit reports for errors and dispute any inaccuracies before applying for pre-approval"
    },
    {
      category: "Debt Information", 
      description: "Current debt obligations and monthly payments",
      importance: "High",
      information: ["Credit card statements", "Auto loan documentation", "Student loan statements", "Other debt obligations"],
      tips: "Paying down high-interest debt before applying can improve your debt-to-income ratio and loan terms"
    },
    {
      category: "Additional Documentation",
      description: "Other documents that may be required",
      importance: "Medium",
      information: ["Divorce decree (if applicable)", "Child support documentation", "Rental income verification", "Social Security award letter"],
      tips: "Requirements vary by lender and loan type - ask your loan officer for a complete checklist"
    },
    {
      category: "Pre-Approval Letters",
      description: "Formal pre-approval documentation from lenders",
      importance: "Critical",
      information: ["Pre-approval letter with loan amount", "Interest rate lock documentation", "Loan program details", "Expiration dates and conditions"],
      tips: "Get pre-approved with multiple lenders to compare terms and have backup options"
    }
  ];

  const preapprovalSteps = [
    {
      step: 1,
      title: "Gather Financial Documents",
      description: "Collect all required income, asset, and debt documentation",
      timeframe: "Week 1"
    },
    {
      step: 2, 
      title: "Check Credit Reports",
      description: "Review credit reports from all three bureaus and address any issues",
      timeframe: "Week 1"
    },
    {
      step: 3,
      title: "Research Lenders",
      description: "Compare loan programs, rates, and requirements from multiple lenders", 
      timeframe: "Week 2"
    },
    {
      step: 4,
      title: "Submit Applications",
      description: "Apply for pre-approval with your chosen lenders",
      timeframe: "Week 2"
    },
    {
      step: 5,
      title: "Review Pre-Approval Terms",
      description: "Compare offers and understand loan terms and conditions",
      timeframe: "Week 3"
    }
  ];

  const preapprovalTips = [
    {
      category: "Document Organization",
      icon: FileText,
      tip: "Organize documents by category for easy access",
      details: "Keep physical and digital copies organized by type. Lenders often request documents multiple times."
    },
    {
      category: "Credit Optimization", 
      icon: TrendingUp,
      tip: "Improve credit score before applying",
      details: "Pay down debt, avoid new credit applications, and dispute any credit report errors."
    },
    {
      category: "Multiple Lenders",
      icon: Building,
      tip: "Apply with multiple lenders for comparison",
      details: "Different lenders offer different terms. Shop around but do it within a short timeframe to minimize credit impact."
    }
  ];

  const lenderTypes = [
    {
      type: "Traditional Banks",
      characteristics: ["Established reputation", "Full-service banking", "Competitive rates for good credit", "Strict underwriting standards"],
      bestFor: "Borrowers with strong credit and stable income"
    },
    {
      type: "Credit Unions",
      characteristics: ["Member-owned institutions", "Often lower rates and fees", "Personal service", "Local community focus"],
      bestFor: "Members looking for personalized service and competitive rates"
    },
    {
      type: "Online Lenders",
      characteristics: ["Fast processing", "Digital-first experience", "Competitive rates", "Limited local presence"],
      bestFor: "Tech-savvy borrowers who prefer online processes"
    },
    {
      type: "Mortgage Brokers",
      characteristics: ["Access to multiple lenders", "Can shop rates for you", "Expert guidance", "May charge broker fees"],
      bestFor: "Borrowers who want professional help finding the best loan"
    }
  ];

  const preapprovalBenefits = [
    {
      benefit: "Competitive Advantage",
      description: "Pre-approval shows sellers you're a serious, qualified buyer",
      impact: "Stronger offer position in competitive markets"
    },
    {
      benefit: "Budget Clarity",
      description: "Know exactly how much home you can afford",
      impact: "Focus your search on realistic price ranges"
    },
    {
      benefit: "Rate Protection",
      description: "Lock in interest rates for a specific period",
      impact: "Protection against rate increases during your search"
    },
    {
      benefit: "Faster Closing",
      description: "Much of the loan process is already completed",
      impact: "Quicker path from offer acceptance to closing"
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
                Pre-Approval Documents
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize all the financial documents needed for mortgage pre-approval. 
              Get qualified and gain a competitive edge in your home buying journey.
            </p>
          </div>
        </div>
      </section>

      {/* Document Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Required Pre-Approval Documentation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {documentCategories.map((category, index) => (
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
                  <h4 className="text-sm font-medium text-white mb-2">Required Documents:</h4>
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

      {/* Pre-Approval Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Pre-Approval Process
          </h2>
          <div className="space-y-8">
            {preapprovalSteps.map((step, index) => (
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

      {/* Pre-Approval Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Pre-Approval Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {preapprovalTips.map((tip, index) => {
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

      {/* Lender Types */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Types of Mortgage Lenders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {lenderTypes.map((lender, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{lender.type}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Characteristics:</h4>
                  <ul className="space-y-1">
                    {lender.characteristics.map((char, charIndex) => (
                      <li key={charIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {char}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">Best For: {lender.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-Approval Benefits */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Benefits of Getting Pre-Approved
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {preapprovalBenefits.map((benefit, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{benefit.benefit}</h3>
                <p className="text-[#A5A5A5] mb-3">{benefit.description}</p>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">{benefit.impact}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <CreditCard className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium mb-2">Important Note</p>
            <p className="text-[#A5A5A5]">
              Pre-approval letters typically expire after 60-90 days. If your home search takes longer, 
              you may need to update your documentation and get re-approved.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your pre-approval documents?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your financial documents and pre-approval paperwork secure and organized with FamilyVault.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-preapproval-docs"
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