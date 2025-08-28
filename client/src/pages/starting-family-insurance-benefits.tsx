import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Shield, CheckCircle, Calendar, DollarSign, Heart, ArrowRight, Clock, Users, AlertCircle, FileText, TrendingUp, Award } from "lucide-react";

export default function StartingFamilyInsuranceBenefits() {
  const insuranceCategories = [
    {
      category: "Health Insurance",
      description: "Medical coverage for mother, baby, and family",
      importance: "Critical",
      information: ["Maternity and delivery coverage", "Pediatric care coverage", "Family plan enrollment", "Provider network access"],
      tips: "Add your baby to health insurance immediately after birth - you typically have 30 days to enroll"
    },
    {
      category: "Life Insurance",
      description: "Financial protection for your family's future",
      importance: "Critical", 
      information: ["Increased coverage amounts", "Beneficiary designations", "Term vs. permanent policies", "Employer vs. individual policies"],
      tips: "Dramatically increase life insurance coverage after having children - consider 10-20 times annual income"
    },
    {
      category: "Disability Insurance",
      description: "Income protection if you're unable to work",
      importance: "High",
      information: ["Short-term disability benefits", "Long-term disability coverage", "Employer vs. individual policies", "Benefit amount calculations"],
      tips: "Disability insurance becomes more important with dependents - ensure adequate coverage for family expenses"
    },
    {
      category: "Benefits Enrollment", 
      description: "Employer benefits and family coverage updates",
      importance: "High",
      information: ["Dependent care FSA enrollment", "Health Savings Account (HSA) updates", "Paid family leave benefits", "Childcare benefits"],
      tips: "Take advantage of open enrollment to maximize family benefits and tax-advantaged savings accounts"
    },
    {
      category: "Auto & Property Insurance",
      description: "Asset protection and liability coverage updates",
      importance: "Medium",
      information: ["Auto insurance policy updates", "Homeowner's/renter's insurance", "Umbrella liability coverage", "Personal property coverage"],
      tips: "Review asset protection needs as your family grows and consider umbrella liability coverage"
    },
    {
      category: "Specialty Insurance",
      description: "Additional coverage for specific family needs",
      importance: "Medium",
      information: ["Child life insurance policies", "College savings protection", "Identity theft protection", "Legal expense insurance"],
      tips: "Consider specialty insurance products that address specific risks and needs of growing families"
    }
  ];

  const enrollmentTimeline = [
    {
      step: 1,
      title: "Pre-Birth Planning",
      description: "Review and optimize insurance coverage before baby arrives",
      timeframe: "During pregnancy"
    },
    {
      step: 2, 
      title: "Immediate Post-Birth Actions",
      description: "Add baby to health insurance and notify all relevant insurers",
      timeframe: "Within 30 days of birth"
    },
    {
      step: 3,
      title: "Life Insurance Increase",
      description: "Dramatically increase life insurance coverage for both parents", 
      timeframe: "Within 3 months of birth"
    },
    {
      step: 4,
      title: "Benefits Optimization",
      description: "Maximize employer benefits and tax-advantaged accounts",
      timeframe: "Next open enrollment period"
    },
    {
      step: 5,
      title: "Annual Review",
      description: "Regularly review and adjust coverage as family needs change",
      timeframe: "Annually"
    }
  ];

  const insuranceTips = [
    {
      category: "Coverage Assessment",
      icon: Shield,
      tip: "Regularly assess coverage adequacy as family grows",
      details: "Life insurance needs, health coverage limits, and disability benefits should increase with family responsibilities."
    },
    {
      category: "Cost Management", 
      icon: DollarSign,
      tip: "Use tax-advantaged accounts to reduce insurance costs",
      details: "FSAs, HSAs, and employer plans can significantly reduce the cost of insurance and medical expenses."
    },
    {
      category: "Beneficiary Updates",
      icon: Heart,
      tip: "Update all beneficiary designations immediately",
      details: "Ensure all insurance policies, retirement accounts, and benefits name appropriate beneficiaries and guardians."
    }
  ];

  const coverageCalculations = [
    {
      type: "Life Insurance Needs",
      calculation: "Income replacement + debt payoff + children's education costs",
      factors: ["10-20x annual income", "Outstanding mortgage and debts", "College education expenses", "Final expenses and taxes"],
      example: "Annual income $75,000 × 15 = $1.125M + $200K mortgage + $100K education = ~$1.4M total"
    },
    {
      type: "Disability Insurance Coverage",
      calculation: "60-70% of pre-tax income replacement",
      factors: ["Current monthly expenses", "Family financial obligations", "Existing coverage through employer", "Social Security disability benefits"],
      example: "$6,000/month income × 60% = $3,600/month coverage needed"
    },
    {
      type: "Health Insurance Deductibles",
      calculation: "Balance monthly premiums vs. annual out-of-pocket costs",
      factors: ["Expected medical expenses with children", "Monthly premium differences", "HSA contribution opportunities", "Provider network preferences"],
      example: "High-deductible plan + HSA may save $2,000+ annually for healthy families"
    },
    {
      type: "Emergency Fund Adjustment",
      calculation: "3-6 months of expenses + insurance deductibles",
      factors: ["Monthly family expenses", "Insurance deductibles", "Childcare costs", "Job security considerations"],
      example: "$4,000/month expenses × 6 months + $5,000 deductibles = $29,000 emergency fund"
    }
  ];

  const benefitOptimization = [
    {
      benefit: "Dependent Care FSA",
      maxAmount: "$5,000 annually (2024)",
      taxSavings: "Save 22-37% on childcare costs",
      eligible: ["Daycare and preschool costs", "Before/after school care", "Summer day camps", "In-home childcare"],
      strategy: "Use it or lose it - plan carefully for annual expenses"
    },
    {
      benefit: "Health Savings Account (HSA)",
      maxAmount: "$4,300 individual / $8,550 family (2024)",
      taxSavings: "Triple tax advantage - deductible, growth, and withdrawals",
      eligible: ["Medical expenses", "Dental and vision care", "Prescription medications", "After age 65: any expenses"],
      strategy: "Maximize contributions and invest for long-term growth"
    },
    {
      benefit: "Paid Family Leave",
      maxAmount: "Varies by state and employer",
      taxSavings: "Continued income during family leave",
      eligible: ["Bonding with new child", "Caring for sick family member", "Personal serious health condition", "Military deployment"],
      strategy: "Understand state and employer policies and coordinate with other leave"
    },
    {
      benefit: "Life Insurance Through Employer",
      maxAmount: "Often 1-2x annual salary",
      taxSavings: "Lower cost group rates",
      eligible: ["Basic coverage often free", "Supplemental coverage available", "Spouse and child coverage options", "Portable options"],
      strategy: "Supplement with individual policies for adequate coverage"
    }
  ];

  const insuranceProviders = [
    {
      category: "Health Insurance",
      considerations: ["Provider network coverage", "Pediatric care specialists", "Prescription drug coverage", "Maternity benefits", "Mental health coverage"],
      tips: "Ensure pediatrician and children's hospital are in-network"
    },
    {
      category: "Life Insurance",
      considerations: ["Financial strength ratings", "Policy conversion options", "Premium stability", "Claims paying history", "Customer service quality"],
      tips: "Consider term life for affordability and permanent life for estate planning"
    },
    {
      category: "Disability Insurance",
      considerations: ["Definition of disability", "Benefit period length", "Elimination period", "Cost of living adjustments", "Residual benefits"],
      tips: "Own-occupation coverage is worth the extra cost for professionals"
    },
    {
      category: "Auto/Property Insurance",
      considerations: ["Coverage limits adequacy", "Deductible amounts", "Bundling discounts", "Claims handling reputation", "Financial stability"],
      tips: "Increase liability limits as your assets and income grow"
    }
  ];

  const commonMistakes = [
    {
      mistake: "Underestimating Life Insurance Needs",
      consequence: "Insufficient coverage to replace income and pay for children's needs",
      solution: "Calculate comprehensive needs including income replacement, debt payoff, and education costs",
      prevention: "Review coverage annually as income and expenses increase"
    },
    {
      mistake: "Missing Enrollment Deadlines",
      consequence: "Gaps in coverage or delayed enrollment until next open enrollment",
      solution: "Mark calendar with critical dates and set reminders for enrollment periods",
      prevention: "Understand qualifying events that allow mid-year changes"
    },
    {
      mistake: "Not Updating Beneficiaries",
      consequence: "Insurance proceeds may go to wrong people or be delayed",
      solution: "Update all beneficiary designations immediately after major life events",
      prevention: "Review beneficiaries annually and keep contact information current"
    },
    {
      mistake: "Overlooking Employer Benefits",
      consequence: "Missing valuable benefits and tax savings opportunities",
      solution: "Thoroughly review all available employer benefits and enrollment options",
      prevention: "Schedule annual benefits review and consultation with HR"
    }
  ];

  const documentOrganization = [
    {
      document: "Insurance Policies",
      storage: "Secure physical location with digital copies",
      access: "Family members should know location and how to access",
      updates: "Review annually and after major life changes",
      sharing: "Share relevant information with beneficiaries and financial advisors"
    },
    {
      document: "Beneficiary Forms",
      storage: "With insurance companies and personal records",
      access: "Keep copies of all completed beneficiary designation forms",
      updates: "Update immediately after births, marriages, deaths, or divorces",
      sharing: "Inform beneficiaries of their designation and policy details"
    },
    {
      document: "Claims Documentation",
      storage: "Organized filing system with easy retrieval",
      access: "Include claim forms, receipts, and correspondence",
      updates: "Add new claims documentation as it occurs",
      sharing: "Share with healthcare providers and insurance advocates as needed"
    },
    {
      document: "Premium Payment Records",
      storage: "Financial records with tax documents",
      access: "Track payments for tax deduction purposes",
      updates: "Maintain current year records and archive annually",
      sharing: "Share with tax preparers and financial planners"
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
              <Shield className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Insurance & Benefits
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize all your family insurance policies and benefit information. 
              Keep health insurance, life insurance, and benefit details secure and accessible for your growing family.
            </p>
          </div>
        </div>
      </section>

      {/* Insurance Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Insurance & Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {insuranceCategories.map((category, index) => (
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
                  <h4 className="text-sm font-medium text-white mb-2">Key Components:</h4>
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

      {/* Enrollment Timeline */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Insurance & Benefits Timeline
          </h2>
          <div className="space-y-8">
            {enrollmentTimeline.map((step, index) => (
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

      {/* Insurance Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Insurance & Benefits Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {insuranceTips.map((tip, index) => {
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

      {/* Coverage Calculations */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Coverage Calculation Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coverageCalculations.map((calc, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{calc.type}</h3>
                <p className="text-[#FFD43B] font-medium mb-4">{calc.calculation}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Key Factors:</h4>
                  <ul className="space-y-1 mb-4">
                    {calc.factors.map((factor, factorIndex) => (
                      <li key={factorIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <TrendingUp className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">Example: {calc.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefit Optimization */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Tax-Advantaged Benefit Optimization
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefitOptimization.map((benefit, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{benefit.benefit}</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                    <p className="text-[#FFD43B] text-sm font-medium">Max: {benefit.maxAmount}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-sm font-medium">{benefit.taxSavings}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Eligible Expenses:</h4>
                  <ul className="space-y-1 mb-4">
                    {benefit.eligible.map((expense, expenseIndex) => (
                      <li key={expenseIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <DollarSign className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {expense}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-blue-400 text-sm font-medium">Strategy: {benefit.strategy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Provider Selection */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Insurance Provider Selection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {insuranceProviders.map((provider, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{provider.category}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Key Considerations:</h4>
                  <ul className="space-y-1 mb-4">
                    {provider.considerations.map((consideration, consIndex) => (
                      <li key={consIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {consideration}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">{provider.tips}</p>
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
            Common Insurance Mistakes to Avoid
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {commonMistakes.map((mistake, index) => (
              <div key={index} className="bg-[#121212] border border-red-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-red-400 mb-3">{mistake.mistake}</h3>
                <div className="mb-4">
                  <p className="text-[#A5A5A5] mb-3">{mistake.consequence}</p>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 mb-3">
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

      {/* Document Organization */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Insurance Document Organization
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {documentOrganization.map((doc, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{doc.document}</h3>
                <div className="space-y-3">
                  <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                    <p className="text-[#FFD43B] text-sm font-medium">Storage: {doc.storage}</p>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm font-medium">Access: {doc.access}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-sm font-medium">Updates: {doc.updates}</p>
                  </div>
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-3">
                    <p className="text-purple-400 text-sm font-medium">Sharing: {doc.sharing}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <Award className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium mb-2">Annual Review Reminder</p>
            <p className="text-[#A5A5A5]">
              Schedule an annual insurance review to ensure coverage keeps pace with your family's changing needs. 
              Update beneficiaries, coverage amounts, and take advantage of new benefit opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your insurance & benefits?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your insurance policies, benefit information, and coverage details organized with FamilyVault.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-insurance-benefits"
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