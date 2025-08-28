import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Baby, CheckCircle, Calendar, FileText, Shield, ArrowRight, Clock, Users, AlertCircle, Heart, Star, Award } from "lucide-react";

export default function StartingFamilyBabyDocumentation() {
  const documentCategories = [
    {
      category: "Birth Documentation",
      description: "Official birth records and hospital documentation",
      importance: "Critical",
      information: ["Birth certificate (official and certified copies)", "Hospital birth records", "Newborn screening results", "Birth weight and measurements"],
      tips: "Order multiple certified copies of the birth certificate immediately - you'll need them for many future applications"
    },
    {
      category: "Medical and Health Records",
      description: "Comprehensive health documentation from birth onward",
      importance: "Critical", 
      information: ["Immunization records and schedule", "Pediatric visit summaries", "Growth charts and developmental milestones", "Medication history and allergies"],
      tips: "Keep immunization records current and easily accessible for daycare, school, and travel requirements"
    },
    {
      category: "Social Security Documentation",
      description: "Social Security Number assignment and card",
      importance: "High",
      information: ["Social Security Number application", "Social Security card", "SSN verification documents", "Identity protection measures"],
      tips: "Apply for Social Security Number immediately after birth - most other applications require this number"
    },
    {
      category: "Insurance and Benefits", 
      description: "Health insurance coverage and benefit documentation",
      importance: "High",
      information: ["Insurance enrollment documentation", "Dependent coverage verification", "Pediatric care provider information", "Benefit summaries and coverage limits"],
      tips: "Add your baby to insurance coverage immediately - you typically have 30 days from birth to enroll"
    },
    {
      category: "Legal and Identity Documents",
      description: "Passport and other identity documentation",
      importance: "Medium",
      information: ["Passport application and documentation", "State ID eligibility information", "Parental consent forms", "Identity verification procedures"],
      tips: "Consider applying for a passport early if you plan to travel internationally with your child"
    },
    {
      category: "Developmental Records",
      description: "Growth, milestone, and development tracking",
      importance: "Medium",
      information: ["Growth charts and measurements", "Developmental milestone tracking", "Early intervention services", "Educational assessment records"],
      tips: "Track developmental milestones regularly - early identification of delays can lead to better outcomes"
    }
  ];

  const documentationSteps = [
    {
      step: 1,
      title: "Immediate Birth Documentation",
      description: "Secure birth certificate and hospital records immediately after delivery",
      timeframe: "Within 1 week of birth"
    },
    {
      step: 2, 
      title: "Social Security Application",
      description: "Apply for Social Security Number at the hospital or within 30 days",
      timeframe: "At hospital or within 30 days"
    },
    {
      step: 3,
      title: "Insurance Enrollment",
      description: "Add baby to health insurance and verify pediatric coverage", 
      timeframe: "Within 30 days of birth"
    },
    {
      step: 4,
      title: "Medical Record Setup",
      description: "Establish pediatric care and begin comprehensive health record keeping",
      timeframe: "First pediatric visit (2-3 days after hospital discharge)"
    },
    {
      step: 5,
      title: "Long-term Organization",
      description: "Set up systematic record keeping for ongoing documentation needs",
      timeframe: "Within first month"
    }
  ];

  const organizationTips = [
    {
      category: "Digital + Physical Storage",
      icon: FileText,
      tip: "Maintain both digital and physical copies of essential documents",
      details: "Store originals in a fireproof safe and keep digital copies in secure cloud storage with backup systems."
    },
    {
      category: "Accessibility", 
      icon: Clock,
      tip: "Keep frequently needed documents easily accessible",
      details: "Create a portable folder with copies of insurance cards, immunization records, and emergency medical information."
    },
    {
      category: "Regular Updates",
      icon: AlertCircle,
      tip: "Update records regularly as your child grows",
      details: "Schedule regular record reviews to add new information, update insurance, and track developmental milestones."
    }
  ];

  const essentialDocuments = [
    {
      document: "Birth Certificate",
      uses: ["Social Security application", "Insurance enrollment", "Passport application", "School enrollment"],
      copies: "Order 3-5 certified copies initially",
      storage: "Original in safe, certified copies accessible"
    },
    {
      document: "Social Security Card",
      uses: ["Tax purposes", "Insurance applications", "Future employment", "Financial accounts"],
      copies: "Keep original safe, memorize number",
      storage: "Secure location, never carry in wallet"
    },
    {
      document: "Immunization Records",
      uses: ["Daycare enrollment", "School requirements", "Travel documentation", "Medical appointments"],
      copies: "Keep updated copies accessible",
      storage: "Digital and physical copies readily available"
    },
    {
      document: "Insurance Cards",
      uses: ["Medical appointments", "Emergency care", "Prescription medications", "Specialist visits"],
      copies: "Keep physical and digital copies",
      storage: "Wallet, diaper bag, and digital storage"
    }
  ];

  const timelineChecklist = [
    {
      timing: "Birth - 1 Week",
      tasks: ["Obtain birth certificate from hospital", "Begin Social Security application process", "Notify insurance company of birth", "Start medical record collection"]
    },
    {
      timing: "1 Week - 1 Month", 
      tasks: ["Complete insurance enrollment", "Receive Social Security card", "Establish pediatric care", "Begin immunization tracking"]
    },
    {
      timing: "1-3 Months",
      tasks: ["Apply for passport if needed", "Organize document storage system", "Update emergency contacts", "Begin milestone tracking"]
    },
    {
      timing: "Ongoing",
      tasks: ["Update immunization records", "Track growth measurements", "Document developmental milestones", "Review and update insurance"]
    }
  ];

  const medicalTrackingItems = [
    {
      category: "Growth Tracking",
      items: ["Height and length measurements", "Weight tracking", "Head circumference", "BMI percentiles"],
      frequency: "Every pediatric visit"
    },
    {
      category: "Immunization Schedule",
      items: ["Required vaccine dates", "Vaccine lot numbers", "Adverse reactions", "Future schedule planning"],
      frequency: "As recommended by pediatrician"
    },
    {
      category: "Developmental Milestones",
      items: ["Motor skill development", "Language development", "Social/emotional growth", "Cognitive development"],
      frequency: "Ongoing observation and tracking"
    },
    {
      category: "Medical History",
      items: ["Illness and injury records", "Medication history", "Allergies and reactions", "Family medical history"],
      frequency: "As needed and updated regularly"
    }
  ];

  const emergencyDocuments = [
    {
      situation: "Emergency Medical Care",
      documents: ["Insurance cards", "Medical history summary", "Medication list", "Emergency contact information", "Parental consent forms"],
      preparation: "Keep copies in multiple locations including car, diaper bag, and with caregivers"
    },
    {
      situation: "Travel",
      documents: ["Birth certificate", "Passport (if applicable)", "Immunization records", "Medical insurance cards", "Parental consent if traveling with one parent"],
      preparation: "Check destination requirements well in advance and ensure all documents are current"
    },
    {
      situation: "Daycare/School Enrollment", 
      documents: ["Birth certificate", "Immunization records", "Insurance information", "Emergency contacts", "Medical forms"],
      preparation: "Start gathering documents well before enrollment deadlines"
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
              <Baby className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Baby Documentation
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize all essential documents for your new baby from birth certificates to medical records. 
              Keep important paperwork secure and accessible as your child grows.
            </p>
          </div>
        </div>
      </section>

      {/* Document Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Baby Documentation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {documentCategories.map((category, index) => (
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

      {/* Documentation Timeline */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Documentation Timeline
          </h2>
          <div className="space-y-8">
            {documentationSteps.map((step, index) => (
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
            Document Organization Best Practices
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

      {/* Essential Documents */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Documents and Their Uses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {essentialDocuments.map((doc, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{doc.document}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Common Uses:</h4>
                  <ul className="space-y-1 mb-4">
                    {doc.uses.map((use, useIndex) => (
                      <li key={useIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {use}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                    <p className="text-[#FFD43B] text-sm font-medium">Copies: {doc.copies}</p>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm font-medium">Storage: {doc.storage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Checklist */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Baby Documentation Checklist
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {timelineChecklist.map((phase, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{phase.timing}</h3>
                <ul className="space-y-2">
                  {phase.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-center text-[#A5A5A5]">
                      <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Medical Tracking */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Medical Record Tracking
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {medicalTrackingItems.map((item, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{item.category}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Track These Items:</h4>
                  <ul className="space-y-1">
                    {item.items.map((trackItem, trackIndex) => (
                      <li key={trackIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <Heart className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {trackItem}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm font-medium">Update: {item.frequency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Situations */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Documents for Common Situations
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {emergencyDocuments.map((emergency, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{emergency.situation}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Required Documents:</h4>
                  <ul className="space-y-1 mb-4">
                    {emergency.documents.map((doc, docIndex) => (
                      <li key={docIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                  <p className="text-green-400 text-sm font-medium">{emergency.preparation}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <Star className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium mb-2">Pro Tip</p>
            <p className="text-[#A5A5A5]">
              Create a "baby documents" folder that you can grab quickly for appointments, travel, or emergencies. 
              Include copies of birth certificate, insurance cards, and current immunization records.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your baby's documents?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your baby's important documentation secure and organized with FamilyVault as they grow.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-baby-docs"
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