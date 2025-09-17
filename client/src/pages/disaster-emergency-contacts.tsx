import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Phone, CheckCircle, Calendar, MapPin, Shield, ArrowRight, Clock, Users, AlertCircle, Heart, UserCheck, Building } from "lucide-react";

export default function DisasterEmergencyContacts() {
  const contactCategories = [
    {
      category: "Primary Emergency Services",
      description: "Essential emergency service numbers for immediate response",
      importance: "Critical",
      contacts: ["911 Emergency Services", "Local Police Department", "Fire Department", "Emergency Medical Services"],
      tips: "Program these numbers into all family phones and keep written copies in multiple locations"
    },
    {
      category: "Family & Close Friends",
      description: "Immediate family members and trusted friends for emergencies",
      importance: "Critical", 
      contacts: ["Spouse/Partner contact", "Children's emergency contacts", "Parents/Siblings", "Close family friends"],
      tips: "Include out-of-state contacts who can coordinate if local lines are down"
    },
    {
      category: "Medical Contacts",
      description: "Healthcare providers and medical emergency contacts",
      importance: "High",
      contacts: ["Primary care physician", "Specialists and therapists", "Pharmacy contact", "Hospital emergency room"],
      tips: "Include after-hours numbers and nearest trauma centers"
    },
    {
      category: "Workplace & School", 
      description: "Work and educational institution emergency contacts",
      importance: "High",
      contacts: ["Employer emergency line", "HR department", "School district emergency", "Children's schools"],
      tips: "Know workplace and school emergency procedures and communication methods"
    },
    {
      category: "Utilities & Services",
      description: "Essential service providers for emergencies",
      importance: "Medium",
      contacts: ["Electric utility company", "Gas company emergency", "Water department", "Internet/phone provider"],
      tips: "Keep utility account numbers with contact information for faster service"
    },
    {
      category: "Insurance & Financial",
      description: "Insurance companies and financial institution contacts",
      importance: "High",
      contacts: ["Home/renters insurance", "Auto insurance company", "Health insurance", "Bank emergency services"],
      tips: "Have policy numbers ready and know 24-hour claim reporting procedures"
    }
  ];

  const organizationSteps = [
    {
      step: 1,
      title: "Gather All Contact Information",
      description: "Collect phone numbers, addresses, and account information for all essential contacts",
      timeframe: "Week 1"
    },
    {
      step: 2, 
      title: "Create Emergency Contact Cards",
      description: "Make wallet-sized cards with critical contacts for each family member",
      timeframe: "Week 1"
    },
    {
      step: 3,
      title: "Program Into All Devices",
      description: "Add emergency contacts to all phones, tablets, and communication devices", 
      timeframe: "Week 2"
    },
    {
      step: 4,
      title: "Distribute and Post Contact Lists",
      description: "Place contact lists in vehicles, workplace, and key locations around home",
      timeframe: "Week 2"
    },
    {
      step: 5,
      title: "Update and Test Regularly",
      description: "Review contacts quarterly and test communication methods annually",
      timeframe: "Ongoing"
    }
  ];

  const contactTips = [
    {
      category: "Local Contacts",
      icon: MapPin,
      tip: "Include neighbors and local support network",
      details: "Trusted neighbors can provide immediate assistance and check on your property during emergencies."
    },
    {
      category: "Out-of-Area Contacts", 
      icon: Phone,
      tip: "Designate an out-of-state family contact person",
      details: "During local disasters, long-distance calls often work when local calls don't."
    },
    {
      category: "Multiple Methods",
      icon: Users,
      tip: "Have multiple ways to reach each contact",
      details: "Include home, work, cell, and email for each person. Social media can also be useful during emergencies."
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
              <Phone className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Emergency Contacts
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize all essential emergency contact information in one secure, accessible place. 
              Ensure your family can quickly reach help when it matters most.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Emergency Contact Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contactCategories.map((category, index) => (
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
                  <h4 className="text-sm font-medium text-white mb-2">Key Contacts:</h4>
                  <ul className="space-y-1">
                    {category.contacts.map((contact, contactIndex) => (
                      <li key={contactIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {contact}
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
            Emergency Contact Organization Process
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

      {/* Contact Organization Tips */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Emergency Contact Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactTips.map((tip, index) => {
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

      {/* Emergency Communication Plan */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Family Emergency Communication Plan
          </h2>
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Include in Your Plan:</h3>
                <ul className="space-y-2 text-[#A5A5A5]">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Meeting locations (local and out-of-area)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Out-of-state contact person
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Work and school emergency plans
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Social media check-in procedures
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Essential Information for Each Contact:</h3>
                <ul className="space-y-2 text-[#A5A5A5]">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Multiple phone numbers (home, work, cell)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Email addresses
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Physical addresses
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Relationship and why they're included
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
            Ready to organize your emergency contacts?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your emergency contact information secure and accessible when you need it most with FamilyCircle Secure.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-emergency-contacts"
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