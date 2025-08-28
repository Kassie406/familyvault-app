import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Shield, CheckCircle, Calendar, Users, FileText, ArrowRight, Clock, Heart, AlertCircle, Scale, UserCheck, PenTool } from "lucide-react";

export default function StartingFamilyGuardianshipPlanning() {
  const guardianshipCategories = [
    {
      category: "Guardian Selection & Documentation",
      description: "Choosing and documenting guardians for your children",
      importance: "Critical",
      information: ["Primary and backup guardian selections", "Guardian consent and acceptance forms", "Guardian information and qualifications", "Relationship to children documentation"],
      tips: "Choose guardians who share your values, have financial stability, and are willing to take on this responsibility"
    },
    {
      category: "Legal Documentation",
      description: "Formal legal documents establishing guardianship arrangements",
      importance: "Critical", 
      information: ["Will with guardianship provisions", "Guardianship nomination forms", "Legal custody arrangements", "Court filing documentation"],
      tips: "Work with an attorney to ensure guardianship documents are legally valid in your state"
    },
    {
      category: "Financial Planning",
      description: "Financial resources and instructions for child care",
      importance: "High",
      information: ["Life insurance beneficiaries", "Trust fund establishment", "Financial instruction letters", "Education funding plans"],
      tips: "Ensure adequate life insurance coverage and consider establishing trusts for children's financial security"
    },
    {
      category: "Care Instructions", 
      description: "Detailed information about children's needs and preferences",
      importance: "High",
      information: ["Medical history and healthcare needs", "Educational preferences and records", "Daily routine and special needs", "Religious and cultural guidance"],
      tips: "Provide comprehensive care instructions to help guardians maintain continuity in your children's lives"
    },
    {
      category: "Emergency Preparedness",
      description: "Immediate care arrangements for unexpected situations",
      importance: "Medium",
      information: ["Temporary custody arrangements", "Emergency guardian contacts", "Medical authorization forms", "School pickup authorization"],
      tips: "Establish temporary care arrangements with trusted family or friends for emergency situations"
    },
    {
      category: "Regular Reviews & Updates",
      description: "Ongoing maintenance of guardianship plans",
      importance: "Medium",
      information: ["Annual plan reviews", "Guardian availability updates", "Children's changing needs", "Legal requirement changes"],
      tips: "Review guardianship plans annually and update as your family situation and children's needs change"
    }
  ];

  const planningSteps = [
    {
      step: 1,
      title: "Guardian Selection Process",
      description: "Identify potential guardians and have detailed discussions about responsibilities",
      timeframe: "Start as soon as possible"
    },
    {
      step: 2, 
      title: "Legal Consultation",
      description: "Work with an attorney to create proper legal documentation",
      timeframe: "Within 3 months of selection"
    },
    {
      step: 3,
      title: "Financial Planning",
      description: "Establish financial resources and insurance coverage for children's care", 
      timeframe: "Concurrent with legal work"
    },
    {
      step: 4,
      title: "Documentation Creation",
      description: "Create comprehensive care instructions and information packages",
      timeframe: "Within 6 months"
    },
    {
      step: 5,
      title: "Regular Updates",
      description: "Review and update plans annually or when circumstances change",
      timeframe: "Ongoing annually"
    }
  ];

  const planningTips = [
    {
      category: "Guardian Selection",
      icon: Users,
      tip: "Choose guardians based on values alignment, not just family ties",
      details: "Consider who would raise your children with similar values, discipline style, and life philosophy."
    },
    {
      category: "Financial Security", 
      icon: Shield,
      tip: "Ensure adequate financial resources for children's care",
      details: "Consider life insurance, trusts, and other financial tools to provide for your children's needs."
    },
    {
      category: "Communication",
      icon: Heart,
      tip: "Maintain open communication with chosen guardians",
      details: "Keep guardians informed about your children's lives, needs, and any changes to your wishes."
    }
  ];

  const guardianConsiderations = [
    {
      factor: "Values & Lifestyle Compatibility",
      questions: ["Do they share your parenting philosophy?", "Are they willing to respect your religious/cultural preferences?", "Do they have a stable lifestyle?", "How do they discipline children?"],
      importance: "Ensures continuity in child-rearing approach"
    },
    {
      factor: "Financial Stability & Willingness",
      questions: ["Can they financially support additional children?", "Are they willing to accept this responsibility?", "Do they understand the long-term commitment?", "Have they discussed this with their spouse/family?"],
      importance: "Critical for providing stable environment"
    },
    {
      factor: "Age & Health Considerations",
      questions: ["Are they young enough to care for children until adulthood?", "Do they have any health issues that could affect care?", "What are their long-term life plans?", "Do they have their own children?"],
      importance: "Ensures ability to provide long-term care"
    },
    {
      factor: "Location & Practical Matters",
      questions: ["Where do they live geographically?", "How would this affect your children's schooling?", "Are they close to extended family?", "What is their community like?"],
      importance: "Affects children's adjustment and support system"
    }
  ];

  const legalRequirements = [
    {
      document: "Will with Guardianship Provisions",
      purpose: "Legal designation of guardians",
      requirements: ["Must be properly executed according to state law", "Should name primary and backup guardians", "Must be witnessed and notarized as required", "Should be reviewed by attorney"],
      updates: "Review annually and update as needed"
    },
    {
      document: "Guardian Consent Forms",
      purpose: "Confirmation that guardians accept responsibility",
      requirements: ["Signed acknowledgment by potential guardians", "Understanding of responsibilities outlined", "Contact information kept current", "Backup guardians also documented"],
      updates: "Update when guardians change or circumstances change"
    },
    {
      document: "Financial Instructions",
      purpose: "Guidance for managing children's financial needs",
      requirements: ["Life insurance beneficiaries designated", "Trust documents if applicable", "Education funding instructions", "Budget guidance for child-rearing costs"],
      updates: "Review when financial circumstances change"
    }
  ];

  const careInstructionTemplates = [
    {
      category: "Medical & Health Information",
      includes: ["Current physicians and specialists", "Medical history and conditions", "Medication requirements", "Insurance information", "Emergency medical contacts"],
      tips: "Include specific instructions for any chronic conditions or special medical needs"
    },
    {
      category: "Educational Preferences",
      includes: ["School information and contacts", "Educational philosophy preferences", "Extracurricular activities", "Special learning needs", "Academic goals and expectations"],
      tips: "Provide guidance on educational choices that align with your values"
    },
    {
      category: "Daily Life & Routine",
      includes: ["Daily schedules and routines", "Discipline approaches and limits", "Favorite activities and interests", "Comfort items and special needs", "Friend and social connections"],
      tips: "Help guardians maintain consistency in your children's daily life"
    },
    {
      category: "Values & Beliefs",
      includes: ["Religious or spiritual practices", "Cultural traditions and celebrations", "Family values and principles", "Important relationships to maintain", "Life lessons you want emphasized"],
      tips: "Provide guidance on raising children according to your beliefs and values"
    }
  ];

  const emergencyScenarios = [
    {
      scenario: "Temporary Incapacitation",
      preparation: ["Temporary custody forms completed", "Emergency guardian designated", "Medical authorization forms available", "School pickup authorization current"],
      duration: "Short-term (days to weeks)"
    },
    {
      scenario: "Extended Absence/Illness",
      preparation: ["Extended custody arrangements", "Financial access established", "Care instruction documents available", "Regular check-in schedule with children"],
      duration: "Medium-term (weeks to months)"
    },
    {
      scenario: "Permanent Guardianship Needed",
      preparation: ["Legal guardianship documents in place", "Financial resources activated", "Comprehensive care instructions provided", "Court processes initiated if needed"],
      duration: "Long-term (permanent)"
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
                Guardianship Planning
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Plan for your children's future by establishing guardianship arrangements. 
              Document your wishes and ensure your children will be cared for according to your values and preferences.
            </p>
          </div>
        </div>
      </section>

      {/* Guardianship Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Guardianship Planning Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guardianshipCategories.map((category, index) => (
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

      {/* Planning Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Guardianship Planning Process
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

      {/* Planning Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Guardianship Planning Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {planningTips.map((tip, index) => {
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

      {/* Guardian Selection Criteria */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Guardian Selection Considerations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {guardianConsiderations.map((consideration, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{consideration.factor}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Key Questions to Consider:</h4>
                  <ul className="space-y-1 mb-4">
                    {consideration.questions.map((question, questionIndex) => (
                      <li key={questionIndex} className="flex items-start text-[#A5A5A5] text-sm">
                        <span className="text-[#FFD43B] mr-2 mt-1">•</span>
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">Why Important: {consideration.importance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Requirements */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Legal Documentation Requirements
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {legalRequirements.map((requirement, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{requirement.document}</h3>
                <p className="text-[#A5A5A5] mb-4">{requirement.purpose}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Requirements:</h4>
                  <ul className="space-y-1 mb-4">
                    {requirement.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <Scale className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-blue-400 text-sm font-medium">{requirement.updates}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care Instructions Template */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Care Instructions Template
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {careInstructionTemplates.map((template, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{template.category}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Should Include:</h4>
                  <ul className="space-y-1 mb-4">
                    {template.includes.map((include, includeIndex) => (
                      <li key={includeIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {include}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm">{template.tips}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Scenarios */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Emergency Scenario Planning
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {emergencyScenarios.map((scenario, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{scenario.scenario}</h3>
                  <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-sm font-medium border border-red-500/20">
                    {scenario.duration}
                  </span>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Preparation Needed:</h4>
                  <ul className="space-y-1">
                    {scenario.preparation.map((prep, prepIndex) => (
                      <li key={prepIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <AlertCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {prep}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6 text-center">
            <PenTool className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-medium mb-2">Important Legal Note</p>
            <p className="text-[#A5A5A5]">
              Guardianship laws vary by state. Consult with a qualified attorney in your state to ensure 
              your guardianship plans meet all legal requirements and will be enforceable when needed.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your guardianship planning?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your guardianship documents, care instructions, and planning information secure with FamilyVault.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-guardianship-planning"
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