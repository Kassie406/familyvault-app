import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Heart, Shield, AlertTriangle, Pill, Calendar, Clock, FileText, Phone } from "lucide-react";

export default function MedicalAllergies() {
  const medicalCategories = [
    {
      icon: Heart,
      title: "Medical Conditions",
      description: "Chronic conditions, ongoing treatments, and medical history",
      examples: ["Asthma", "ADHD", "Diabetes", "Food allergies", "Anxiety"]
    },
    {
      icon: Pill,
      title: "Current Medications",
      description: "Daily medications, dosages, and administration times",
      examples: ["Albuterol inhaler - 2 puffs as needed", "Multivitamin - 1 daily", "EpiPen - emergency use only"]
    },
    {
      icon: AlertTriangle,
      title: "Allergies & Reactions",
      description: "Food allergies, environmental sensitivities, and reaction protocols",
      examples: ["Peanuts - severe (EpiPen required)", "Shellfish - moderate", "Seasonal pollen", "Latex sensitivity"]
    },
    {
      icon: FileText,
      title: "Medical Documents",
      description: "Insurance cards, medical records, and provider information",
      examples: ["Insurance card copy", "Allergy action plan", "Recent lab results", "Specialist reports"]
    }
  ];

  const emergencyInfo = [
    { label: "Pediatrician", value: "Dr. Sarah Johnson - (555) 123-4567" },
    { label: "Insurance", value: "Blue Cross Blue Shield - Member ID: ABC123456" },
    { label: "Pharmacy", value: "CVS Pharmacy - (555) 987-6543" },
    { label: "Emergency Contact", value: "Mom: Jane Smith - (555) 555-1234" }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F3F4F6]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#0B0B0B] to-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#D4AF37] font-medium bg-[rgba(212,175,55,0.08)] px-4 py-2 rounded-full border border-[rgba(212,175,55,0.25)] mb-6">
              <Heart className="w-5 h-5" />
              Medical & Allergies
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Complete Medical Information Management
            </h1>
            <p className="text-xl text-[#CCCCCC] max-w-3xl mx-auto">
              Keep all your child's medical information organized, secure, and accessible for emergencies, school, and healthcare providers.
            </p>
          </div>
        </div>
      </section>

      {/* Medical Categories */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Everything You Need to Track
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {medicalCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="gold-card rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[rgba(212,175,55,0.1)] rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                  </div>
                  
                  <p className="text-[#CCCCCC] mb-6">{category.description}</p>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wide">Examples:</h4>
                    <ul className="space-y-2">
                      {category.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="text-[#CCCCCC] flex items-start">
                          <span className="text-[#D4AF37] mr-2">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Access Emergency Info */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Quick Access Emergency Information
          </h2>
          
          <div className="gold-card rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyInfo.map((info, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[rgba(212,175,55,0.05)] rounded-lg border border-[rgba(212,175,55,0.2)]">
                  <span className="text-[#D4AF37] font-semibold">{info.label}:</span>
                  <span className="text-white text-right">{info.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Secure, Accessible, Always Up-to-Date
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">HIPAA Compliant</h3>
              <p className="text-[#CCCCCC]">Your medical information is protected with bank-level encryption and security protocols.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Emergency Access</h3>
              <p className="text-[#CCCCCC]">First responders and caregivers can access critical information when it matters most.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Always Current</h3>
              <p className="text-[#CCCCCC]">Medication reminders and appointment tracking keep your records up-to-date.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Organize Your Child's Medical Information?
          </h2>
          <p className="text-xl text-[#CCCCCC] mb-8">
            Start with our free plan and keep your family's health information secure and accessible.
          </p>
          <a
            href="/signup"
            data-testid="button-get-started"
            className="bg-[#D4AF37] text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#C7A233] transition-colors inline-block"
          >
            Get Started Free
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}