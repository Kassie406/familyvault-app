import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Heart, CheckCircle, Calendar, Stethoscope, Shield, ArrowRight, Clock, Users, AlertCircle, FileText, Activity, Baby } from "lucide-react";

export default function StartingFamilyPregnancyMedicalRecords() {
  const medicalCategories = [
    {
      category: "Pre-Conception Health Records",
      description: "Medical information before trying to conceive",
      importance: "Critical",
      information: ["General health checkups", "Fertility consultations", "Genetic counseling records", "Pre-conception vitamins and medications"],
      tips: "Start tracking health information at least 3 months before trying to conceive for optimal preparation"
    },
    {
      category: "Prenatal Care Records",
      description: "Comprehensive pregnancy monitoring and care documentation",
      importance: "Critical", 
      information: ["Regular prenatal appointments", "Ultrasound images and reports", "Blood test results", "Weight and vital sign tracking"],
      tips: "Keep all prenatal records organized - they're essential for continuity of care and birth planning"
    },
    {
      category: "Pregnancy Test Results",
      description: "Documentation of pregnancy confirmation and monitoring",
      importance: "High",
      information: ["Home pregnancy test results", "Blood pregnancy test (beta hCG)", "Confirmation ultrasound", "Dating scan results"],
      tips: "Document test dates and results for accurate pregnancy dating and milestone tracking"
    },
    {
      category: "Specialist Consultations", 
      description: "Records from maternal-fetal medicine and other specialists",
      importance: "High",
      information: ["High-risk pregnancy consultations", "Genetic testing results", "Specialist referrals", "Second opinion records"],
      tips: "Specialist records often contain critical information for delivery planning and newborn care"
    },
    {
      category: "Birth Plan and Preferences",
      description: "Documentation of labor and delivery preferences",
      importance: "Medium",
      information: ["Birth plan documentation", "Labor preferences", "Pain management choices", "Newborn care preferences"],
      tips: "Share birth plans with your healthcare team and keep copies easily accessible during labor"
    },
    {
      category: "Insurance and Benefits",
      description: "Health insurance coverage and maternity benefits",
      importance: "Medium",
      information: ["Maternity coverage details", "Pre-authorization requirements", "Provider network information", "Benefit claim records"],
      tips: "Understand your insurance coverage early in pregnancy to avoid unexpected costs"
    }
  ];

  const pregnancySteps = [
    {
      step: 1,
      title: "Pre-Conception Planning",
      description: "Begin health optimization and record collection before conceiving",
      timeframe: "3-6 months before trying"
    },
    {
      step: 2, 
      title: "Early Pregnancy Documentation",
      description: "Start comprehensive record keeping as soon as pregnancy is confirmed",
      timeframe: "Weeks 4-12 of pregnancy"
    },
    {
      step: 3,
      title: "Regular Prenatal Care",
      description: "Maintain detailed records of all prenatal appointments and tests", 
      timeframe: "Throughout pregnancy"
    },
    {
      step: 4,
      title: "Third Trimester Preparation",
      description: "Organize all records for hospital admission and delivery",
      timeframe: "Weeks 28-40 of pregnancy"
    },
    {
      step: 5,
      title: "Postpartum Records",
      description: "Continue record keeping for postpartum care and recovery",
      timeframe: "After delivery"
    }
  ];

  const recordTips = [
    {
      category: "Digital Organization",
      icon: FileText,
      tip: "Keep both digital and physical copies of important records",
      details: "Store digital copies in secure cloud storage and maintain physical copies in a portable folder for hospital visits."
    },
    {
      category: "Medical History", 
      icon: Activity,
      tip: "Document family medical history thoroughly",
      details: "Include both maternal and paternal family histories as they're important for genetic counseling and pregnancy care."
    },
    {
      category: "Emergency Access",
      icon: AlertCircle,
      tip: "Ensure records are accessible during emergencies",
      details: "Keep essential medical information easily accessible for emergency situations or unexpected hospital visits."
    }
  ];

  const essentialRecords = [
    {
      type: "Prenatal Visit Summary",
      contents: ["Date and gestational age", "Weight and blood pressure", "Fetal heart rate", "Measurements and growth", "Any concerns or recommendations"],
      frequency: "Every prenatal visit",
      importance: "Critical for tracking pregnancy progression"
    },
    {
      type: "Lab Test Results",
      contents: ["Blood type and Rh factor", "STD/STI screening", "Glucose tolerance test", "Group B Strep test", "Complete blood count"],
      frequency: "As ordered by provider",
      importance: "Essential for identifying and managing pregnancy complications"
    },
    {
      type: "Ultrasound Reports",
      contents: ["Dating ultrasound results", "Anatomy scan findings", "Growth measurements", "Placenta location", "Amniotic fluid levels"],
      frequency: "Multiple times during pregnancy",
      importance: "Key for monitoring fetal development and identifying issues"
    },
    {
      type: "Genetic Testing Results",
      contents: ["Carrier screening results", "Non-invasive prenatal testing", "Amniocentesis or CVS results", "Genetic counseling notes"],
      frequency: "As recommended by provider",
      importance: "Important for understanding genetic risks and planning care"
    }
  ];

  const pregnancyMilestones = [
    {
      trimester: "First Trimester (0-12 weeks)",
      keyRecords: ["Pregnancy confirmation", "Initial prenatal visit", "First ultrasound", "Genetic counseling"],
      commonTests: ["Blood type, Rh factor", "STD screening", "Prenatal vitamins", "Dating ultrasound"]
    },
    {
      trimester: "Second Trimester (13-27 weeks)",
      keyRecords: ["Anatomy ultrasound", "Genetic testing results", "Glucose screening", "Regular prenatal visits"],
      commonTests: ["20-week anatomy scan", "Quad screen or NIPT", "Glucose tolerance test", "Blood pressure monitoring"]
    },
    {
      trimester: "Third Trimester (28-40 weeks)",
      keyRecords: ["Growth ultrasounds", "Group B Strep test", "Birth plan completion", "Hospital pre-registration"],
      commonTests: ["Group B Strep culture", "Fetal monitoring", "Growth measurements", "Cervical checks"]
    }
  ];

  const emergencyInfo = [
    {
      situation: "Emergency Room Visit",
      documents: ["Photo ID and insurance cards", "Prenatal records summary", "Medication list", "Emergency contact information"],
      preparation: "Keep essential documents in hospital bag from 36 weeks"
    },
    {
      situation: "Hospital Admission for Delivery",
      documents: ["Birth plan and preferences", "Insurance pre-authorization", "Newborn care preferences", "Emergency contacts"],
      preparation: "Pre-register at hospital and confirm document requirements"
    },
    {
      situation: "Provider Changes",
      documents: ["Complete prenatal records", "Test results and imaging", "Medication history", "Contact information for previous providers"],
      preparation: "Request complete records transfer when changing providers"
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
                Pregnancy & Medical Records
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize all your pregnancy and medical records from pre-conception through delivery. 
              Keep important health information secure and accessible throughout your journey to parenthood.
            </p>
          </div>
        </div>
      </section>

      {/* Medical Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Medical Record Categories
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
                  <h4 className="text-sm font-medium text-white mb-2">Key Records:</h4>
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

      {/* Pregnancy Timeline */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Record Keeping Timeline
          </h2>
          <div className="space-y-8">
            {pregnancySteps.map((step, index) => (
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

      {/* Record Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Medical Record Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recordTips.map((tip, index) => {
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

      {/* Essential Records */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Record Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {essentialRecords.map((record, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{record.type}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Should Include:</h4>
                  <ul className="space-y-1">
                    {record.contents.map((content, contentIndex) => (
                      <li key={contentIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {content}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                    <p className="text-[#FFD43B] text-sm font-medium">Frequency: {record.frequency}</p>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm">{record.importance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pregnancy Milestones */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Pregnancy Record Milestones
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pregnancyMilestones.map((milestone, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{milestone.trimester}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Key Records:</h4>
                  <ul className="space-y-1 mb-4">
                    {milestone.keyRecords.map((record, recordIndex) => (
                      <li key={recordIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <Heart className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {record}
                      </li>
                    ))}
                  </ul>
                  <h4 className="text-sm font-medium text-white mb-2">Common Tests:</h4>
                  <ul className="space-y-1">
                    {milestone.commonTests.map((test, testIndex) => (
                      <li key={testIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <Stethoscope className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {test}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Preparedness */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Emergency Preparedness
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {emergencyInfo.map((emergency, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{emergency.situation}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Essential Documents:</h4>
                  <ul className="space-y-1 mb-4">
                    {emergency.documents.map((doc, docIndex) => (
                      <li key={docIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm font-medium">{emergency.preparation}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <Baby className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium mb-2">Hospital Bag Essentials</p>
            <p className="text-[#A5A5A5]">
              Pack essential medical documents in your hospital bag by 36 weeks. Include copies of 
              insurance cards, prenatal records, and birth plans for easy access during delivery.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your pregnancy records?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your pregnancy and medical records secure and accessible with FamilyCircle Secure throughout your journey to parenthood.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-pregnancy-records"
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