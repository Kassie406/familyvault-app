import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Search, CheckCircle, Calendar, MapPin, Shield, ArrowRight, Clock, Users, AlertCircle, Home, TrendingUp, School } from "lucide-react";

export default function HomeBuyingPropertyResearch() {
  const researchCategories = [
    {
      category: "Neighborhood Analysis",
      description: "Research the area where you're considering buying",
      importance: "Critical",
      information: ["Crime statistics and safety data", "School district ratings and boundaries", "Local amenities and services", "Future development plans"],
      tips: "Visit the neighborhood at different times and days to get a complete picture of the area"
    },
    {
      category: "Market Research",
      description: "Understand local real estate market conditions",
      importance: "Critical", 
      information: ["Recent comparable sales", "Average days on market", "Price trends over time", "Inventory levels and competition"],
      tips: "Look at 6-month trends rather than just current listings to understand market direction"
    },
    {
      category: "Property History",
      description: "Research the specific property you're considering",
      importance: "High",
      information: ["Previous sale prices and dates", "Property tax history", "Permit history and renovations", "Previous listing details"],
      tips: "Check for any red flags like frequent sales or major price changes that might indicate issues"
    },
    {
      category: "Location Factors", 
      description: "Evaluate proximity to important locations",
      importance: "High",
      information: ["Commute times to work", "Distance to schools and hospitals", "Access to shopping and dining", "Public transportation options"],
      tips: "Consider both current needs and future lifestyle changes when evaluating location"
    },
    {
      category: "Financial Analysis",
      description: "Calculate the true cost of homeownership",
      importance: "Medium",
      information: ["Property tax rates and assessments", "HOA fees and special assessments", "Utility costs and efficiency", "Maintenance and repair costs"],
      tips: "Factor in all ongoing costs when comparing properties, not just the purchase price"
    },
    {
      category: "Future Value Potential",
      description: "Assess long-term investment prospects",
      importance: "Medium",
      information: ["Planned infrastructure improvements", "Zoning changes and development", "School district changes", "Economic development projects"],
      tips: "Properties in areas with planned improvements often appreciate faster than average"
    }
  ];

  const researchSteps = [
    {
      step: 1,
      title: "Define Your Criteria",
      description: "List must-haves vs. nice-to-haves for location, property type, and features",
      timeframe: "Week 1"
    },
    {
      step: 2, 
      title: "Research Target Areas",
      description: "Study neighborhoods that fit your budget and lifestyle needs",
      timeframe: "Week 1-2"
    },
    {
      step: 3,
      title: "Analyze Market Data",
      description: "Review recent sales, pricing trends, and market conditions", 
      timeframe: "Week 2"
    },
    {
      step: 4,
      title: "Visit and Evaluate",
      description: "Tour neighborhoods and properties during different times",
      timeframe: "Week 2-3"
    },
    {
      step: 5,
      title: "Compare Options",
      description: "Create detailed comparisons of your top property choices",
      timeframe: "Week 3"
    }
  ];

  const researchTips = [
    {
      category: "Online Resources",
      icon: Search,
      tip: "Use multiple data sources for comprehensive research",
      details: "Combine MLS data, public records, neighborhood websites, and local news sources for complete information."
    },
    {
      category: "Local Knowledge", 
      icon: MapPin,
      tip: "Connect with local real estate professionals",
      details: "Agents, inspectors, and long-time residents can provide insights not available online."
    },
    {
      category: "Long-term Planning",
      icon: TrendingUp,
      tip: "Consider future needs and market trends",
      details: "Think about how your needs might change and how the area might develop over 5-10 years."
    }
  ];

  const researchTools = [
    {
      tool: "MLS and Real Estate Websites",
      purpose: "Property listings and market data",
      features: ["Current and sold property listings", "Price history and market trends", "Property photos and details", "Neighborhood statistics"],
      examples: "Realtor.com, Zillow, MLS listings"
    },
    {
      tool: "Government and Public Records",
      purpose: "Official property and area information",
      features: ["Property tax records", "Permit and renovation history", "Zoning information", "School district boundaries"],
      examples: "County assessor, building department, tax records"
    },
    {
      tool: "Demographics and Safety Data",
      purpose: "Neighborhood analysis and safety",
      features: ["Crime statistics", "Demographics and income data", "Walk scores and transportation", "Environmental hazards"],
      examples: "Census data, local police reports, EPA databases"
    },
    {
      tool: "Local Resources",
      purpose: "Community insights and future plans",
      features: ["City planning documents", "Local news and events", "Community forums", "Business directories"],
      examples: "City websites, local newspapers, NextDoor, Chamber of Commerce"
    }
  ];

  const evaluationCriteria = [
    {
      category: "Location Quality",
      factors: ["Safety and crime rates", "School quality and ratings", "Commute and transportation", "Nearby amenities"]
    },
    {
      category: "Property Condition",
      factors: ["Age and maintenance history", "Recent renovations", "Structural integrity", "Systems and appliances"]
    },
    {
      category: "Financial Considerations",
      factors: ["Purchase price vs. market value", "Ongoing ownership costs", "Tax implications", "Resale potential"]
    },
    {
      category: "Future Potential",
      factors: ["Area development plans", "Market appreciation trends", "Infrastructure improvements", "Zoning changes"]
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
              <Search className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Property Research
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Research properties, neighborhoods, and market conditions to make informed buying decisions. 
              Organize all your property research and analysis in one secure place.
            </p>
          </div>
        </div>
      </section>

      {/* Research Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Research Areas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {researchCategories.map((category, index) => (
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
                  <h4 className="text-sm font-medium text-white mb-2">Key Research Areas:</h4>
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

      {/* Research Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Property Research Process
          </h2>
          <div className="space-y-8">
            {researchSteps.map((step, index) => (
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

      {/* Research Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Property Research Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {researchTips.map((tip, index) => {
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

      {/* Research Tools */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Research Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {researchTools.map((tool, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{tool.tool}</h3>
                <p className="text-[#A5A5A5] mb-4">{tool.purpose}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {tool.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">Examples: {tool.examples}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evaluation Criteria */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Property Evaluation Criteria
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {evaluationCriteria.map((criteria, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{criteria.category}</h3>
                <ul className="space-y-2">
                  {criteria.factors.map((factor, factorIndex) => (
                    <li key={factorIndex} className="flex items-center text-[#A5A5A5]">
                      <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <Home className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium mb-2">Research Reminder</p>
            <p className="text-[#A5A5A5]">
              Take time to research thoroughly - you'll likely live in this home for years. 
              A few extra days of research can save you from costly mistakes later.
            </p>
          </div>
        </div>
      </section>

      {/* Research Checklist */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Property Research Checklist
          </h2>
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Before You Visit:</h3>
                <ul className="space-y-2 text-[#A5A5A5]">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Research neighborhood crime and safety
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Check school ratings and boundaries
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Review recent comparable sales
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Check property tax rates
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">During Your Visit:</h3>
                <ul className="space-y-2 text-[#A5A5A5]">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Drive the commute during rush hour
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Visit at different times of day
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Talk to neighbors if possible
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Check cell phone coverage
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
            Ready to organize your property research?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your property research, market analysis, and neighborhood information organized with FamilyCircle Secure.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-property-research"
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