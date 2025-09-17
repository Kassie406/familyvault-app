import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { FileText, CheckCircle, Calendar, Upload, Shield, ArrowRight, Clock, Users, AlertCircle } from "lucide-react";

export default function MarriedLegalDocs() {
  const legalDocuments = [
    {
      category: "Marriage Certificate",
      description: "Official proof of your marriage from government authority",
      importance: "Critical",
      documents: ["Original marriage certificate", "Certified copies (3-5)", "Digital backup copy"],
      tips: "Keep original in safe place, carry certified copies for name changes"
    },
    {
      category: "Name Change Documents",
      description: "Legal forms and certificates for name changes",
      importance: "High", 
      documents: ["Social Security name change", "Driver's license update", "Passport name change", "Bank account updates"],
      tips: "Start with Social Security card, then update all other documents"
    },
    {
      category: "Legal Forms",
      description: "Important legal documentation for married couples",
      importance: "High",
      documents: ["Power of attorney forms", "Healthcare proxy", "Living will", "Beneficiary updates"],
      tips: "Update beneficiaries on all accounts and policies after marriage"
    },
    {
      category: "Identity Documents", 
      description: "Updated identification with new married status",
      importance: "Critical",
      documents: ["Updated driver's license", "New passport", "Updated voter registration", "Professional licenses"],
      tips: "Allow extra time for passport processing with name changes"
    }
  ];

  const steps = [
    {
      step: 1,
      title: "Obtain Marriage Certificate",
      description: "Get official copies from the county clerk where you were married",
      timeframe: "Within 30 days"
    },
    {
      step: 2, 
      title: "Update Social Security",
      description: "Change your name with Social Security Administration first",
      timeframe: "Within 2 weeks"
    },
    {
      step: 3,
      title: "Update Identification",
      description: "Update driver's license, passport, and other ID documents", 
      timeframe: "Within 60 days"
    },
    {
      step: 4,
      title: "Update Financial Accounts",
      description: "Change names on bank accounts, credit cards, and investments",
      timeframe: "Within 90 days"
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
                Legal Documentation
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize and manage all your marriage-related legal documents in one secure place. 
              From marriage certificates to name change paperwork, keep everything accessible and protected.
            </p>
          </div>
        </div>
      </section>

      {/* Document Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Legal Documents for Married Couples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {legalDocuments.map((doc, index) => (
              <div 
                key={index}
                className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6 hover:border-[#FFD43B]/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{doc.category}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    doc.importance === 'Critical' 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/20'
                  }`}>
                    {doc.importance}
                  </span>
                </div>
                <p className="text-[#A5A5A5] mb-4">{doc.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Required Documents:</h4>
                  <ul className="space-y-1">
                    {doc.documents.map((document, docIndex) => (
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
                    {doc.tips}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Step-by-Step Legal Documentation Process
          </h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your legal documents?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Start storing and managing all your marriage-related legal documents securely with FamilyCircle Secure.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-legal"
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