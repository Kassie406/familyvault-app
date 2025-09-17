import { Heart, Plus, FileText, Phone, Calendar, Pill, Shield, User } from 'lucide-react';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ElderlyMedicalInfo() {
  const medicalCategories = [
    {
      icon: Heart,
      title: "Primary Care Information",
      description: "Doctor contacts, preferred hospitals, and primary care providers",
      fields: ["Primary Care Physician", "Specialist Contacts", "Preferred Hospital", "Medical ID Number"]
    },
    {
      icon: Pill,
      title: "Medications & Prescriptions",
      description: "Current medications, dosages, and pharmacy information",
      fields: ["Current Medications", "Dosage Instructions", "Pharmacy Details", "Prescription History"]
    },
    {
      icon: FileText,
      title: "Medical History",
      description: "Chronic conditions, allergies, and past medical procedures",
      fields: ["Chronic Conditions", "Known Allergies", "Past Surgeries", "Medical Conditions"]
    },
    {
      icon: Shield,
      title: "Insurance Information",
      description: "Health insurance details, Medicare information, and coverage",
      fields: ["Insurance Provider", "Policy Numbers", "Medicare Details", "Coverage Information"]
    },
    {
      icon: Phone,
      title: "Emergency Medical Contacts",
      description: "Emergency contacts and healthcare proxy information",
      fields: ["Emergency Contacts", "Healthcare Proxy", "Power of Attorney", "Family Contacts"]
    },
    {
      icon: Calendar,
      title: "Appointments & Care Schedule",
      description: "Upcoming appointments and regular care schedules",
      fields: ["Upcoming Appointments", "Regular Check-ups", "Care Schedule", "Treatment Plans"]
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
              <Heart className="w-4 h-4 text-[#FFD43B] mr-2" />
              <span className="text-[#FFD43B] text-sm font-medium">Elder Care Medical Information</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Organize Medical Information for Elderly Parents
            </h1>
            
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Keep your elderly parents' medical information organized, accessible, and secure. From medications to doctor contacts, ensure their healthcare needs are always met.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pricing"
              data-testid="button-get-started"
              className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-3 rounded-full hover:bg-[#E6C140] transition-colors"
            >
              Start Organizing Medical Info
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

      {/* Medical Categories */}
      <section className="py-16 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Complete Medical Information Management
            </h2>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto">
              Organize every aspect of your elderly parents' medical care in one secure, accessible location.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {medicalCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div 
                  key={index}
                  data-testid={`medical-category-${index + 1}`}
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
                    data-testid={`button-add-${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="w-full mt-6 bg-[#FFD43B] text-[#0E0E0E] font-semibold py-3 rounded-lg hover:bg-[#E6C140] transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add {category.title}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Why Organize Medical Information?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Emergency Preparedness</h3>
              <p className="text-[#A5A5A5] text-sm">Quick access to critical medical information during emergencies</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Caregiver Coordination</h3>
              <p className="text-[#A5A5A5] text-sm">Share information securely with family members and healthcare providers</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Appointment Management</h3>
              <p className="text-[#A5A5A5] text-sm">Never miss important appointments or medication schedules</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Complete Records</h3>
              <p className="text-[#A5A5A5] text-sm">Maintain comprehensive medical history for better healthcare decisions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Start Managing Medical Information Today
          </h2>
          <p className="text-xl text-[#A5A5A5] mb-8 leading-relaxed">
            Give your elderly parents the organized medical care they deserve with FamilyCircle Secure's secure platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pricing"
              data-testid="button-start-organizing"
              className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-4 rounded-full hover:bg-[#E6C140] transition-colors"
            >
              Start Organizing Medical Information
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