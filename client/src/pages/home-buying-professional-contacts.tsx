import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Phone, CheckCircle, Calendar, Users, Shield, ArrowRight, Clock, Home, AlertCircle, Building, UserCheck, Briefcase } from "lucide-react";

export default function HomeBuyingProfessionalContacts() {
  const professionalCategories = [
    {
      category: "Real Estate Agent",
      description: "Licensed professional to guide you through the buying process",
      importance: "Critical",
      information: ["Buyer's agent representation", "Market knowledge and expertise", "Negotiation and contract assistance", "Transaction coordination"],
      tips: "Choose an agent who specializes in your target area and price range, with strong recent sales history"
    },
    {
      category: "Mortgage Lender",
      description: "Loan officer and lending institution for financing",
      importance: "Critical", 
      information: ["Pre-approval and loan processing", "Interest rates and terms", "Underwriting coordination", "Closing preparation"],
      tips: "Shop with multiple lenders for the best terms, but do it within a short timeframe to minimize credit impact"
    },
    {
      category: "Home Inspector",
      description: "Professional to evaluate property condition",
      importance: "High",
      information: ["General home inspection", "Specialized system inspections", "Written inspection reports", "Safety and maintenance recommendations"],
      tips: "Hire your own inspector - don't rely on seller-provided inspections for unbiased assessment"
    },
    {
      category: "Real Estate Attorney", 
      description: "Legal counsel for contract review and closing",
      importance: "High",
      information: ["Contract review and negotiation", "Title examination", "Closing representation", "Legal issue resolution"],
      tips: "Required in some states, recommended in all. Choose an attorney experienced in real estate transactions"
    },
    {
      category: "Insurance Agent",
      description: "Professional to arrange homeowner's insurance",
      importance: "Medium",
      information: ["Homeowner's insurance policies", "Coverage options and limits", "Premium quotes and discounts", "Claims support"],
      tips: "Shop for insurance early - you'll need coverage in place before closing"
    },
    {
      category: "Title Company/Escrow Officer",
      description: "Professional to handle title transfer and closing",
      importance: "Medium",
      information: ["Title search and insurance", "Escrow services", "Document preparation", "Closing coordination"],
      tips: "Title companies ensure clear ownership transfer and protect against title defects"
    }
  ];

  const selectionSteps = [
    {
      step: 1,
      title: "Research and Interview",
      description: "Find qualified professionals through referrals, online research, and interviews",
      timeframe: "Before house hunting"
    },
    {
      step: 2, 
      title: "Check Credentials",
      description: "Verify licenses, certifications, and professional standing",
      timeframe: "During selection process"
    },
    {
      step: 3,
      title: "Compare Services",
      description: "Evaluate experience, fees, and service quality", 
      timeframe: "During selection process"
    },
    {
      step: 4,
      title: "Establish Team",
      description: "Build your home buying team with coordinated professionals",
      timeframe: "Before making offers"
    },
    {
      step: 5,
      title: "Maintain Relationships",
      description: "Keep contact information current and maintain professional relationships",
      timeframe: "Throughout and beyond purchase"
    }
  ];

  const selectionTips = [
    {
      category: "Experience & Expertise",
      icon: UserCheck,
      tip: "Choose professionals with relevant experience",
      details: "Look for professionals who specialize in your area, price range, and type of transaction."
    },
    {
      category: "Communication Style", 
      icon: Phone,
      tip: "Ensure clear and responsive communication",
      details: "Choose professionals who communicate clearly, respond promptly, and keep you informed."
    },
    {
      category: "Team Coordination",
      icon: Users,
      tip: "Build a team that works well together",
      details: "Professionals who have worked together before can provide smoother transactions."
    }
  ];

  const professionalRoles = [
    {
      professional: "Buyer's Agent",
      responsibilities: ["Property search assistance", "Market analysis and pricing", "Offer preparation and negotiation", "Transaction coordination"],
      whenNeeded: "Essential from the beginning of your home search",
      compensation: "Typically paid by seller through listing commission"
    },
    {
      professional: "Loan Officer",
      responsibilities: ["Pre-approval processing", "Loan application assistance", "Rate and program comparison", "Closing coordination"],
      whenNeeded: "Before starting serious house hunting",
      compensation: "Paid through loan origination fees and lender compensation"
    },
    {
      professional: "Home Inspector",
      responsibilities: ["Property condition assessment", "System functionality evaluation", "Safety concern identification", "Maintenance recommendations"],
      whenNeeded: "After offer acceptance during inspection period",
      compensation: "Paid directly by buyer, typically $300-600"
    },
    {
      professional: "Real Estate Attorney",
      responsibilities: ["Contract review and explanation", "Legal issue resolution", "Title examination", "Closing representation"],
      whenNeeded: "Contract review and closing (required in some states)",
      compensation: "Flat fee or hourly rate, typically $500-1,500"
    }
  ];

  const warningFlags = [
    {
      warning: "Lack of Proper Credentials",
      signs: ["No current license", "Disciplinary actions", "Unwillingness to provide references"],
      action: "Verify credentials through state licensing boards"
    },
    {
      warning: "Poor Communication",
      signs: ["Slow response times", "Unclear explanations", "Doesn't return calls"],
      action: "Look for professionals who prioritize client communication"
    },
    {
      warning: "Conflicts of Interest",
      signs: ["Dual agency without disclosure", "Kickback arrangements", "Pressure for specific services"],
      action: "Choose professionals who prioritize your interests"
    },
    {
      warning: "Unrealistic Promises",
      signs: ["Guaranteed results", "Too-good-to-be-true terms", "Pressure tactics"],
      action: "Be wary of unrealistic promises and high-pressure sales"
    }
  ];

  const teamCoordination = [
    {
      scenario: "Pre-Approval Process",
      coordination: "Agent refers to trusted lender, coordinates timing with house hunting plans"
    },
    {
      scenario: "Home Inspection",
      coordination: "Agent recommends inspectors, coordinates scheduling, reviews results together"
    },
    {
      scenario: "Contract Negotiation",
      coordination: "Agent and attorney work together on terms, lender confirms financing feasibility"
    },
    {
      scenario: "Closing Preparation",
      coordination: "Lender, title company, and attorney coordinate document preparation and signing"
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
              <Phone className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Professional Contacts
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Build your home buying team with qualified professionals. 
              Keep contact information organized for agents, lenders, inspectors, and other key professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Professional Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Home Buying Professionals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {professionalCategories.map((category, index) => (
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
                  <h4 className="text-sm font-medium text-white mb-2">Key Services:</h4>
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

      {/* Selection Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Professional Selection Process
          </h2>
          <div className="space-y-8">
            {selectionSteps.map((step, index) => (
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

      {/* Selection Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Professional Selection Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {selectionTips.map((tip, index) => {
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

      {/* Professional Roles */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Professional Roles and Compensation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {professionalRoles.map((role, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{role.professional}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Key Responsibilities:</h4>
                  <ul className="space-y-1">
                    {role.responsibilities.map((responsibility, respIndex) => (
                      <li key={respIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                    <p className="text-[#FFD43B] text-sm font-medium">When Needed: {role.whenNeeded}</p>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm font-medium">Compensation: {role.compensation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warning Flags */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Red Flags to Avoid
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {warningFlags.map((flag, index) => (
              <div key={index} className="bg-[#121212] border border-red-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-red-400 mb-3">{flag.warning}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Warning Signs:</h4>
                  <ul className="space-y-1">
                    {flag.signs.map((sign, signIndex) => (
                      <li key={signIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <AlertCircle className="w-3 h-3 text-red-400 mr-2 flex-shrink-0" />
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-green-400 text-sm font-medium">{flag.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Coordination */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Team Coordination Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamCoordination.map((coord, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{coord.scenario}</h3>
                <p className="text-[#A5A5A5]">{coord.coordination}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium mb-2">Team Advantage</p>
            <p className="text-[#A5A5A5]">
              A coordinated team of professionals can make your home buying process smoother, faster, 
              and help you avoid costly mistakes. Choose professionals who work well together.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Organization Template */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Professional Contact Organization Template
          </h2>
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">For Each Professional, Include:</h3>
                <ul className="space-y-2 text-[#A5A5A5]">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Full name and professional title
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Company or brokerage name
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Phone, email, and office address
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    License numbers and certifications
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Additional Details:</h3>
                <ul className="space-y-2 text-[#A5A5A5]">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Specialty areas and expertise
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Fee structure and payment terms
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Emergency contact procedures
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Professional references
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
            Ready to organize your professional contacts?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your home buying professional contact information secure and organized with FamilyCircle Secure.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-professional-contacts-home"
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