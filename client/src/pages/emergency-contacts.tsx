import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Phone, MapPin, Heart, Shield, Clock, AlertTriangle, Users, Star } from "lucide-react";

export default function EmergencyContacts() {
  const contactCategories = [
    {
      icon: Heart,
      title: "Primary Contacts",
      description: "Parents, guardians, and primary emergency contacts",
      examples: ["Mom: Jane Smith (555) 123-4567", "Dad: John Smith (555) 987-6543", "Primary guardian relationship", "Work phone numbers", "Preferred contact method"]
    },
    {
      icon: Users,
      title: "Secondary Contacts",
      description: "Extended family and trusted friends for backup emergencies",
      examples: ["Grandma: Mary Johnson (555) 234-5678", "Uncle: Bob Wilson (555) 345-6789", "Family friend: Lisa Brown", "Neighbor: Tom Davis", "Godparent: Sarah Martinez"]
    },
    {
      icon: Shield,
      title: "Medical Contacts",
      description: "Healthcare providers and medical emergency information",
      examples: ["Pediatrician: Dr. Sarah Johnson", "Emergency clinic: Urgent Care Plus", "Preferred hospital: Children's Medical", "Pharmacy: CVS on Main St", "Poison Control: 1-800-222-1222"]
    },
    {
      icon: AlertTriangle,
      title: "Critical Information",
      description: "Essential details for emergency responders",
      examples: ["Home address with gate code", "Medical conditions & allergies", "Current medications", "Insurance information", "Special emergency instructions"]
    }
  ];

  const emergencyContacts = [
    {
      category: "Primary",
      contacts: [
        { name: "Jane Smith (Mom)", phone: "(555) 123-4567", relationship: "Mother", priority: "1st", available: "24/7" },
        { name: "John Smith (Dad)", phone: "(555) 987-6543", relationship: "Father", priority: "2nd", available: "24/7" }
      ]
    },
    {
      category: "Secondary",
      contacts: [
        { name: "Mary Johnson", phone: "(555) 234-5678", relationship: "Grandmother", priority: "3rd", available: "6 AM - 10 PM" },
        { name: "Bob Wilson", phone: "(555) 345-6789", relationship: "Uncle", priority: "4th", available: "8 AM - 9 PM" }
      ]
    },
    {
      category: "Medical",
      contacts: [
        { name: "Dr. Sarah Johnson", phone: "(555) 111-2222", relationship: "Pediatrician", priority: "Medical", available: "Office Hours" },
        { name: "Children's Hospital", phone: "(555) 333-4444", relationship: "Emergency Hospital", priority: "Emergency", available: "24/7" }
      ]
    }
  ];

  const criticalInfo = [
    { label: "Home Address", value: "123 Oak Street, Springfield, IL 62701", icon: MapPin },
    { label: "Gate/Access Code", value: "#1234 - Side entrance available", icon: Shield },
    { label: "Medical Conditions", value: "Peanut allergy (severe), Asthma", icon: Heart },
    { label: "Current Medications", value: "EpiPen, Albuterol inhaler", icon: AlertTriangle },
    { label: "Insurance", value: "Blue Cross Blue Shield - ID: ABC123456", icon: Star },
    { label: "Preferred Hospital", value: "Children's Medical Center", icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F3F4F6]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#0B0B0B] to-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#D4AF37] font-medium bg-[rgba(212,175,55,0.08)] px-4 py-2 rounded-full border border-[rgba(212,175,55,0.25)] mb-6">
              <Phone className="w-5 h-5" />
              Emergency Contacts
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Complete Emergency Contact Management
            </h1>
            <p className="text-xl text-[#CCCCCC] max-w-3xl mx-auto">
              Keep all emergency contacts organized and accessible for schools, caregivers, and first responders when every second counts.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Categories */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Complete Emergency Contact System
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contactCategories.map((category, index) => {
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

      {/* Emergency Contact Directory */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Sample Emergency Contact Directory
          </h2>
          
          <div className="space-y-8">
            {emergencyContacts.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="text-2xl font-bold text-[#D4AF37] mb-6">{group.category} Contacts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {group.contacts.map((contact, contactIndex) => (
                    <div key={contactIndex} className="gold-card rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-white">{contact.name}</h4>
                          <p className="text-[#D4AF37]">{contact.relationship}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-[#CCCCCC]">Priority: {contact.priority}</div>
                          <div className="text-sm text-[#CCCCCC]">Available: {contact.available}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-white font-semibold">{contact.phone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Critical Information */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Critical Emergency Information
          </h2>
          
          <div className="gold-card rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {criticalInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-4 bg-[rgba(212,175,55,0.05)] rounded-lg border border-[rgba(212,175,55,0.2)]">
                    <div className="w-10 h-10 bg-[rgba(212,175,55,0.1)] rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[#D4AF37] font-semibold mb-1">{info.label}</h4>
                      <p className="text-white">{info.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Always Available When You Need It Most
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Instant Access</h3>
              <p className="text-[#CCCCCC]">Get emergency contact information instantly, even when you're stressed or in a hurry.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Secure Sharing</h3>
              <p className="text-[#CCCCCC]">Safely share contact information with schools, babysitters, and family members.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Multiple Contacts</h3>
              <p className="text-[#CCCCCC]">Organize primary, secondary, and medical contacts with priority levels and availability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Organize Your Emergency Contacts?
          </h2>
          <p className="text-xl text-[#CCCCCC] mb-8">
            Keep all emergency information organized and accessible when every second counts.
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