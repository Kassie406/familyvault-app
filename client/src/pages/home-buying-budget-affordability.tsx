import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { DollarSign, CheckCircle, Calendar, Calculator, Shield, ArrowRight, Clock, Users, AlertCircle, TrendingUp, Home, CreditCard } from "lucide-react";

export default function HomeBuyingBudgetAffordability() {
  const budgetCategories = [
    {
      category: "Income Assessment",
      description: "Calculate your gross and net monthly income",
      importance: "Critical",
      information: ["Gross monthly income", "Net monthly income after taxes", "Bonus and commission income", "Other income sources"],
      tips: "Include only stable, verifiable income that you can document to lenders"
    },
    {
      category: "Debt-to-Income Calculation",
      description: "Determine your current debt obligations",
      importance: "Critical", 
      information: ["Monthly credit card payments", "Auto loan payments", "Student loan payments", "Other recurring debt payments"],
      tips: "Keep total debt-to-income ratio below 43% for most loan programs, ideally below 36%"
    },
    {
      category: "Down Payment Planning",
      description: "Determine how much you can put down",
      importance: "High",
      information: ["Savings available for down payment", "Gift funds from family", "Down payment assistance programs", "Required minimum amounts by loan type"],
      tips: "20% down avoids PMI, but many programs allow as little as 3-5% down for qualified buyers"
    },
    {
      category: "Monthly Housing Costs", 
      description: "Calculate total monthly housing expenses",
      importance: "High",
      information: ["Principal and interest payments", "Property taxes", "Homeowners insurance", "Private mortgage insurance (PMI)"],
      tips: "The 28% rule suggests housing costs should not exceed 28% of gross monthly income"
    },
    {
      category: "Additional Home Buying Costs",
      description: "Budget for one-time and ongoing expenses",
      importance: "Medium",
      information: ["Closing costs (2-5% of home price)", "Moving and relocation expenses", "Home inspection and appraisal fees", "Immediate repairs and improvements"],
      tips: "Budget an extra 1-2% of home price for unexpected costs and immediate needs"
    },
    {
      category: "Emergency Fund Planning",
      description: "Maintain financial stability after purchase",
      importance: "Medium",
      information: ["3-6 months of expenses in savings", "Home maintenance fund", "HOA fees and assessments", "Utility deposits and setup costs"],
      tips: "Don't use all your savings for the down payment - maintain an emergency fund for homeownership"
    }
  ];

  const budgetingSteps = [
    {
      step: 1,
      title: "Calculate Your Income",
      description: "Determine your stable monthly income from all sources",
      timeframe: "Day 1"
    },
    {
      step: 2, 
      title: "List All Debts",
      description: "Calculate monthly payments for all existing debt obligations",
      timeframe: "Day 1"
    },
    {
      step: 3,
      title: "Determine Down Payment",
      description: "Assess available funds for down payment and closing costs", 
      timeframe: "Day 2"
    },
    {
      step: 4,
      title: "Calculate Affordability",
      description: "Use debt-to-income ratios to determine affordable payment range",
      timeframe: "Day 2"
    },
    {
      step: 5,
      title: "Plan for Additional Costs",
      description: "Budget for closing costs, moving, and immediate home expenses",
      timeframe: "Day 3"
    }
  ];

  const affordabilityTips = [
    {
      category: "Income Stability",
      icon: TrendingUp,
      tip: "Focus on stable, documented income",
      details: "Lenders prefer consistent income over variable earnings. Document all income sources thoroughly."
    },
    {
      category: "Debt Management", 
      icon: CreditCard,
      tip: "Pay down high-interest debt first",
      details: "Reducing monthly debt payments improves your debt-to-income ratio and purchasing power."
    },
    {
      category: "Future Planning",
      icon: Home,
      tip: "Consider future financial goals",
      details: "Don't max out your budget - leave room for life changes, family growth, and other goals."
    }
  ];

  const budgetCalculators = [
    {
      type: "28/36 Rule Calculator",
      description: "Traditional affordability calculation",
      details: ["Housing costs ≤ 28% of gross income", "Total debt payments ≤ 36% of gross income", "Conservative approach", "Widely accepted by lenders"],
      example: "Income $6,000/month = $1,680 max housing, $2,160 max total debt"
    },
    {
      type: "Debt-to-Income Calculator",
      description: "Current debt obligation analysis",
      details: ["Calculate current DTI ratio", "Determine available debt capacity", "Plan for new mortgage payment", "Consider all recurring debts"],
      example: "Current debts $800/month on $6,000 income = 13% DTI, room for $1,360 housing"
    },
    {
      type: "Down Payment Calculator",
      description: "Available funds assessment",
      details: ["Savings available for down payment", "Gift funds documentation", "Closing cost estimates", "Reserve fund requirements"],
      example: "$60,000 saved = $50,000 down payment + $10,000 closing/reserves"
    },
    {
      type: "Total Cost Calculator",
      description: "Comprehensive homeownership costs",
      details: ["PITI (Principal, Interest, Taxes, Insurance)", "HOA fees and assessments", "Utilities and maintenance", "One-time moving costs"],
      example: "$1,500 PITI + $200 utilities + $100 maintenance = $1,800/month total"
    }
  ];

  const loanPrograms = [
    {
      program: "Conventional Loans",
      downPayment: "3-20%",
      features: ["Flexible terms", "No income limits", "PMI removable at 20% equity"],
      bestFor: "Buyers with good credit and stable income"
    },
    {
      program: "FHA Loans",
      downPayment: "3.5%",
      features: ["Lower credit requirements", "Flexible debt ratios", "Mortgage insurance required"],
      bestFor: "First-time buyers or those with limited down payment"
    },
    {
      program: "VA Loans",
      downPayment: "0%",
      features: ["No down payment required", "No PMI", "Competitive rates"],
      bestFor: "Eligible veterans and active military"
    },
    {
      program: "USDA Loans",
      downPayment: "0%",
      features: ["No down payment in eligible areas", "Income limits apply", "Rural/suburban focus"],
      bestFor: "Buyers in qualifying rural and suburban areas"
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
                Budget & Affordability
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Calculate how much home you can afford and plan your budget for homeownership. 
              Make informed decisions about down payments, monthly costs, and loan programs.
            </p>
          </div>
        </div>
      </section>

      {/* Budget Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Key Budget Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {budgetCategories.map((category, index) => (
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
                  <h4 className="text-sm font-medium text-white mb-2">Key Factors:</h4>
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

      {/* Budgeting Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Budget Planning Process
          </h2>
          <div className="space-y-8">
            {budgetingSteps.map((step, index) => (
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

      {/* Affordability Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Budget Planning Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {affordabilityTips.map((tip, index) => {
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

      {/* Budget Calculators */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Budget Calculators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {budgetCalculators.map((calculator, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{calculator.type}</h3>
                <p className="text-[#A5A5A5] mb-4">{calculator.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {calculator.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">Example: {calculator.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Programs */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Common Loan Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loanPrograms.map((program, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{program.program}</h3>
                  <span className="bg-[#FFD43B]/10 text-[#FFD43B] px-3 py-1 rounded-full text-sm font-medium">
                    {program.downPayment} Down
                  </span>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {program.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">Best For: {program.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <Calculator className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium mb-2">Budget Planning Tip</p>
            <p className="text-[#A5A5A5]">
              Don't forget to factor in ongoing homeownership costs like maintenance, utilities, HOA fees, 
              and property tax increases when determining your budget.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to plan your home buying budget?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your budget calculations, affordability analysis, and loan comparisons organized with FamilyCircle Secure.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-budget-affordability"
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