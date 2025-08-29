import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Home, CheckCircle, Calendar, Wrench, Shield, ArrowRight, Clock, Users, AlertCircle, Camera, FileText, Zap } from "lucide-react";

export default function HomeBuyingInspectionRecords() {
  const inspectionCategories = [
    {
      category: "General Home Inspection",
      description: "Comprehensive assessment of home's overall condition",
      importance: "Critical",
      information: ["Structural components inspection", "Electrical systems evaluation", "Plumbing systems check", "HVAC system assessment"],
      tips: "Always get a general inspection - it covers all major systems and can reveal issues that affect safety and value"
    },
    {
      category: "Specialized Inspections",
      description: "Targeted inspections for specific concerns or systems",
      importance: "High", 
      information: ["Roof and gutters inspection", "Foundation and structural analysis", "Pest and termite inspection", "Environmental hazard testing"],
      tips: "Consider specialized inspections based on home age, location, and any red flags from the general inspection"
    },
    {
      category: "Documentation and Reports",
      description: "Inspection reports and supporting documentation",
      importance: "Critical",
      information: ["Detailed written reports", "Photos of issues found", "Repair cost estimates", "Safety concern priorities"],
      tips: "Keep all inspection reports - they're valuable for negotiations, future maintenance, and warranty claims"
    },
    {
      category: "Follow-up Actions", 
      description: "Next steps based on inspection findings",
      importance: "High",
      information: ["Negotiation strategy for repairs", "Contractor estimates for issues", "Re-inspection scheduling", "Purchase decision factors"],
      tips: "Use inspection results strategically - not every issue requires repair, focus on safety and major expenses"
    },
    {
      category: "Inspector Selection",
      description: "Choosing qualified inspection professionals",
      importance: "Medium",
      information: ["Licensed and certified inspectors", "Specialized expertise areas", "References and reviews", "Insurance and bonding"],
      tips: "Hire your own inspector - don't rely on seller-provided inspections for unbiased assessment"
    },
    {
      category: "Inspection Timing",
      description: "Scheduling inspections during the buying process",
      importance: "Medium",
      information: ["Contingency period management", "Coordination with seller", "Multiple inspection scheduling", "Report review timelines"],
      tips: "Schedule inspections immediately after offer acceptance - contingency periods are typically short"
    }
  ];

  const inspectionSteps = [
    {
      step: 1,
      title: "Schedule General Inspection",
      description: "Hire a qualified general home inspector as soon as your offer is accepted",
      timeframe: "Within 1-2 days of offer acceptance"
    },
    {
      step: 2, 
      title: "Attend the Inspection",
      description: "Be present during inspection to ask questions and understand findings",
      timeframe: "During scheduled inspection"
    },
    {
      step: 3,
      title: "Review Inspection Report",
      description: "Carefully review detailed report and prioritize issues found", 
      timeframe: "Within 24 hours of inspection"
    },
    {
      step: 4,
      title: "Get Contractor Estimates",
      description: "Obtain repair estimates for significant issues found during inspection",
      timeframe: "2-3 days after receiving report"
    },
    {
      step: 5,
      title: "Negotiate or Decide",
      description: "Use inspection results to negotiate repairs or make purchase decision",
      timeframe: "Before contingency expires"
    }
  ];

  const inspectionTips = [
    {
      category: "Inspector Selection",
      icon: Users,
      tip: "Choose experienced, certified inspectors",
      details: "Look for proper licensing, certifications, insurance, and good references from recent clients."
    },
    {
      category: "Active Participation", 
      icon: Camera,
      tip: "Attend inspections and ask questions",
      details: "Being present helps you understand issues firsthand and learn about home maintenance needs."
    },
    {
      category: "Documentation",
      icon: FileText,
      tip: "Keep all inspection records organized",
      details: "Reports are valuable for negotiations, future maintenance planning, and warranty claims."
    }
  ];

  const inspectionTypes = [
    {
      type: "General Home Inspection",
      scope: "Overall home condition",
      includes: ["Structural elements", "Electrical systems", "Plumbing systems", "HVAC systems", "Roofing and exterior", "Interior components"],
      timeline: "3-5 hours",
      cost: "$300-600"
    },
    {
      type: "Pest Inspection",
      scope: "Termites and other pests",
      includes: ["Termite damage assessment", "Active infestation signs", "Moisture problems", "Treatment recommendations"],
      timeline: "1-2 hours", 
      cost: "$75-150"
    },
    {
      type: "Roof Inspection",
      scope: "Roofing system condition",
      includes: ["Shingle or tile condition", "Flashing and seals", "Gutter systems", "Structural support"],
      timeline: "1-2 hours",
      cost: "$200-400"
    },
    {
      type: "Environmental Testing",
      scope: "Health and safety hazards",
      includes: ["Radon testing", "Mold assessment", "Lead paint testing", "Asbestos identification"],
      timeline: "Varies by test",
      cost: "$100-500 per test"
    }
  ];

  const commonIssues = [
    {
      issue: "Electrical Problems",
      severity: "High",
      examples: ["Outdated wiring", "Overloaded circuits", "Missing GFCI outlets", "Panel box issues"],
      typicalCost: "$500-$5,000+",
      urgency: "Address before moving in for safety"
    },
    {
      issue: "Plumbing Issues",
      severity: "High", 
      examples: ["Leaky pipes", "Poor water pressure", "Outdated fixtures", "Sewer line problems"],
      typicalCost: "$200-$3,000+",
      urgency: "Major leaks need immediate attention"
    },
    {
      issue: "HVAC Problems",
      severity: "Medium",
      examples: ["Old furnace/AC", "Poor maintenance", "Ductwork issues", "Ventilation problems"],
      typicalCost: "$500-$8,000+",
      urgency: "Plan for replacement if system is old"
    },
    {
      issue: "Roof Concerns",
      severity: "Medium",
      examples: ["Missing shingles", "Gutter problems", "Flashing issues", "Age-related wear"],
      typicalCost: "$300-$15,000+",
      urgency: "Address leaks immediately"
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
                Home Inspection Records
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize all your home inspection reports, contractor estimates, and repair documentation. 
              Make informed decisions about property purchases and maintenance needs.
            </p>
          </div>
        </div>
      </section>

      {/* Inspection Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Home Inspection Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {inspectionCategories.map((category, index) => (
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
                  <h4 className="text-sm font-medium text-white mb-2">Key Elements:</h4>
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

      {/* Inspection Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Home Inspection Process
          </h2>
          <div className="space-y-8">
            {inspectionSteps.map((step, index) => (
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

      {/* Inspection Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Home Inspection Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {inspectionTips.map((tip, index) => {
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

      {/* Inspection Types */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Types of Home Inspections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {inspectionTypes.map((type, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{type.type}</h3>
                  <span className="bg-[#FFD43B]/10 text-[#FFD43B] px-3 py-1 rounded-full text-sm font-medium">
                    {type.cost}
                  </span>
                </div>
                <p className="text-[#A5A5A5] mb-4">{type.scope}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Includes:</h4>
                  <ul className="space-y-1">
                    {type.includes.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">Timeline: {type.timeline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Issues */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Common Inspection Findings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {commonIssues.map((issue, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{issue.issue}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    issue.severity === 'High'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/20'
                  }`}>
                    {issue.severity} Priority
                  </span>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Common Examples:</h4>
                  <ul className="space-y-1">
                    {issue.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <Wrench className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                    <p className="text-[#FFD43B] text-sm font-medium">Typical Cost: {issue.typicalCost}</p>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm font-medium">{issue.urgency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-medium mb-2">Safety First</p>
            <p className="text-[#A5A5A5]">
              Always prioritize safety issues like electrical hazards, structural problems, and environmental concerns. 
              These should be addressed immediately, regardless of cost.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your inspection records?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your home inspection reports, contractor estimates, and repair documentation organized with FamilyCircle Secure.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-inspection-records"
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