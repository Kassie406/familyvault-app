import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Scale, CheckCircle, Calendar, FileText, Shield, ArrowRight, Clock, Users, AlertCircle, CreditCard, Home, UserCheck } from "lucide-react";

export default function EstatePowerOfAttorney() {
  const poaCategories = [
    {
      category: "Financial Power of Attorney",
      description: "Authority to manage financial affairs and property",
      importance: "Critical",
      information: ["Banking and investment management", "Real estate transactions", "Tax filing and financial decisions", "Insurance and benefits management"],
      tips: "Choose someone you trust completely with your finances and ensure they understand your financial goals"
    },
    {
      category: "Healthcare Power of Attorney",
      description: "Authority to make medical decisions on your behalf",
      importance: "Critical", 
      information: ["Medical treatment decisions", "Healthcare provider selection", "Access to medical records", "End-of-life care choices"],
      tips: "Select someone who understands your healthcare values and will advocate for your wishes"
    },
    {
      category: "Durable Power of Attorney",
      description: "Remains effective even if you become incapacitated",
      importance: "High",
      information: ["Incapacity provisions", "Effective date specifications", "Scope of authority", "Termination conditions"],
      tips: "Most powers of attorney should be durable to remain effective when you need them most"
    },
    {
      category: "Limited Power of Attorney", 
      description: "Restricted to specific tasks or time periods",
      importance: "Medium",
      information: ["Specific transaction authority", "Time-limited powers", "Property-specific powers", "Business-related decisions"],
      tips: "Useful for specific situations like real estate closings or business transactions when you can't be present"
    },
    {
      category: "Springing Power of Attorney",
      description: "Only becomes effective upon specific conditions",
      importance: "Medium",
      information: ["Triggering event definitions", "Incapacity determinations", "Medical certifications required", "Effective date procedures"],
      tips: "Can provide more control but may create delays when immediate action is needed"
    },
    {
      category: "Agent Instructions",
      description: "Specific guidance and limitations for your agents",
      importance: "High",
      information: ["Decision-making guidelines", "Compensation provisions", "Reporting requirements", "Successor agent appointments"],
      tips: "Provide clear instructions to help your agents make decisions that align with your preferences"
    }
  ];

  const planningSteps = [
    {
      step: 1,
      title: "Determine Your Needs",
      description: "Identify what types of decisions you need someone else to make for you",
      timeframe: "Week 1"
    },
    {
      step: 2, 
      title: "Choose Your Agents",
      description: "Select trusted individuals for financial and healthcare decisions",
      timeframe: "Week 1"
    },
    {
      step: 3,
      title: "Define Powers & Limitations",
      description: "Specify what authority you're granting and any restrictions", 
      timeframe: "Week 2"
    },
    {
      step: 4,
      title: "Execute Documents Legally",
      description: "Complete all required legal formalities including notarization",
      timeframe: "Week 2"
    },
    {
      step: 5,
      title: "Distribute & Discuss",
      description: "Share documents with agents, family, and relevant institutions",
      timeframe: "Week 3"
    }
  ];

  const poaTips = [
    {
      category: "Agent Selection",
      icon: UserCheck,
      tip: "Choose agents carefully based on trust and competence",
      details: "Your agent will have significant authority over your affairs. Choose someone reliable and trustworthy."
    },
    {
      category: "Clear Instructions", 
      icon: FileText,
      tip: "Provide specific guidance for decision-making",
      details: "Clear instructions help agents understand your preferences and make appropriate decisions."
    },
    {
      category: "Regular Review",
      icon: Calendar,
      tip: "Review and update power of attorney documents regularly",
      details: "Circumstances change over time. Review your POA documents and agents periodically."
    }
  ];

  const agentResponsibilities = [
    {
      type: "Financial Agent Duties",
      responsibilities: ["Act in your best interests", "Keep accurate records", "Avoid conflicts of interest", "Manage assets prudently"]
    },
    {
      type: "Healthcare Agent Duties",
      responsibilities: ["Follow your healthcare wishes", "Consult with medical professionals", "Consider your values and beliefs", "Communicate with family appropriately"]
    },
    {
      type: "General Agent Duties",
      responsibilities: ["Act with loyalty and care", "Keep your affairs confidential", "Avoid self-dealing", "Report to you when requested"]
    }
  ];

  const poaScenarios = [
    {
      scenario: "Temporary Travel",
      considerations: ["Real estate transactions while away", "Business decisions in your absence", "Financial account access", "Limited duration and scope"]
    },
    {
      scenario: "Health Emergency",
      considerations: ["Medical decision-making authority", "Access to medical records", "Insurance claim processing", "Family communication coordination"]
    },
    {
      scenario: "Progressive Illness",
      considerations: ["Gradual transfer of responsibilities", "Asset management during decline", "Healthcare coordination", "Family involvement planning"]
    },
    {
      scenario: "Sudden Incapacity",
      considerations: ["Immediate decision-making needs", "Financial account access", "Bill paying and asset protection", "Medical care coordination"]
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
              <Scale className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Power of Attorney
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize your power of attorney documents and agent information. Ensure trusted individuals 
              can manage your financial and healthcare decisions when you're unable to do so yourself.
            </p>
          </div>
        </div>
      </section>

      {/* Power of Attorney Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Types of Power of Attorney Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {poaCategories.map((category, index) => (
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
                  <h4 className="text-sm font-medium text-white mb-2">Key Powers:</h4>
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

      {/* POA Planning Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Power of Attorney Planning Process
          </h2>
          <div className="space-y-8">
            {planningSteps.map((step, index) => (
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

      {/* POA Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Power of Attorney Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {poaTips.map((tip, index) => {
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

      {/* Agent Responsibilities */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Agent Responsibilities and Duties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {agentResponsibilities.map((agent, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{agent.type}</h3>
                <ul className="space-y-2">
                  {agent.responsibilities.map((responsibility, responsibilityIndex) => (
                    <li key={responsibilityIndex} className="flex items-center text-[#A5A5A5] text-sm">
                      <Shield className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common POA Scenarios */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Common Power of Attorney Scenarios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {poaScenarios.map((scenario, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{scenario.scenario}</h3>
                <ul className="space-y-2">
                  {scenario.considerations.map((consideration, considerationIndex) => (
                    <li key={considerationIndex} className="flex items-center text-[#A5A5A5] text-sm">
                      <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {consideration}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <Scale className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium mb-2">Legal Requirements</p>
            <p className="text-[#A5A5A5]">
              Power of attorney documents must comply with state law requirements. Most require notarization, 
              and some require witnesses. Consult with an attorney to ensure proper execution.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your power of attorney documents?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your power of attorney documents and agent information secure and organized with FamilyCircle Secure.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-power-of-attorney"
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