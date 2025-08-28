import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Users, CheckCircle, Calendar, Phone, Shield, ArrowRight, Clock, Home, AlertCircle, Star, UserCheck, MapPin } from "lucide-react";

export default function StartingFamilyChildcareInformation() {
  const childcareCategories = [
    {
      category: "Childcare Provider Information",
      description: "Contact details and credentials of all caregivers",
      importance: "Critical",
      information: ["Daycare center or provider contact info", "License and certification numbers", "Staff qualifications and background checks", "Operating hours and policies"],
      tips: "Verify all licenses and certifications are current and check references from other families"
    },
    {
      category: "Emergency Contacts & Procedures",
      description: "Essential emergency information and protocols",
      importance: "Critical", 
      information: ["Primary and backup emergency contacts", "Medical emergency procedures", "Authorized pickup persons list", "Emergency evacuation plans"],
      tips: "Keep emergency contact information updated and ensure all authorized persons have proper ID"
    },
    {
      category: "Daily Care Instructions",
      description: "Specific care needs and routine information",
      importance: "High",
      information: ["Feeding schedules and dietary restrictions", "Nap times and sleep preferences", "Medication administration instructions", "Comfort items and special needs"],
      tips: "Provide detailed written instructions to ensure consistency in your child's care routine"
    },
    {
      category: "Medical Information", 
      description: "Health records and medical care authorization",
      importance: "High",
      information: ["Immunization records", "Allergy and medical condition information", "Medication authorization forms", "Pediatrician contact information"],
      tips: "Keep immunization records current and provide clear medication instructions with dosage information"
    },
    {
      category: "Communication Preferences",
      description: "How to stay connected throughout the day",
      importance: "Medium",
      information: ["Daily report preferences", "Photo/video sharing policies", "Communication app access", "Parent-teacher conference scheduling"],
      tips: "Establish clear communication expectations to stay informed about your child's daily activities"
    },
    {
      category: "Backup Care Plans",
      description: "Alternative care arrangements for unexpected situations",
      importance: "Medium",
      information: ["Backup childcare provider contacts", "Family member emergency care", "Sick child care policies", "School closure contingency plans"],
      tips: "Have multiple backup options available for illness, emergencies, or unexpected closures"
    }
  ];

  const setupSteps = [
    {
      step: 1,
      title: "Research and Select Provider",
      description: "Find and evaluate childcare providers that meet your family's needs",
      timeframe: "2-6 months before needing care"
    },
    {
      step: 2, 
      title: "Complete Enrollment Process",
      description: "Submit applications, provide required documentation, and secure your spot",
      timeframe: "1-3 months before start date"
    },
    {
      step: 3,
      title: "Prepare Care Information",
      description: "Organize all medical, emergency, and care instruction documents", 
      timeframe: "2-4 weeks before start date"
    },
    {
      step: 4,
      title: "Orientation and Introduction",
      description: "Complete orientation process and introduce child to new environment",
      timeframe: "1-2 weeks before start date"
    },
    {
      step: 5,
      title: "Ongoing Communication Setup",
      description: "Establish regular communication routines and feedback processes",
      timeframe: "First week of care"
    }
  ];

  const organizationTips = [
    {
      category: "Accessibility",
      icon: Phone,
      tip: "Keep essential information easily accessible",
      details: "Create a quick reference sheet with emergency contacts, medical info, and daily routine details."
    },
    {
      category: "Regular Updates", 
      icon: Calendar,
      tip: "Update information regularly as needs change",
      details: "Review and update medical information, emergency contacts, and care instructions periodically."
    },
    {
      category: "Communication",
      icon: Users,
      tip: "Maintain open communication with providers",
      details: "Regular check-ins help ensure your child's needs are being met and address any concerns promptly."
    }
  ];

  const providerTypes = [
    {
      type: "Family Daycare",
      characteristics: ["Home-based setting", "Smaller group sizes", "Mixed age groups", "More flexible arrangements"],
      considerations: ["Licensing requirements", "Home safety standards", "Provider qualifications", "Backup care plans"],
      bestFor: "Families seeking intimate, home-like environment"
    },
    {
      type: "Daycare Centers",
      characteristics: ["Licensed facilities", "Structured programs", "Age-appropriate classrooms", "Professional staff"],
      considerations: ["Licensing and accreditation", "Staff turnover rates", "Safety protocols", "Educational curriculum"],
      bestFor: "Families wanting structured learning environment"
    },
    {
      type: "Nannies/Au Pairs", 
      characteristics: ["One-on-one care", "In-home convenience", "Flexible scheduling", "Customized attention"],
      considerations: ["Background checks", "Legal employment requirements", "Backup coverage", "Clear contracts"],
      bestFor: "Families needing flexible, personalized care"
    },
    {
      type: "Relatives/Family Care",
      characteristics: ["Trusted family members", "Familiar environment", "Flexible arrangements", "Family values alignment"],
      considerations: ["Clear expectations", "Emergency procedures", "Fair compensation", "Relationship boundaries"],
      bestFor: "Families with available, willing family members"
    }
  ];

  const safetyChecklist = [
    {
      area: "Physical Environment",
      items: ["Child-proofed spaces", "Safe sleep areas", "Clean facilities", "Secure outdoor areas", "Emergency exits clearly marked"]
    },
    {
      area: "Staff Qualifications",
      items: ["Background checks completed", "CPR/First Aid certified", "Early childhood education training", "Ongoing professional development"]
    },
    {
      area: "Health & Safety Policies",
      items: ["Sick child policies", "Medication administration procedures", "Allergy management protocols", "Emergency response plans"]
    },
    {
      area: "Communication Systems",
      items: ["Daily activity reports", "Incident reporting procedures", "Parent communication methods", "Regular parent-provider meetings"]
    }
  ];

  const emergencyPreparedness = [
    {
      scenario: "Medical Emergency",
      preparation: ["Current medical information on file", "Signed medical treatment authorization", "Emergency contact numbers updated", "Insurance information available"],
      contacts: "Pediatrician, poison control, emergency contacts"
    },
    {
      scenario: "Natural Disaster/Emergency",
      preparation: ["Emergency evacuation plan known", "Multiple emergency contacts", "Child comfort items available", "Communication plan established"],
      contacts: "Local emergency services, family emergency contacts"
    },
    {
      scenario: "Provider Illness/Absence",
      preparation: ["Backup care arrangements", "Alternative provider contacts", "Child's routine information portable", "Emergency care authorization"],
      contacts: "Backup providers, family members, emergency childcare services"
    }
  ];

  const transitionTips = [
    {
      phase: "Before Starting",
      tips: ["Visit the provider with your child", "Practice separation gradually", "Prepare comfort items", "Discuss the transition positively"],
      timeline: "1-2 weeks before start"
    },
    {
      phase: "First Week",
      tips: ["Start with shorter days if possible", "Maintain consistent routines", "Communicate frequently with provider", "Be patient with adjustment"],
      timeline: "Days 1-7"
    },
    {
      phase: "First Month", 
      tips: ["Monitor child's adjustment", "Address concerns promptly", "Build relationship with provider", "Establish communication rhythm"],
      timeline: "Weeks 2-4"
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
              <Users className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Childcare Information
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize all your childcare provider information, emergency contacts, and care instructions. 
              Keep everything your caregivers need to provide the best care for your child.
            </p>
          </div>
        </div>
      </section>

      {/* Childcare Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Childcare Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {childcareCategories.map((category, index) => (
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
                  <h4 className="text-sm font-medium text-white mb-2">Key Information:</h4>
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

      {/* Setup Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Childcare Setup Process
          </h2>
          <div className="space-y-8">
            {setupSteps.map((step, index) => (
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

      {/* Organization Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Information Organization Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {organizationTips.map((tip, index) => {
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

      {/* Provider Types */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Types of Childcare Providers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {providerTypes.map((provider, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{provider.type}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Characteristics:</h4>
                  <ul className="space-y-1 mb-4">
                    {provider.characteristics.map((char, charIndex) => (
                      <li key={charIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {char}
                      </li>
                    ))}
                  </ul>
                  <h4 className="text-sm font-medium text-white mb-2">Key Considerations:</h4>
                  <ul className="space-y-1 mb-4">
                    {provider.considerations.map((consideration, consIndex) => (
                      <li key={consIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <AlertCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {consideration}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">Best For: {provider.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Checklist */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Childcare Safety Checklist
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {safetyChecklist.map((area, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{area.area}</h3>
                <ul className="space-y-2">
                  {area.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-[#A5A5A5]">
                      <Shield className="w-4 h-4 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Preparedness */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Emergency Preparedness
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {emergencyPreparedness.map((emergency, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{emergency.scenario}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Preparation Needed:</h4>
                  <ul className="space-y-1 mb-4">
                    {emergency.preparation.map((prep, prepIndex) => (
                      <li key={prepIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {prep}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm font-medium">Key Contacts: {emergency.contacts}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transition Tips */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Childcare Transition Tips
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {transitionTips.map((phase, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{phase.phase}</h3>
                  <span className="bg-[#FFD43B]/10 text-[#FFD43B] px-3 py-1 rounded-full text-sm font-medium">
                    {phase.timeline}
                  </span>
                </div>
                <ul className="space-y-2">
                  {phase.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-center text-[#A5A5A5] text-sm">
                      <Star className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <UserCheck className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium mb-2">Communication is Key</p>
            <p className="text-[#A5A5A5]">
              Maintain open, regular communication with your childcare provider. Share concerns, ask questions, 
              and work together to ensure your child has the best possible care experience.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your childcare information?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your childcare provider information, emergency contacts, and care instructions organized with FamilyVault.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-childcare-info"
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