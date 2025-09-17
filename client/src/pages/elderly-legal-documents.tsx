import { FileText, Scale, Shield, Users, Scroll, Lock } from 'lucide-react';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ElderlyLegalDocuments() {
  const legalCategories = [
    {
      icon: Scale,
      title: "Estate Planning Documents",
      description: "Wills, trusts, and estate planning documentation",
      fields: ["Last Will & Testament", "Living Trust", "Revocable Trust", "Estate Planning Letter"]
    },
    {
      icon: Users,
      title: "Power of Attorney",
      description: "Legal authority for financial and healthcare decisions",
      fields: ["Financial Power of Attorney", "Healthcare Power of Attorney", "Durable Power of Attorney", "Limited Power of Attorney"]
    },
    {
      icon: Shield,
      title: "Healthcare Directives",
      description: "Advanced directives and healthcare wishes",
      fields: ["Living Will", "Healthcare Directive", "DNR Orders", "Medical Directives"]
    },
    {
      icon: FileText,
      title: "Personal Documents",
      description: "Birth certificates, social security, and identity documents",
      fields: ["Birth Certificate", "Social Security Card", "Driver's License", "Passport"]
    },
    {
      icon: Scroll,
      title: "Property & Asset Documents",
      description: "Property deeds, vehicle titles, and asset documentation",
      fields: ["Property Deeds", "Vehicle Titles", "Investment Certificates", "Asset Documentation"]
    },
    {
      icon: Lock,
      title: "Insurance & Benefits",
      description: "Insurance policies and benefits documentation",
      fields: ["Life Insurance Policies", "Health Insurance", "Medicare Documents", "Benefits Information"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#121212] to-[#0E0E0E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-full px-4 py-2 mb-6">
              <FileText className="w-4 h-4 text-[#FFD43B] mr-2" />
              <span className="text-[#FFD43B] text-sm font-medium">Legal Documents for Elderly Parents</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Legal Documents for Elderly Parents
            </h1>
            
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize and securely store your elderly parents' legal documents. From wills to power of attorney, ensure all important legal papers are accessible when needed.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pricing"
              data-testid="button-get-started"
              className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-3 rounded-full hover:bg-[#E6C140] transition-colors"
            >
              Start Organizing Documents
            </a>
            <a
              href="/elderly-parents"
              data-testid="button-back-elder-care"
              className="inline-flex items-center justify-center border border-[#FFD43B] text-[#FFD43B] font-semibold px-8 py-3 rounded-full hover:bg-[#FFD43B]/10 transition-colors"
            >
              Back to Elder Care
            </a>
          </div>
        </div>
      </section>

      {/* Legal Categories */}
      <section className="py-16 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Complete Legal Document Management
            </h2>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto">
              Organize all legal documents for your elderly parents in one secure, accessible location.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {legalCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div 
                  key={index}
                  data-testid={`legal-category-${index + 1}`}
                  className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8 hover:border-[#FFD43B]/30 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#FFD43B]/10 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-[#FFD43B]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">{category.title}</h3>
                  <p className="text-[#A5A5A5] mb-6">{category.description}</p>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-[#FFD43B] mb-3">Important Documents:</h4>
                    <ul className="space-y-2">
                      {category.fields.map((field, fieldIndex) => (
                        <li key={fieldIndex} className="flex items-center text-sm text-[#CCCCCC]">
                          <div className="w-1.5 h-1.5 bg-[#FFD43B] rounded-full mr-3"></div>
                          {field}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    data-testid={`button-add-${category.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
                    className="w-full mt-6 bg-[#FFD43B] text-[#0E0E0E] font-semibold py-3 rounded-lg hover:bg-[#E6C140] transition-colors flex items-center justify-center"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Add {category.title}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Legal Planning Importance */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Why Legal Document Organization Matters
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Legal Compliance</h3>
              <p className="text-[#A5A5A5] text-sm">Ensure all legal requirements are met and documented properly</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Asset Protection</h3>
              <p className="text-[#A5A5A5] text-sm">Protect your parents' assets and wishes with proper documentation</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Family Clarity</h3>
              <p className="text-[#A5A5A5] text-sm">Provide clear guidance for family members during difficult times</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Secure Storage</h3>
              <p className="text-[#A5A5A5] text-sm">Keep sensitive legal documents safe and accessible to authorized family</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Secure Your Parents' Legal Future
          </h2>
          <p className="text-xl text-[#A5A5A5] mb-8 leading-relaxed">
            Organize and protect your elderly parents' legal documents with FamilyCircle Secure's secure platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pricing"
              data-testid="button-start-organizing"
              className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-4 rounded-full hover:bg-[#E6C140] transition-colors"
            >
              Start Managing Legal Documents
            </a>
            <a
              href="/schedule-demo"
              data-testid="button-schedule-demo"
              className="inline-flex items-center justify-center border border-[#FFD43B] text-[#FFD43B] font-semibold px-8 py-4 rounded-full hover:bg-[#FFD43B]/10 transition-colors"
            >
              Schedule a Demo
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}