import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Heart, CheckCircle, Calendar, Pill, Shield, ArrowRight, Clock, Users, AlertCircle, Phone, FileText, Activity } from "lucide-react";

export default function DisasterMedicalInformation() {
  const medicalCategories = [
    {
      category: "Current Medications",
      description: "Complete medication list with dosages and instructions",
      importance: "Critical",
      information: ["Prescription medications and dosages", "Over-the-counter medications", "Vitamins and supplements", "Medication allergies and reactions"],
      tips: "Include generic and brand names, prescribing doctors, and pharmacy information for each medication"
    },
    {
      category: "Medical Conditions",
      description: "Chronic conditions and ongoing health issues",
      importance: "Critical", 
      information: ["Chronic diseases (diabetes, hypertension, etc.)", "Mental health conditions", "Previous surgeries and procedures", "Current treatment plans"],
      tips: "Include onset dates, severity levels, and current management strategies for each condition"
    },
    {
      category: "Allergies & Reactions",
      description: "All known allergies and adverse reactions",
      importance: "Critical",
      information: ["Drug allergies and reactions", "Food allergies", "Environmental allergies", "Latex and other material allergies"],
      tips: "Specify reaction types (rash, anaphylaxis, etc.) and severity for emergency responders"
    },
    {
      category: "Healthcare Providers", 
      description: "Complete medical team contact information",
      importance: "High",
      information: ["Primary care physician", "Specialists and therapists", "Preferred hospital/emergency room", "Pharmacy contact information"],
      tips: "Include after-hours contacts and backup providers for continuity of care"
    },
    {
      category: "Medical Devices & Equipment",
      description: "Medical devices and assistive equipment",
      importance: "High",
      information: ["Pacemakers, insulin pumps, etc.", "Wheelchairs and mobility aids", "CPAP machines and oxygen", "Prosthetics and orthotics"],
      tips: "Include model numbers, settings, and backup power requirements for essential devices"
    },
    {
      category: "Emergency Medical Plans",
      description: "Specific emergency protocols and preferences",
      importance: "Medium",
      information: ["Emergency action plans", "Hospital preferences", "Advanced directives", "Emergency medication protocols"],
      tips: "Include copies of advance directives and discuss plans with family members"
    }
  ];

  const organizationSteps = [
    {
      step: 1,
      title: "Collect Medical History",
      description: "Gather comprehensive medical information for each family member",
      timeframe: "Week 1"
    },
    {
      step: 2, 
      title: "Create Medical Summary Cards",
      description: "Make wallet-sized cards with critical medical information",
      timeframe: "Week 1"
    },
    {
      step: 3,
      title: "Organize Provider Contacts",
      description: "Compile complete healthcare provider contact information", 
      timeframe: "Week 2"
    },
    {
      step: 4,
      title: "Document Special Needs",
      description: "Detail any special medical equipment or emergency procedures",
      timeframe: "Week 2"
    },
    {
      step: 5,
      title: "Update and Review Regularly",
      description: "Review medical information quarterly and after any changes",
      timeframe: "Quarterly"
    }
  ];

  const medicalTips = [
    {
      category: "Emergency Cards",
      icon: FileText,
      tip: "Create laminated medical emergency cards",
      details: "Keep current medical information cards in wallets, purses, and emergency kits for quick access."
    },
    {
      category: "Medical Alert Systems", 
      icon: Activity,
      tip: "Consider medical alert bracelets or devices",
      details: "Wearable medical alerts can provide critical information to first responders when you can't communicate."
    },
    {
      category: "Digital Access",
      icon: Phone,
      tip: "Store medical information on phones and devices",
      details: "Use emergency contact features and medical ID settings on smartphones for quick access."
    }
  ];

  const emergencyKit = [
    {
      category: "Medication Supplies",
      items: ["7-day supply of all medications", "Medication list with dosages", "Prescribing doctor contacts", "Pharmacy information"]
    },
    {
      category: "Medical Documents",
      items: ["Insurance cards and information", "Medical history summaries", "Allergy information", "Emergency contact cards"]
    },
    {
      category: "Special Equipment",
      items: ["Extra batteries for devices", "Backup medical equipment", "Mobility aid accessories", "Emergency medication (EpiPen, inhaler, etc.)"]
    },
    {
      category: "Care Instructions",
      items: ["Emergency action plans", "Medication administration guides", "Device operation instructions", "Emergency contact protocols"]
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
                Medical Information
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize critical medical information for emergency preparedness. Ensure healthcare providers 
              have immediate access to vital health data when every minute counts.
            </p>
          </div>
        </div>
      </section>

      {/* Medical Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Medical Information Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {medicalCategories.map((category, index) => (
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

      {/* Organization Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Medical Information Organization Process
          </h2>
          <div className="space-y-8">
            {organizationSteps.map((step, index) => (
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

      {/* Medical Emergency Tips */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Medical Emergency Preparedness Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {medicalTips.map((tip, index) => {
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

      {/* Emergency Medical Kit */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Emergency Medical Kit Essentials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {emergencyKit.map((kit, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{kit.category}</h3>
                <ul className="space-y-2">
                  {kit.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-[#A5A5A5]">
                      <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-medium mb-2">Critical Reminder</p>
            <p className="text-[#A5A5A5]">
              Keep emergency medication supplies current and check expiration dates regularly. 
              Ensure all family members know how to access and use emergency medical information.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your medical information?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your critical medical information secure and accessible for emergencies with FamilyVault.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-medical"
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