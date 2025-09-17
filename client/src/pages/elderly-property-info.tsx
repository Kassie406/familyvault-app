import { Home, MapPin, Key, FileText, DollarSign, Settings } from 'lucide-react';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ElderlyPropertyInfo() {
  const propertyCategories = [
    {
      icon: Home,
      title: "Primary Residence",
      description: "Main home information, ownership, and property details",
      fields: ["Property Deed", "Mortgage Information", "Property Tax Records", "Homeowner's Insurance"]
    },
    {
      icon: MapPin,
      title: "Additional Properties",
      description: "Vacation homes, rental properties, and investment real estate",
      fields: ["Vacation Home Details", "Rental Properties", "Investment Real Estate", "Land Ownership"]
    },
    {
      icon: Settings,
      title: "Utilities & Services",
      description: "Utility accounts, service providers, and maintenance contacts",
      fields: ["Electric & Gas", "Water & Sewer", "Internet & Cable", "Trash & Recycling"]
    },
    {
      icon: Key,
      title: "Access & Security",
      description: "Keys, security codes, and access information",
      fields: ["House Keys", "Security Codes", "Safe Combinations", "Emergency Access"]
    },
    {
      icon: FileText,
      title: "Property Documents",
      description: "Warranties, manuals, and property-related documentation",
      fields: ["Appliance Warranties", "Home Improvement Records", "Property Surveys", "HOA Documents"]
    },
    {
      icon: DollarSign,
      title: "Financial Information",
      description: "Property values, taxes, and financial details",
      fields: ["Property Assessments", "Tax Valuations", "Insurance Appraisals", "Mortgage Details"]
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
              <Home className="w-4 h-4 text-[#FFD43B] mr-2" />
              <span className="text-[#FFD43B] text-sm font-medium">Property Information for Elderly Parents</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Property Information for Elderly Parents
            </h1>
            
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Document and organize your elderly parents' property information. From home ownership to utilities, keep all property details secure and accessible.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pricing"
              data-testid="button-get-started"
              className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-3 rounded-full hover:bg-[#E6C140] transition-colors"
            >
              Start Organizing Property Info
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

      {/* Property Categories */}
      <section className="py-16 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Complete Property Information Management
            </h2>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto">
              Organize all aspects of your elderly parents' property ownership and management in one secure location.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertyCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div 
                  key={index}
                  data-testid={`property-category-${index + 1}`}
                  className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8 hover:border-[#FFD43B]/30 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#FFD43B]/10 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-[#FFD43B]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">{category.title}</h3>
                  <p className="text-[#A5A5A5] mb-6">{category.description}</p>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-[#FFD43B] mb-3">Key Information to Store:</h4>
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
                    <Home className="w-4 h-4 mr-2" />
                    Add {category.title}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Property Management Benefits */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Benefits of Organized Property Information
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <Key className="w-12 h-12 text-[#FFD43B] mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Emergency Access</h3>
              <ul className="space-y-3 text-[#A5A5A5]">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Quick access to security codes and keys
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Emergency contact information for utilities
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Property access for caregivers and family
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Important maintenance and repair contacts
                </li>
              </ul>
            </div>
            
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <FileText className="w-12 h-12 text-[#FFD43B] mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Property Management</h3>
              <ul className="space-y-3 text-[#A5A5A5]">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Organized maintenance records and warranties
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Financial tracking for property expenses
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Insurance and legal document storage
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Estate planning and property transfer information
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Organize Property Information Today
          </h2>
          <p className="text-xl text-[#A5A5A5] mb-8 leading-relaxed">
            Help your elderly parents maintain organized property records for better management and peace of mind.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pricing"
              data-testid="button-start-organizing"
              className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-4 rounded-full hover:bg-[#E6C140] transition-colors"
            >
              Start Managing Property Information
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