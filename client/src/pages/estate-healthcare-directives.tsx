import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Heart, CheckCircle, Calendar, Stethoscope, Shield, ArrowRight, Clock, Users, AlertCircle, FileText, UserCheck, Activity } from "lucide-react";

export default function EstateHealthcareDirectives() {
  const directiveCategories = [
    {
      category: "Living Will",
      description: "Instructions for end-of-life medical care preferences",
      importance: "Critical",
      information: ["Life support preferences", "Pain management wishes", "Organ donation decisions", "DNR (Do Not Resuscitate) orders"],
      tips: "Be specific about your wishes and discuss them with family and healthcare providers in advance"
    },
    {
      category: "Healthcare Power of Attorney",
      description: "Designates someone to make medical decisions on your behalf",
      importance: "Critical", 
      information: ["Healthcare proxy appointment", "Decision-making authority scope", "Alternative agent designations", "Effective conditions and limitations"],
      tips: "Choose someone who understands your values and will advocate for your wishes"
    },
    {
      category: "HIPAA Authorization",
      description: "Allows designated individuals access to your medical information",
      importance: "High",
      information: ["Authorized individuals list", "Scope of information sharing", "Healthcare provider notifications", "Duration and revocation terms"],
      tips: "Include multiple trusted individuals to ensure someone can access your medical information"
    },
    {
      category: "Physician Orders", 
      description: "Specific medical orders from your physician",
      importance: "High",
      information: ["POLST (Physician Orders for Life-Sustaining Treatment)", "Medical treatment preferences", "Emergency care instructions", "Comfort care directives"],
      tips: "Work with your physician to complete these orders based on your current health status"
    },
    {
      category: "Mental Health Directives",
      description: "Instructions for psychiatric treatment preferences",
      importance: "Medium",
      information: ["Preferred mental health treatments", "Medication preferences", "Hospitalization wishes", "Emergency psychiatric contacts"],
      tips: "Important for individuals with mental health conditions or strong preferences about psychiatric care"
    },
    {
      category: "Healthcare Communication",
      description: "Instructions for sharing medical information with family",
      importance: "Medium",
      information: ["Family notification preferences", "Medical update procedures", "Decision-making involvement", "Privacy considerations"],
      tips: "Clarify who should be informed about your medical condition and involved in care decisions"
    }
  ];

  const planningSteps = [
    {
      step: 1,
      title: "Consider Your Values",
      description: "Reflect on your beliefs about medical care, quality of life, and end-of-life preferences",
      timeframe: "Week 1"
    },
    {
      step: 2, 
      title: "Choose Your Healthcare Agent",
      description: "Select a trusted person to make healthcare decisions if you become unable to do so",
      timeframe: "Week 1"
    },
    {
      step: 3,
      title: "Complete Legal Documents",
      description: "Work with attorney or use state-approved forms to create your healthcare directives", 
      timeframe: "Week 2"
    },
    {
      step: 4,
      title: "Discuss with Family & Doctors",
      description: "Share your directives and preferences with family members and healthcare providers",
      timeframe: "Week 3"
    },
    {
      step: 5,
      title: "Distribute & Update",
      description: "Ensure copies are accessible and update documents as your preferences change",
      timeframe: "Ongoing"
    }
  ];

  const healthcareTips = [
    {
      category: "Clear Communication",
      icon: Users,
      tip: "Discuss your wishes openly with family and healthcare providers",
      details: "Having conversations about your preferences helps ensure everyone understands your wishes."
    },
    {
      category: "Accessible Documents", 
      icon: FileText,
      tip: "Keep healthcare directives easily accessible",
      details: "Store copies where family and medical professionals can quickly access them during emergencies."
    },
    {
      category: "Regular Updates",
      icon: Calendar,
      tip: "Review and update directives regularly",
      details: "Your healthcare preferences may change over time or due to changes in your health condition."
    }
  ];

  const directiveComponents = [
    {
      component: "Treatment Preferences",
      details: ["Life-sustaining treatment wishes", "Artificial nutrition and hydration", "Mechanical ventilation preferences", "Dialysis and other interventions"]
    },
    {
      component: "Agent Authority",
      details: ["Medical decision-making scope", "Treatment consent authority", "Access to medical records", "Healthcare provider communication"]
    },
    {
      component: "Personal Values",
      details: ["Quality of life considerations", "Religious or spiritual beliefs", "Cultural preferences", "Family involvement wishes"]
    },
    {
      component: "Special Situations",
      details: ["Pregnancy considerations", "Experimental treatments", "Organ donation preferences", "Autopsy decisions"]
    }
  ];

  const commonScenarios = [
    {
      scenario: "Terminal Illness",
      considerations: ["Comfort care vs. aggressive treatment", "Hospice care preferences", "Pain management priorities", "Family time and environment"]
    },
    {
      scenario: "Permanent Unconsciousness",
      considerations: ["Life support continuation", "Feeding tube decisions", "Length of trial period", "Quality of life factors"]
    },
    {
      scenario: "Severe Dementia",
      considerations: ["Treatment for complications", "Artificial nutrition decisions", "Hospitalization preferences", "Comfort care focus"]
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
              <Heart className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Healthcare Directives
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize your healthcare directives and advance medical instructions. Ensure your 
              medical preferences are clearly documented and accessible to family and healthcare providers.
            </p>
          </div>
        </div>
      </section>

      {/* Healthcare Directives Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Healthcare Directive Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {directiveCategories.map((category, index) => (
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

      {/* Healthcare Directive Planning Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Healthcare Directive Planning Process
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

      {/* Healthcare Directive Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Healthcare Directive Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {healthcareTips.map((tip, index) => {
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

      {/* Healthcare Directive Components */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Key Healthcare Directive Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {directiveComponents.map((component, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{component.component}</h3>
                <ul className="space-y-2">
                  {component.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-[#A5A5A5]">
                      <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Healthcare Scenarios */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Common Healthcare Decision Scenarios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {commonScenarios.map((scenario, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{scenario.scenario}</h3>
                <ul className="space-y-2">
                  {scenario.considerations.map((consideration, considerationIndex) => (
                    <li key={considerationIndex} className="flex items-center text-[#A5A5A5] text-sm">
                      <Activity className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {consideration}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <Stethoscope className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium mb-2">Important Reminder</p>
            <p className="text-[#A5A5A5]">
              Healthcare directives should reflect your personal values and beliefs. Discuss these scenarios 
              with your family and healthcare providers to ensure everyone understands your wishes.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your healthcare directives?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your advance healthcare directives and medical preferences secure and organized with FamilyVault.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-healthcare-directives"
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