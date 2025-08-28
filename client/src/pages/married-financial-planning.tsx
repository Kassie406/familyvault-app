import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CreditCard, CheckCircle, Calendar, DollarSign, Shield, ArrowRight, Clock, Users, AlertCircle, Banknote, PiggyBank, TrendingUp } from "lucide-react";

export default function MarriedFinancialPlanning() {
  const financialCategories = [
    {
      category: "Joint Banking",
      description: "Consolidate and manage shared financial accounts",
      importance: "Critical",
      documents: ["Joint checking account", "Joint savings account", "Account agreements", "Debit/credit cards"],
      tips: "Maintain some individual accounts for personal expenses and financial independence"
    },
    {
      category: "Insurance Planning",
      description: "Update and optimize insurance coverage for married life",
      importance: "High", 
      documents: ["Life insurance policies", "Health insurance (family plan)", "Auto insurance updates", "Homeowners/renters insurance"],
      tips: "Review beneficiaries on all policies and consider increasing life insurance coverage"
    },
    {
      category: "Investment Accounts",
      description: "Align investment strategies and retirement planning",
      importance: "High",
      documents: ["401(k) beneficiary updates", "IRA accounts", "Brokerage accounts", "Investment statements"],
      tips: "Coordinate investment strategies to avoid duplication and optimize tax benefits"
    },
    {
      category: "Tax Planning", 
      description: "Navigate married filing status and tax optimization",
      importance: "Critical",
      documents: ["Previous tax returns", "W-2s and 1099s", "Tax planning documents", "Deduction receipts"],
      tips: "Decide between filing jointly or separately - usually joint filing provides better benefits"
    },
    {
      category: "Debt Management",
      description: "Address combined debt and create payoff strategies",
      importance: "High",
      documents: ["Student loan documents", "Credit card statements", "Mortgage/rent agreements", "Credit reports"],
      tips: "Create a combined debt payoff plan prioritizing highest interest rates first"
    },
    {
      category: "Emergency Fund",
      description: "Build joint emergency savings for married life",
      importance: "Critical",
      documents: ["Emergency fund account", "Budget planning documents", "Monthly expense tracking", "Income statements"],
      tips: "Aim for 6-12 months of combined expenses in your emergency fund"
    }
  ];

  const financialSteps = [
    {
      step: 1,
      title: "Assess Combined Finances",
      description: "Create a complete picture of both partners' financial situation",
      timeframe: "Week 1-2"
    },
    {
      step: 2, 
      title: "Open Joint Accounts",
      description: "Establish joint checking and savings accounts for shared expenses",
      timeframe: "Week 2-3"
    },
    {
      step: 3,
      title: "Update Insurance & Benefits",
      description: "Review and update all insurance policies and employee benefits", 
      timeframe: "Month 1"
    },
    {
      step: 4,
      title: "Create Joint Budget",
      description: "Develop a household budget that works for both partners",
      timeframe: "Month 1-2"
    },
    {
      step: 5,
      title: "Plan for Goals",
      description: "Set shared financial goals like home purchase, retirement, family planning",
      timeframe: "Ongoing"
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
                Financial Planning
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Build a strong financial foundation for your marriage. Organize joint accounts, insurance, 
              investments, and create a unified approach to managing your money together.
            </p>
          </div>
        </div>
      </section>

      {/* Financial Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Financial Areas for Married Couples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {financialCategories.map((category, index) => (
              <div 
                key={index}
                className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6 hover:border-[#FFD43B]/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{category.category}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    category.importance === 'Critical' 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/20'
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

      {/* Financial Planning Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Your Financial Planning Roadmap
          </h2>
          <div className="space-y-8">
            {financialSteps.map((step, index) => (
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

      {/* Financial Tips */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Smart Money Management Tips for Newlyweds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
              <div className="w-12 h-12 bg-[#FFD43B]/10 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-[#FFD43B]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Budget Together</h3>
              <p className="text-[#A5A5A5]">
                Create a monthly budget that includes both individual and joint expenses. Regular budget meetings keep both partners aligned.
              </p>
            </div>
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
              <div className="w-12 h-12 bg-[#FFD43B]/10 rounded-lg flex items-center justify-center mb-4">
                <PiggyBank className="w-6 h-6 text-[#FFD43B]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Save Strategically</h3>
              <p className="text-[#A5A5A5]">
                Maximize employer 401(k) matches, build emergency funds, and save for shared goals like home ownership.
              </p>
            </div>
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
              <div className="w-12 h-12 bg-[#FFD43B]/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-[#FFD43B]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Invest Wisely</h3>
              <p className="text-[#A5A5A5]">
                Coordinate investment strategies to avoid overlap and optimize tax benefits. Consider professional financial advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your financial life?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your financial documents, accounts, and planning materials organized and secure with FamilyVault.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-financial"
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