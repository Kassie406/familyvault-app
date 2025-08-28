import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Home, CheckCircle, Calendar, MapPin, Shield, ArrowRight, Clock, Users, AlertCircle, Key, FileText, Banknote } from "lucide-react";

export default function MarriedLivingArrangements() {
  const housingCategories = [
    {
      category: "Rental Agreements",
      description: "Documentation for rented living spaces",
      importance: "Critical",
      documents: ["Lease agreement", "Rental application", "Security deposit receipts", "Renter's insurance policy"],
      tips: "Keep all lease documents accessible and note important dates like renewal deadlines"
    },
    {
      category: "Home Purchase",
      description: "Essential documents for buying your first home together",
      importance: "Critical", 
      documents: ["Mortgage documents", "Deed and title", "Home inspection reports", "Closing documents", "Homeowners insurance"],
      tips: "Store purchase documents in multiple secure locations - you'll need them for taxes and future sales"
    },
    {
      category: "Utilities & Services",
      description: "Setup and management of household utilities",
      importance: "High",
      documents: ["Utility account setup", "Internet/cable agreements", "Service provider contracts", "Monthly statements"],
      tips: "Set up automatic payments where possible and keep service agreements for reference"
    },
    {
      category: "Address Changes", 
      description: "Update your address with all important institutions",
      importance: "High",
      documents: ["Address change confirmations", "Mail forwarding receipts", "Updated registrations", "Subscription updates"],
      tips: "Create a checklist of all places that need your new address to avoid missing important updates"
    },
    {
      category: "Home Maintenance",
      description: "Documentation for home care and improvements",
      importance: "Medium",
      documents: ["Warranty information", "Service records", "Home improvement receipts", "Emergency contact lists"],
      tips: "Keep maintenance records to track home value improvements and warranty coverage"
    },
    {
      category: "Neighborhood Info",
      description: "Important local information and contacts",
      importance: "Medium",
      documents: ["HOA agreements", "Local emergency contacts", "Community guidelines", "Utility emergency numbers"],
      tips: "Build relationships with neighbors and keep local emergency contacts easily accessible"
    }
  ];

  const movingSteps = [
    {
      step: 1,
      title: "Decide on Living Situation",
      description: "Choose whether to rent together, buy a home, or move to one partner's existing place",
      timeframe: "1-3 months before"
    },
    {
      step: 2, 
      title: "Secure Housing",
      description: "Complete rental applications or home buying process, including all necessary documentation",
      timeframe: "2-8 weeks before"
    },
    {
      step: 3,
      title: "Arrange Utilities",
      description: "Set up electricity, gas, water, internet, and other essential services in both names", 
      timeframe: "2-4 weeks before"
    },
    {
      step: 4,
      title: "Plan the Move",
      description: "Coordinate moving logistics, hire movers, and organize packing and transportation",
      timeframe: "2-4 weeks before"
    },
    {
      step: 5,
      title: "Update Addresses",
      description: "Change address with banks, employers, IRS, DMV, and all other important institutions",
      timeframe: "Within 30 days"
    }
  ];

  const budgetTips = [
    {
      category: "Monthly Housing Costs",
      items: ["Rent/Mortgage payment", "Property taxes", "HOA fees", "Insurance premiums"],
      percentage: "25-30% of income"
    },
    {
      category: "Utilities & Services", 
      items: ["Electricity & gas", "Water & sewer", "Internet & cable", "Trash collection"],
      percentage: "5-10% of income"
    },
    {
      category: "Moving Expenses",
      items: ["Security deposits", "Moving company", "New furniture/appliances", "Utility deposits"],
      percentage: "One-time: $3,000-8,000"
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
              <Home className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Living Arrangements
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize all your housing documents in one place. From lease agreements to mortgage papers, 
              keep track of everything needed for your shared living space.
            </p>
          </div>
        </div>
      </section>

      {/* Housing Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Housing Documentation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {housingCategories.map((category, index) => (
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

      {/* Moving Timeline */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Your Moving & Housing Timeline
          </h2>
          <div className="space-y-8">
            {movingSteps.map((step, index) => (
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

      {/* Budget Planning */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Housing Budget Planning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {budgetTips.map((budget, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{budget.category}</h3>
                  <span className="text-[#FFD43B] text-sm font-medium">{budget.percentage}</span>
                </div>
                <ul className="space-y-2">
                  {budget.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-[#A5A5A5] text-sm">
                      <Banknote className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your housing documents?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your rental, mortgage, and home-related documents secure and organized with FamilyVault.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-housing"
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