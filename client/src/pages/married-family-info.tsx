import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Users, CheckCircle, Calendar, Phone, Shield, ArrowRight, Clock, Heart, AlertCircle, FileText, UserCheck, Baby } from "lucide-react";

export default function MarriedFamilyInfo() {
  const familyCategories = [
    {
      category: "Emergency Contacts",
      description: "Critical contact information for family emergencies",
      importance: "Critical",
      documents: ["Family emergency contact list", "Medical emergency contacts", "Work contact information", "Neighbor contact info"],
      tips: "Keep this list updated and share with both families - include work numbers and after-hours contacts"
    },
    {
      category: "Family Medical Info",
      description: "Health information and medical history for both families",
      importance: "Critical", 
      documents: ["Medical history records", "Current medications", "Doctor contact information", "Health insurance cards"],
      tips: "Include allergies, chronic conditions, and preferred hospitals for each family member"
    },
    {
      category: "Extended Family Details",
      description: "Information about both families and important relationships",
      importance: "High",
      documents: ["Family tree documentation", "Important dates & anniversaries", "Family contact directory", "Gift preferences & traditions"],
      tips: "Document family traditions, important dates, and preferred communication methods for each family member"
    },
    {
      category: "Children Planning", 
      description: "Documentation related to family planning and future children",
      importance: "High",
      documents: ["Family planning documents", "Childcare research", "School district information", "Pediatrician contacts"],
      tips: "Even if not immediate, research childcare options and family-friendly neighborhoods in your area"
    },
    {
      category: "Pet Information",
      description: "Documentation for family pets and their care",
      importance: "Medium",
      documents: ["Pet medical records", "Veterinarian contacts", "Pet insurance policies", "Emergency pet care"],
      tips: "Include microchip information and create care instructions for pet-sitters or emergencies"
    },
    {
      category: "Family Traditions",
      description: "Documentation of family customs, holidays, and traditions",
      importance: "Medium",
      documents: ["Holiday traditions", "Recipe collections", "Family stories & history", "Photo organization"],
      tips: "Create a shared family calendar with both families' important dates and traditions"
    }
  ];

  const organizationSteps = [
    {
      step: 1,
      title: "Collect Contact Information",
      description: "Gather emergency contacts, medical information, and important phone numbers from both families",
      timeframe: "Week 1"
    },
    {
      step: 2, 
      title: "Document Medical History",
      description: "Compile medical histories, current medications, and healthcare provider information",
      timeframe: "Week 2"
    },
    {
      step: 3,
      title: "Create Family Directory",
      description: "Build a comprehensive contact directory with preferences and important dates", 
      timeframe: "Week 3"
    },
    {
      step: 4,
      title: "Plan for the Future",
      description: "Document family planning goals, childcare research, and long-term family plans",
      timeframe: "Month 1"
    },
    {
      step: 5,
      title: "Establish Traditions",
      description: "Blend family traditions and create new ones that work for your new household",
      timeframe: "Ongoing"
    }
  ];

  const familyTips = [
    {
      category: "Communication",
      icon: Phone,
      tip: "Establish regular communication schedules with both families",
      details: "Set up group chats, regular calls, or family dinners to maintain strong relationships with extended family."
    },
    {
      category: "Boundaries", 
      icon: Shield,
      tip: "Create healthy boundaries while building relationships",
      details: "Discuss and establish comfortable boundaries with extended family regarding visits, advice, and involvement in decisions."
    },
    {
      category: "Traditions",
      icon: Heart,
      tip: "Blend traditions from both families thoughtfully",
      details: "Take the best from both families' traditions and create new ones that represent your new household."
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
              <Users className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Family Information
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize and manage important information about your extended families, emergency contacts, 
              medical histories, and family traditions in one secure place.
            </p>
          </div>
        </div>
      </section>

      {/* Family Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Family Information Areas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {familyCategories.map((category, index) => (
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

      {/* Organization Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Family Information Organization Process
          </h2>
          <div className="space-y-8">
            {organizationSteps.map((step, index) => (
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

      {/* Family Relationship Tips */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Building Strong Family Relationships
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {familyTips.map((tip, index) => {
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

      {/* Emergency Preparedness */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Emergency Preparedness for Your Family
          </h2>
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Emergency Contacts List Should Include:</h3>
                <ul className="space-y-2 text-[#A5A5A5]">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Both partners' work contacts
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Parents and siblings from both families
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Close friends and trusted neighbors
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Primary care doctors and specialists
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Medical Information to Document:</h3>
                <ul className="space-y-2 text-[#A5A5A5]">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Current medications and dosages
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Known allergies and reactions
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Chronic conditions and treatments
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Insurance information and ID numbers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your family information?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your family contacts, medical information, and important details secure and organized with FamilyVault.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-family"
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