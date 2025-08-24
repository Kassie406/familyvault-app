import Navbar from "@/components/navbar";
import { Home, FileText, DollarSign, Shield, Key, Users, Calculator, CheckCircle } from "lucide-react";

export default function HomeBuying() {
  const buyingCategories = [
    {
      title: "Financial Documentation",
      icon: DollarSign,
      items: [
        "Pre-approval letter from lender",
        "Bank statements (2-3 months)",
        "Pay stubs and employment verification",
        "Tax returns (2 years)",
        "Investment and retirement account statements",
        "Debt statements and credit report"
      ]
    },
    {
      title: "Purchase Documents",
      icon: FileText,
      items: [
        "Purchase agreement/contract",
        "Earnest money deposit receipt",
        "Property disclosure statements",
        "HOA documents and bylaws",
        "Inspection reports and receipts",
        "Appraisal report"
      ]
    },
    {
      title: "Insurance & Legal",
      icon: Shield,
      items: [
        "Homeowner's insurance policy",
        "Title insurance documentation",
        "Legal deed and title documents",
        "Property survey results",
        "Municipal permits and certificates",
        "Attorney contact information"
      ]
    },
    {
      title: "Closing & Moving",
      icon: Key,
      items: [
        "Final walk-through checklist",
        "Closing disclosure statement",
        "Keys and garage door openers",
        "Utility transfer confirmations",
        "Moving company contracts",
        "Change of address notifications"
      ]
    }
  ];

  const buyingProcess = [
    {
      step: "1",
      title: "Financial Preparation",
      description: "Check credit score, save for down payment, and get pre-approved for a mortgage loan"
    },
    {
      step: "2",
      title: "House Hunting",
      description: "Find a real estate agent, search properties, and schedule viewings in your target areas"
    },
    {
      step: "3",
      title: "Make an Offer",
      description: "Submit purchase offer, negotiate terms, and provide earnest money deposit"
    },
    {
      step: "4",
      title: "Due Diligence",
      description: "Conduct home inspection, review disclosures, and finalize mortgage application"
    },
    {
      step: "5",
      title: "Final Steps",
      description: "Complete final walk-through, attend closing, and receive keys to your new home"
    },
    {
      step: "6",
      title: "Post-Purchase",
      description: "Transfer utilities, update address, set up home insurance, and organize warranties"
    }
  ];

  const firstTimeBuyerTips = [
    {
      title: "Save for Hidden Costs",
      description: "Budget for closing costs (2-5% of home price), moving expenses, and immediate repairs or improvements."
    },
    {
      title: "Research Neighborhoods Thoroughly",
      description: "Visit areas at different times, check school districts, crime rates, and future development plans."
    },
    {
      title: "Don't Skip the Home Inspection",
      description: "Professional inspections can reveal costly issues and give you negotiating power or exit options."
    },
    {
      title: "Understand Your Mortgage Options",
      description: "Compare fixed vs. adjustable rates, loan terms, and programs for first-time buyers."
    },
    {
      title: "Keep Documents Organized",
      description: "Maintain digital and physical copies of all paperwork for tax purposes and future reference."
    },
    {
      title: "Plan for Ongoing Costs",
      description: "Factor in property taxes, insurance, maintenance, utilities, and potential HOA fees."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Home className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Home Buying Guide
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Navigate the home buying process with confidence. Keep all your important documents, 
            contracts, and information organized from pre-approval to moving day and beyond.
          </p>
        </div>
      </section>

      {/* Buying Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Essential Home Buying Documents
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Stay organized with all the important paperwork and information needed throughout your home buying journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {buyingCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Buying Process */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Calculator className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Home Buying Process Steps</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Follow this step-by-step guide to navigate the home buying process from start to finish
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {buyingProcess.map((item, index) => (
              <div key={index} className="bg-blue-500 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center mb-4">
                  <span className="text-lg font-bold">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-blue-100 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* First Time Buyer Tips */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Key className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">First-Time Buyer Tips</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Essential advice for navigating your first home purchase successfully
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {firstTimeBuyerTips.map((tip, index) => (
              <div key={index} className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{tip.title}</h3>
                <p className="text-gray-700 leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">30-45</div>
              <p className="text-gray-700">days typical closing timeline</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">2-5%</div>
              <p className="text-gray-700">of home price for closing costs</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">20%</div>
              <p className="text-gray-700">recommended down payment</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Organize Your Home Buying Journey
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Keep all your home buying documents, contracts, and important information secure and easily accessible throughout the process.
          </p>
          <a
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Start Your Home Buying Checklist
          </a>
        </div>
      </section>
    </div>
  );
}