import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Scale, CheckCircle, Calendar, FileText, Shield, ArrowRight, Clock, Users, AlertCircle, PenTool, Award, Building } from "lucide-react";

export default function StartingFamilyLegalDocuments() {
  const legalCategories = [
    {
      category: "Wills & Estate Planning",
      description: "Essential estate planning documents for new parents",
      importance: "Critical",
      information: ["Updated wills with guardianship provisions", "Power of attorney documents", "Healthcare directives", "Beneficiary designations"],
      tips: "Update all estate planning documents immediately after having children to include guardianship provisions"
    },
    {
      category: "Child-Related Legal Documents",
      description: "Legal documents specifically for your child",
      importance: "Critical", 
      information: ["Birth certificate and copies", "Social Security documentation", "Passport applications and documents", "Medical consent forms"],
      tips: "Obtain multiple certified copies of birth certificates - you'll need them for many future applications"
    },
    {
      category: "Custody & Guardianship Documents",
      description: "Legal arrangements for child care and custody",
      importance: "High",
      information: ["Custody agreements (if applicable)", "Temporary guardianship forms", "Emergency care authorization", "Parental consent documentation"],
      tips: "Even married couples should have temporary guardianship forms for emergency situations"
    },
    {
      category: "Insurance & Benefits Documentation", 
      description: "Legal documents related to insurance and benefits",
      importance: "High",
      information: ["Life insurance policies and beneficiaries", "Health insurance enrollment", "Disability insurance updates", "Retirement account beneficiaries"],
      tips: "Update all beneficiary designations to include your children and ensure adequate life insurance coverage"
    },
    {
      category: "Trust & Financial Planning Documents",
      description: "Legal documents for financial planning and trusts",
      importance: "Medium",
      information: ["Trust documents and agreements", "UTMA/UGMA account documentation", "Education savings account (529) plans", "Financial planning agreements"],
      tips: "Consider establishing trusts or education savings accounts to provide for your child's future financial needs"
    },
    {
      category: "Family Legal Agreements",
      description: "Agreements and contracts related to family matters",
      importance: "Medium",
      information: ["Parenting agreements", "Property ownership documents", "Family business documentation", "Prenuptial/postnuptial agreements updates"],
      tips: "Review and update any family agreements to address how children are affected by existing arrangements"
    }
  ];

  const documentTimeline = [
    {
      step: 1,
      title: "Immediate Priority Documents",
      description: "Handle critical legal documents within the first month after birth",
      timeframe: "0-4 weeks after birth"
    },
    {
      step: 2, 
      title: "Estate Planning Updates",
      description: "Update wills, trusts, and estate planning documents to include children",
      timeframe: "1-3 months after birth"
    },
    {
      step: 3,
      title: "Insurance & Benefits Review",
      description: "Update all insurance policies and beneficiary designations", 
      timeframe: "1-6 months after birth"
    },
    {
      step: 4,
      title: "Long-term Planning Documents",
      description: "Establish trusts, education savings, and long-term financial planning",
      timeframe: "3-12 months after birth"
    },
    {
      step: 5,
      title: "Regular Review & Updates",
      description: "Annual review and updates of all legal documents as family grows",
      timeframe: "Annually thereafter"
    }
  ];

  const legalTips = [
    {
      category: "Professional Guidance",
      icon: Scale,
      tip: "Work with qualified legal professionals",
      details: "Estate planning and family law can be complex - invest in professional legal advice to ensure documents are properly executed."
    },
    {
      category: "Document Security", 
      icon: Shield,
      tip: "Store legal documents securely with easy access",
      details: "Keep originals in fireproof safes and maintain accessible copies for everyday needs and emergencies."
    },
    {
      category: "Regular Updates",
      icon: Calendar,
      tip: "Review and update documents regularly",
      details: "Life changes require document updates - review annually and update when major life events occur."
    }
  ];

  const criticalDocuments = [
    {
      document: "Updated Will with Guardianship Provisions",
      urgency: "Critical - Complete within 3 months",
      purpose: "Establishes who will care for your children if something happens to you",
      requirements: ["Legal guardianship nominations", "Asset distribution instructions", "Executor designation", "Proper witnessing and notarization"],
      consequences: "Without a will, the court decides guardianship and asset distribution"
    },
    {
      document: "Life Insurance Policy Updates",
      urgency: "Critical - Complete within 1 month",
      purpose: "Provides financial security for your children's care and future",
      requirements: ["Adequate coverage amount", "Children named as beneficiaries", "Trustee designated if needed", "Premium payment arrangements"],
      consequences: "Insufficient coverage could leave children financially vulnerable"
    },
    {
      document: "Healthcare Directives & Medical Power of Attorney",
      urgency: "High - Complete within 6 months",
      purpose: "Ensures medical decisions align with your wishes if you're incapacitated",
      requirements: ["Healthcare proxy designation", "Medical treatment preferences", "Life support decisions", "Organ donation preferences"],
      consequences: "Family may face difficult medical decisions without clear guidance"
    },
    {
      document: "Financial Power of Attorney",
      urgency: "High - Complete within 6 months", 
      purpose: "Allows designated person to manage finances if you're unable",
      requirements: ["Trusted agent designation", "Scope of authority defined", "Activation conditions specified", "Backup agent named"],
      consequences: "Financial matters could be frozen without proper authorization"
    }
  ];

  const stateLegalRequirements = [
    {
      category: "Will Requirements",
      variations: ["Witness requirements vary by state", "Some states allow handwritten wills", "Age and mental capacity requirements", "Self-proving affidavit options"],
      advice: "Consult local attorney for state-specific requirements"
    },
    {
      category: "Guardianship Laws",
      variations: ["Nomination vs. appointment processes", "Court approval requirements", "Guardian qualification standards", "Temporary vs. permanent arrangements"],
      advice: "Understand your state's guardianship procedures and requirements"
    },
    {
      category: "Trust Regulations",
      variations: ["Trust taxation rules", "Trustee qualification requirements", "Distribution regulations", "State trust law variations"],
      advice: "Work with estate planning attorney familiar with your state's trust laws"
    },
    {
      category: "Child Protection Laws",
      variations: ["Custody and visitation standards", "Child support obligations", "Parental rights termination", "Interstate custody issues"],
      advice: "Be aware of your state's child protection and custody laws"
    }
  ];

  const documentChecklist = [
    {
      timing: "Before Birth (If Possible)",
      documents: ["Review existing wills and estate plans", "Update life insurance beneficiaries", "Review financial accounts", "Consider establishing trusts"],
      priority: "Preparation phase"
    },
    {
      timing: "First Month After Birth",
      documents: ["Order multiple birth certificates", "Apply for Social Security Number", "Add child to health insurance", "Update emergency contacts"],
      priority: "Immediate essentials"
    },
    {
      timing: "First 3 Months",
      documents: ["Update will with guardianship provisions", "Increase life insurance coverage", "Create healthcare directives", "Update retirement beneficiaries"],
      priority: "Critical legal protections"
    },
    {
      timing: "First Year",
      documents: ["Establish education savings accounts", "Consider trust arrangements", "Review property ownership", "Update family legal agreements"],
      priority: "Long-term planning"
    }
  ];

  const professionalGuidance = [
    {
      professional: "Estate Planning Attorney",
      when: "Essential for will, trust, and estate planning documents",
      services: ["Will drafting and updates", "Trust establishment", "Estate tax planning", "Guardianship arrangements"],
      selection: "Choose attorney specializing in estate planning and family law"
    },
    {
      professional: "Family Law Attorney",
      when: "Needed for custody, adoption, or complex family situations",
      services: ["Custody agreements", "Adoption procedures", "Parental rights", "Family dispute resolution"],
      selection: "Look for experience with your specific family law needs"
    },
    {
      professional: "Financial Planner/Advisor",
      when: "Helpful for insurance and financial planning coordination",
      services: ["Life insurance analysis", "Education funding strategies", "Retirement planning updates", "Tax-efficient planning"],
      selection: "Find advisor with experience in family financial planning"
    },
    {
      professional: "Tax Professional",
      when: "Important for trust, education savings, and tax planning",
      services: ["Tax implications of trusts", "Education tax benefits", "Estate tax planning", "Annual tax preparation"],
      selection: "Choose professional familiar with family tax situations"
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
                Legal Documents
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize essential legal documents for your growing family. 
              From wills and custody papers to family legal agreements, keep all important legal documentation secure and accessible.
            </p>
          </div>
        </div>
      </section>

      {/* Legal Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Legal Document Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {legalCategories.map((category, index) => (
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

      {/* Document Timeline */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Legal Document Timeline
          </h2>
          <div className="space-y-8">
            {documentTimeline.map((step, index) => (
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

      {/* Legal Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Legal Document Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {legalTips.map((tip, index) => {
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

      {/* Critical Documents */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Critical Legal Documents for New Parents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {criticalDocuments.map((doc, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{doc.document}</h3>
                  <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-medium border border-red-500/20">
                    {doc.urgency.split(' - ')[0]}
                  </span>
                </div>
                <p className="text-[#A5A5A5] mb-4">{doc.purpose}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Requirements:</h4>
                  <ul className="space-y-1 mb-4">
                    {doc.requirements.map((requirement, reqIndex) => (
                      <li key={reqIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm font-medium">Risk: {doc.consequences}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* State Legal Requirements */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            State-Specific Legal Considerations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stateLegalRequirements.map((requirement, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{requirement.category}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">State Variations:</h4>
                  <ul className="space-y-1 mb-4">
                    {requirement.variations.map((variation, varIndex) => (
                      <li key={varIndex} className="flex items-start text-[#A5A5A5] text-sm">
                        <span className="text-[#FFD43B] mr-2 mt-1">•</span>
                        {variation}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">{requirement.advice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Document Checklist */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Legal Document Checklist
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {documentChecklist.map((phase, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{phase.timing}</h3>
                  <span className="bg-[#FFD43B]/10 text-[#FFD43B] px-3 py-1 rounded-full text-sm font-medium">
                    {phase.priority}
                  </span>
                </div>
                <ul className="space-y-2">
                  {phase.documents.map((doc, docIndex) => (
                    <li key={docIndex} className="flex items-center text-[#A5A5A5]">
                      <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Guidance */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Professional Legal Guidance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {professionalGuidance.map((professional, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{professional.professional}</h3>
                <p className="text-[#A5A5A5] mb-4">{professional.when}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Services Provided:</h4>
                  <ul className="space-y-1 mb-4">
                    {professional.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <Building className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">Selection Tip: {professional.selection}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <Award className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium mb-2">Investment in Peace of Mind</p>
            <p className="text-[#A5A5A5]">
              Proper legal documentation is an investment in your family's security and peace of mind. 
              Work with qualified professionals to ensure your documents meet legal requirements and protect your family.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your family legal documents?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your wills, custody papers, and family legal documentation secure and organized with FamilyVault.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-legal-docs"
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