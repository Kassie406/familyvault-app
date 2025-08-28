import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Heart, CheckCircle, Calendar, Stethoscope, Shield, ArrowRight, Clock, Users, AlertCircle, Phone, FileText, MapPin } from "lucide-react";

export default function DisasterPetRecords() {
  const petCategories = [
    {
      category: "Medical Records",
      description: "Complete veterinary and health information for each pet",
      importance: "Critical",
      information: ["Vaccination records and schedules", "Medical history and conditions", "Current medications and dosages", "Veterinarian contact information"],
      tips: "Keep vaccination records current and easily accessible - many shelters require proof of vaccinations"
    },
    {
      category: "Identification Documents",
      description: "Legal ownership and identification documentation",
      importance: "Critical", 
      information: ["Registration and licensing", "Microchip information", "Recent photos of each pet", "Ownership documentation"],
      tips: "Include multiple recent photos from different angles and update annually or after significant changes"
    },
    {
      category: "Emergency Care Information",
      description: "Critical information for emergency pet care",
      importance: "High",
      information: ["Emergency veterinarian contacts", "After-hours animal hospitals", "Pet poison control numbers", "Special medical needs or conditions"],
      tips: "Research and list multiple emergency vet options in your area and neighboring regions"
    },
    {
      category: "Care Instructions", 
      description: "Detailed care requirements and preferences",
      importance: "High",
      information: ["Feeding schedules and dietary needs", "Medication administration", "Behavioral notes and triggers", "Exercise and activity requirements"],
      tips: "Include specific brands of food and any behavioral issues that caregivers should know about"
    },
    {
      category: "Emergency Supplies",
      description: "Essential items for pet emergency preparedness",
      importance: "Medium",
      information: ["Food and water (3-day minimum)", "Medications and first aid supplies", "Carriers and leashes", "Comfort items and toys"],
      tips: "Rotate food and water supplies regularly and ensure carriers are large enough for comfort"
    },
    {
      category: "Temporary Care Plans",
      description: "Arrangements for emergency pet care",
      importance: "Medium",
      information: ["Emergency caregiver contacts", "Boarding facility information", "Pet-friendly shelter options", "Transportation arrangements"],
      tips: "Have backup plans for pet care and confirm arrangements with emergency caregivers in advance"
    }
  ];

  const preparednessSteps = [
    {
      step: 1,
      title: "Gather Medical Records",
      description: "Collect all veterinary records, vaccination certificates, and health information",
      timeframe: "Week 1"
    },
    {
      step: 2, 
      title: "Create Identification Kit",
      description: "Prepare identification documents, photos, and microchip information",
      timeframe: "Week 1"
    },
    {
      step: 3,
      title: "Establish Emergency Contacts",
      description: "Research and document emergency veterinary and boarding options", 
      timeframe: "Week 2"
    },
    {
      step: 4,
      title: "Prepare Emergency Supplies",
      description: "Assemble emergency kit with food, medications, and comfort items",
      timeframe: "Week 2"
    },
    {
      step: 5,
      title: "Plan Temporary Care",
      description: "Arrange emergency caregivers and confirm pet-friendly evacuation options",
      timeframe: "Week 3"
    }
  ];

  const petTips = [
    {
      category: "Identification",
      icon: FileText,
      tip: "Ensure all pets have current identification",
      details: "Keep ID tags, microchips, and registration current with your contact information."
    },
    {
      category: "Emergency Carriers", 
      icon: Shield,
      tip: "Have proper carriers ready for each pet",
      details: "Carriers should be sturdy, well-ventilated, and large enough for your pet to stand and turn around."
    },
    {
      category: "Familiar Items",
      icon: Heart,
      tip: "Include comfort items in emergency kits",
      details: "Favorite toys, blankets, or treats can help reduce stress during emergency situations."
    }
  ];

  const emergencyKit = [
    {
      category: "Food & Water",
      items: ["3-7 days of pet food", "Food and water bowls", "Manual can opener", "Water (1 gallon per pet per day)"]
    },
    {
      category: "Medical Supplies",
      items: ["Current medications", "First aid kit for pets", "Medical records in waterproof container", "Contact information for veterinarian"]
    },
    {
      category: "Comfort & Safety",
      items: ["Pet carriers or crates", "Leashes and harnesses", "Favorite toys and blankets", "Litter box and litter (for cats)"]
    },
    {
      category: "Important Documents",
      items: ["Vaccination certificates", "Registration and license info", "Recent photos", "Ownership documents"]
    }
  ];

  const petTypes = [
    {
      type: "Dogs",
      considerations: ["Leash and collar with ID", "Waste bags", "Favorite toys", "Rabies vaccination required"]
    },
    {
      type: "Cats",
      considerations: ["Secure carrier", "Litter and litter box", "Scratching post/pad", "Indoor-only identification"]
    },
    {
      type: "Small Animals",
      considerations: ["Appropriate sized carrier", "Species-specific food", "Bedding material", "Temperature considerations"]
    },
    {
      type: "Birds",
      considerations: ["Covered cage", "Seed mixture", "Familiar perches", "Quiet environment needs"]
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
                Pet Records
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Keep your pets safe during emergencies with organized medical records, identification documents, 
              and emergency care plans. Ensure your furry family members are protected too.
            </p>
          </div>
        </div>
      </section>

      {/* Pet Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Pet Emergency Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {petCategories.map((category, index) => (
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

      {/* Preparedness Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Pet Emergency Preparedness Process
          </h2>
          <div className="space-y-8">
            {preparednessSteps.map((step, index) => (
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

      {/* Pet Emergency Tips */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Pet Emergency Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {petTips.map((tip, index) => {
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

      {/* Emergency Kit Checklist */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Pet Emergency Kit Essentials
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
        </div>
      </section>

      {/* Pet-Specific Considerations */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Pet-Specific Emergency Considerations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {petTypes.map((pet, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{pet.type}</h3>
                <ul className="space-y-2">
                  {pet.considerations.map((consideration, considerationIndex) => (
                    <li key={considerationIndex} className="flex items-center text-[#A5A5A5]">
                      <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {consideration}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <Heart className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium mb-2">Remember</p>
            <p className="text-[#A5A5A5]">
              Not all emergency shelters accept pets. Research pet-friendly shelters and hotels in your area, 
              and have a plan for temporary boarding if needed.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your pet emergency records?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your pet medical records, identification, and emergency care information secure and accessible with FamilyVault.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-pet-records"
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