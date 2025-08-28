import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Building, CheckCircle, Calendar, Home, Shield, ArrowRight, Clock, Users, AlertCircle, CreditCard, Camera, FileText } from "lucide-react";

export default function EstateAssetDocumentation() {
  const assetCategories = [
    {
      category: "Real Estate",
      description: "Property ownership and related documentation",
      importance: "Critical",
      information: ["Property deeds and titles", "Mortgage and loan documents", "Property tax records", "Appraisals and assessments"],
      tips: "Keep all real estate documents together including surveys, inspection reports, and improvement records"
    },
    {
      category: "Financial Assets",
      description: "Bank accounts, investments, and monetary assets",
      importance: "Critical", 
      information: ["Bank and credit union accounts", "Investment and brokerage accounts", "Retirement accounts (401k, IRA)", "Stock certificates and bonds"],
      tips: "Include account numbers, contact information, and recent statements for all financial assets"
    },
    {
      category: "Business Interests",
      description: "Ownership in businesses and professional practices",
      importance: "High",
      information: ["Business partnership agreements", "Corporate stock certificates", "Operating agreements (LLC)", "Buy-sell agreements"],
      tips: "Business valuations may be needed for estate tax purposes - keep current appraisals"
    },
    {
      category: "Personal Property", 
      description: "Valuable personal belongings and collectibles",
      importance: "Medium",
      information: ["Jewelry and precious metals", "Art and collectibles", "Vehicles and recreational equipment", "Antiques and heirlooms"],
      tips: "Document high-value items with photos, appraisals, and purchase receipts for insurance and estate purposes"
    },
    {
      category: "Intellectual Property",
      description: "Copyrights, patents, and other intangible assets",
      importance: "Medium",
      information: ["Patents and patent applications", "Copyrights and trademarks", "Royalty agreements", "Licensing contracts"],
      tips: "Intellectual property can have significant value - maintain records of registrations and income streams"
    },
    {
      category: "Digital Assets",
      description: "Online accounts and digital property",
      importance: "Medium",
      information: ["Cryptocurrency holdings", "Digital media libraries", "Online business assets", "Domain names and websites"],
      tips: "Include access information and recovery methods for all digital assets and accounts"
    }
  ];

  const documentationSteps = [
    {
      step: 1,
      title: "Create Asset Inventory",
      description: "List all assets including location, value, and ownership details",
      timeframe: "Week 1-2"
    },
    {
      step: 2, 
      title: "Gather Supporting Documents",
      description: "Collect deeds, titles, statements, and other proof of ownership",
      timeframe: "Week 2-3"
    },
    {
      step: 3,
      title: "Document Values & Appraisals",
      description: "Obtain current valuations for significant assets", 
      timeframe: "Week 3-4"
    },
    {
      step: 4,
      title: "Photograph Valuable Items",
      description: "Create visual record of personal property and collectibles",
      timeframe: "Week 4"
    },
    {
      step: 5,
      title: "Organize & Store Securely",
      description: "File documents securely and create accessible summaries",
      timeframe: "Ongoing"
    }
  ];

  const documentationTips = [
    {
      category: "Regular Updates",
      icon: Calendar,
      tip: "Update asset documentation annually",
      details: "Asset values change over time. Regular updates ensure accurate estate planning and insurance coverage."
    },
    {
      category: "Visual Documentation", 
      icon: Camera,
      tip: "Photograph valuable items and property",
      details: "Photos help with insurance claims and provide proof of ownership and condition."
    },
    {
      category: "Secure Storage",
      icon: Shield,
      tip: "Store originals safely with accessible copies",
      details: "Use fireproof storage for originals and keep copies in separate secure locations."
    }
  ];

  const valuationMethods = [
    {
      type: "Professional Appraisals",
      uses: ["Real estate property", "Art and collectibles", "Business interests", "Antiques and jewelry"],
      considerations: "Required for high-value items and estate tax purposes"
    },
    {
      type: "Market Comparisons",
      uses: ["Common investments", "Vehicles and equipment", "Standard personal property", "Published market prices"],
      considerations: "Use recent sales data and current market conditions"
    },
    {
      type: "Financial Statements",
      uses: ["Bank and investment accounts", "Retirement accounts", "Insurance cash values", "Business financial records"],
      considerations: "Use most recent statements and year-end summaries"
    }
  ];

  const inheritancePlanning = [
    {
      consideration: "Asset Transferability",
      details: ["Joint ownership arrangements", "Transfer-on-death designations", "Trust funding requirements", "Probate avoidance strategies"]
    },
    {
      consideration: "Tax Implications",
      details: ["Estate tax considerations", "Capital gains basis step-up", "Gift tax planning", "Generation-skipping tax"]
    },
    {
      consideration: "Liquidity Needs",
      details: ["Estate administration expenses", "Tax payment requirements", "Family support needs", "Business continuation planning"]
    },
    {
      consideration: "Family Considerations",
      details: ["Heir preferences and abilities", "Family business succession", "Special needs planning", "Charitable giving goals"]
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
              <Building className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Asset Documentation
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Document and organize all your valuable assets for estate planning purposes. 
              Maintain comprehensive records of property, investments, and valuables for your heirs.
            </p>
          </div>
        </div>
      </section>

      {/* Asset Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Types of Assets to Document
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assetCategories.map((category, index) => (
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
                  <h4 className="text-sm font-medium text-white mb-2">Key Documentation:</h4>
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

      {/* Documentation Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Asset Documentation Process
          </h2>
          <div className="space-y-8">
            {documentationSteps.map((step, index) => (
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

      {/* Documentation Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Asset Documentation Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {documentationTips.map((tip, index) => {
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

      {/* Valuation Methods */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Asset Valuation Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valuationMethods.map((method, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{method.type}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Best Used For:</h4>
                  <ul className="space-y-1">
                    {method.uses.map((use, useIndex) => (
                      <li key={useIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {use}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">{method.considerations}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estate Planning Considerations */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Estate Planning Considerations for Assets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {inheritancePlanning.map((planning, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{planning.consideration}</h3>
                <ul className="space-y-2">
                  {planning.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-[#A5A5A5]">
                      <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <Building className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium mb-2">Professional Guidance</p>
            <p className="text-[#A5A5A5]">
              Complex assets may require professional appraisals and specialized estate planning strategies. 
              Consult with attorneys, CPAs, and appraisers for comprehensive planning.
            </p>
          </div>
        </div>
      </section>

      {/* Asset Inventory Template */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Asset Inventory Checklist Template
          </h2>
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">For Each Asset, Document:</h3>
                <ul className="space-y-2 text-[#A5A5A5]">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Description and location
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Current estimated value
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Ownership details (sole, joint, etc.)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Account or identification numbers
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Supporting Documentation:</h3>
                <ul className="space-y-2 text-[#A5A5A5]">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Proof of ownership documents
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Recent appraisals or valuations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Photos of valuable items
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Contact information for institutions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to document your assets?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your asset documentation, valuations, and ownership records secure and organized with FamilyVault.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-asset-documentation"
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