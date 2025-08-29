import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { FileText, CheckCircle, Calendar, Upload, Shield, ArrowRight, Clock, Users, AlertCircle, CreditCard, Home, Heart } from "lucide-react";

export default function DisasterImportantDocuments() {
  const documentCategories = [
    {
      category: "Identification Documents",
      description: "Essential personal identification and citizenship documents",
      importance: "Critical",
      documents: ["Driver's licenses and state IDs", "Passports and visas", "Birth certificates", "Social Security cards"],
      tips: "Keep originals in fireproof safe, copies in go-bag, and digital scans in secure cloud storage"
    },
    {
      category: "Financial Records",
      description: "Banking, investment, and credit information",
      importance: "Critical", 
      documents: ["Bank account information", "Credit card details", "Investment account statements", "Tax returns (3 years)"],
      tips: "Include account numbers, routing numbers, and contact information for all financial institutions"
    },
    {
      category: "Insurance Policies",
      description: "All insurance coverage documentation",
      importance: "High",
      documents: ["Home/renters insurance", "Auto insurance policies", "Life insurance policies", "Health insurance cards"],
      tips: "Keep policy numbers, agent contacts, and claim filing procedures easily accessible"
    },
    {
      category: "Property & Legal Documents", 
      description: "Home ownership and legal agreements",
      importance: "High",
      documents: ["Deed or mortgage documents", "Rental/lease agreements", "Wills and estate documents", "Power of attorney forms"],
      tips: "Include property surveys, HOA documents, and any ongoing legal agreements"
    },
    {
      category: "Medical Records",
      description: "Health information and medical history",
      importance: "High",
      documents: ["Prescription lists and dosages", "Medical history summaries", "Emergency medical information", "Insurance cards and ID numbers"],
      tips: "Include allergies, chronic conditions, and emergency medical contacts for each family member"
    },
    {
      category: "Family Records",
      description: "Important family and personal documents",
      importance: "Medium",
      documents: ["Marriage certificates", "Divorce decrees", "Adoption papers", "Military discharge papers"],
      tips: "Include children's important documents and any custody or guardianship papers"
    }
  ];

  const storageSteps = [
    {
      step: 1,
      title: "Inventory All Documents",
      description: "Create a comprehensive list of all important documents by category",
      timeframe: "Week 1"
    },
    {
      step: 2, 
      title: "Create Digital Copies",
      description: "Scan or photograph all documents in high resolution and organize digitally",
      timeframe: "Week 2"
    },
    {
      step: 3,
      title: "Secure Physical Storage",
      description: "Store originals in fireproof safe or safety deposit box", 
      timeframe: "Week 2"
    },
    {
      step: 4,
      title: "Prepare Emergency Access",
      description: "Create accessible copies for go-bags and trusted family members",
      timeframe: "Week 3"
    },
    {
      step: 5,
      title: "Regular Updates",
      description: "Review and update documents annually or after major life changes",
      timeframe: "Annually"
    }
  ];

  const storageTips = [
    {
      category: "Fireproof Storage",
      icon: Shield,
      tip: "Use fireproof safes and safety deposit boxes",
      details: "Protect original documents from fire, flood, and theft with proper secure storage solutions."
    },
    {
      category: "Digital Backup", 
      icon: Upload,
      tip: "Maintain secure digital copies in multiple locations",
      details: "Use encrypted cloud storage and secure external drives for digital document backups."
    },
    {
      category: "Access Planning",
      icon: Users,
      tip: "Ensure trusted family can access documents when needed",
      details: "Share location and access information with trusted family members or your attorney."
    }
  ];

  const documentChecklist = [
    {
      category: "Personal ID Bundle",
      items: ["Driver's license copy", "Passport copy", "Birth certificate copy", "Social Security card copy"]
    },
    {
      category: "Financial Bundle",
      items: ["Bank account info", "Credit card contacts", "Investment account details", "Recent tax returns"]
    },
    {
      category: "Insurance Bundle",
      items: ["Homeowner's/renter's policy", "Auto insurance policy", "Health insurance cards", "Life insurance details"]
    },
    {
      category: "Property Bundle",
      items: ["Deed or mortgage papers", "Property tax records", "Home inventory photos", "Rental agreements"]
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
              <FileText className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Important Documents
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Secure and organize all your critical documents for disaster preparedness. 
              Ensure quick access to essential paperwork when emergencies strike.
            </p>
          </div>
        </div>
      </section>

      {/* Document Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Critical Document Categories
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
                    {category.documents.map((document, docIndex) => (
                      <li key={docIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {document}
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

      {/* Storage & Organization Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Document Organization Process
          </h2>
          <div className="space-y-8">
            {storageSteps.map((step, index) => (
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

      {/* Document Storage Tips */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Document Storage Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {storageTips.map((tip, index) => {
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

      {/* Emergency Document Kit */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Emergency Document Kit Checklist
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {documentChecklist.map((bundle, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{bundle.category}</h3>
                <ul className="space-y-2">
                  {bundle.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-[#A5A5A5]">
                      <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium">
              Keep copies of these document bundles in your emergency kit, with trusted family members, and in secure digital storage.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to secure your important documents?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your critical documents organized, secure, and accessible during emergencies with FamilyCircle Secure.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-documents"
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