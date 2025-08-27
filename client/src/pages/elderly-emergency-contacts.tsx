import { Phone, Users, Shield, Heart, AlertCircle, UserCheck } from 'lucide-react';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ElderlyEmergencyContacts() {
  const contactCategories = [
    {
      icon: Heart,
      title: "Healthcare Providers",
      description: "Primary doctors, specialists, and medical facilities",
      fields: ["Primary Care Physician", "Cardiologist", "Neurologist", "Preferred Hospital"]
    },
    {
      icon: Users,
      title: "Family Members",
      description: "Children, siblings, and close family emergency contacts",
      fields: ["Adult Children", "Siblings", "Grandchildren", "Primary Family Contact"]
    },
    {
      icon: Shield,
      title: "Legal Representatives",
      description: "Attorney, power of attorney, and legal contacts",
      fields: ["Estate Attorney", "Power of Attorney", "Healthcare Proxy", "Legal Guardian"]
    },
    {
      icon: Phone,
      title: "Care Team",
      description: "Home health aides, nurses, and care coordinators",
      fields: ["Home Health Aide", "Visiting Nurse", "Care Coordinator", "Physical Therapist"]
    },
    {
      icon: AlertCircle,
      title: "Emergency Services",
      description: "Local emergency contacts and service providers",
      fields: ["Local Emergency Services", "Police Department", "Fire Department", "Poison Control"]
    },
    {
      icon: UserCheck,
      title: "Support Network",
      description: "Friends, neighbors, and community support contacts",
      fields: ["Close Friends", "Neighbors", "Community Center", "Religious Organization"]
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
              <Phone className="w-4 h-4 text-[#FFD43B] mr-2" />
              <span className="text-[#FFD43B] text-sm font-medium">Emergency Contacts for Elderly Parents</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Emergency Contacts for Elderly Parents
            </h1>
            
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize and manage emergency contacts for your elderly parents. Ensure healthcare providers, family members, and caregivers can be reached quickly when needed.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pricing"
              data-testid="button-get-started"
              className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-3 rounded-full hover:bg-[#E6C140] transition-colors"
            >
              Start Managing Contacts
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

      {/* Contact Categories */}
      <section className="py-16 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Complete Emergency Contact Network
            </h2>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto">
              Build a comprehensive emergency contact system for your elderly parents' safety and care coordination.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contactCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div 
                  key={index}
                  data-testid={`contact-category-${index + 1}`}
                  className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8 hover:border-[#FFD43B]/30 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#FFD43B]/10 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-[#FFD43B]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">{category.title}</h3>
                  <p className="text-[#A5A5A5] mb-6">{category.description}</p>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-[#FFD43B] mb-3">Key Contacts to Include:</h4>
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
                    data-testid={`button-add-${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="w-full mt-6 bg-[#FFD43B] text-[#0E0E0E] font-semibold py-3 rounded-lg hover:bg-[#E6C140] transition-colors flex items-center justify-center"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Add {category.title}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Planning Tips */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Emergency Contact Best Practices
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <AlertCircle className="w-12 h-12 text-[#FFD43B] mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Quick Access Information</h3>
              <ul className="space-y-3 text-[#A5A5A5]">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Keep contact information updated regularly
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Include primary and backup phone numbers
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Add relationship and preferred contact times
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Store physical addresses for important contacts
                </li>
              </ul>
            </div>
            
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <Shield className="w-12 h-12 text-[#FFD43B] mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Secure Sharing</h3>
              <ul className="space-y-3 text-[#A5A5A5]">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Share contact list with trusted family members
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Provide emergency contacts to healthcare providers
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Keep a printed copy in an accessible location
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Update caregivers when contact information changes
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
            Build a Reliable Emergency Contact Network
          </h2>
          <p className="text-xl text-[#A5A5A5] mb-8 leading-relaxed">
            Ensure your elderly parents have a comprehensive, organized emergency contact system for their safety and peace of mind.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pricing"
              data-testid="button-start-organizing"
              className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-4 rounded-full hover:bg-[#E6C140] transition-colors"
            >
              Start Managing Emergency Contacts
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