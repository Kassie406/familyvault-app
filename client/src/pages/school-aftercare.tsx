import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { GraduationCap, Clock, Users, FileText, Calendar, MapPin, Phone, AlertCircle } from "lucide-react";

export default function SchoolAftercare() {
  const schoolCategories = [
    {
      icon: GraduationCap,
      title: "School Information",
      description: "School contacts, enrollment documents, and academic records",
      examples: ["School contact information", "Teacher contact details", "Principal's office", "School nurse", "Enrollment forms"]
    },
    {
      icon: Clock,
      title: "Daily Schedule",
      description: "Class schedules, pickup times, and after-school activities",
      examples: ["Morning drop-off: 8:00 AM", "Pickup time: 3:15 PM", "Early dismissal Wednesdays", "Bus route #42", "After-school care until 6 PM"]
    },
    {
      icon: Users,
      title: "Authorized Contacts",
      description: "People authorized to pick up your child and emergency contacts",
      examples: ["Mom: Jane Smith", "Dad: John Smith", "Grandma: Mary Johnson", "Aunt: Sarah Wilson", "Family friend: Lisa Brown"]
    },
    {
      icon: Calendar,
      title: "Important Dates",
      description: "School events, holidays, and special programs",
      examples: ["Parent-teacher conferences", "School holidays", "Field trip dates", "Testing schedules", "School picture day"]
    }
  ];

  const emergencyProtocols = [
    {
      title: "School Closure",
      description: "What happens when school closes unexpectedly",
      protocol: "Child will be held at school until authorized pickup person arrives. School will call primary contacts in order."
    },
    {
      title: "Medical Emergency", 
      description: "Medical emergency procedures at school",
      protocol: "School nurse will provide first aid, call 911 if needed, and contact parents immediately. EpiPen stored in nurse's office."
    },
    {
      title: "Late Pickup",
      description: "Protocol for late pickup situations",
      protocol: "Child waits in main office after 3:30 PM. After 6 PM, emergency contacts will be called. Late fees may apply."
    }
  ];

  const contacts = [
    { role: "Main Office", name: "Lincoln Elementary", phone: "(555) 123-4567", email: "office@lincoln.edu" },
    { role: "Teacher", name: "Mrs. Anderson (Grade 3)", phone: "(555) 123-4568", email: "anderson@lincoln.edu" },
    { role: "School Nurse", name: "Nurse Roberts", phone: "(555) 123-4569", email: "nurse@lincoln.edu" },
    { role: "After-Care Director", name: "Ms. Thompson", phone: "(555) 123-4570", email: "aftercare@lincoln.edu" }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F3F4F6]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#0B0B0B] to-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#D4AF37] font-medium bg-[rgba(212,175,55,0.08)] px-4 py-2 rounded-full border border-[rgba(212,175,55,0.25)] mb-6">
              <GraduationCap className="w-5 h-5" />
              School & Aftercare
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Complete School Information Management
            </h1>
            <p className="text-xl text-[#CCCCCC] max-w-3xl mx-auto">
              Keep all school contacts, schedules, and important information organized for teachers, caregivers, and emergency situations.
            </p>
          </div>
        </div>
      </section>

      {/* School Categories */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Everything You Need to Organize
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {schoolCategories.map((category, index) => {
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

      {/* Contact Directory */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            School Contact Directory
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contacts.map((contact, index) => (
              <div key={index} className="gold-card rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#D4AF37] mb-2">{contact.role}</h3>
                <p className="text-white font-semibold mb-4">{contact.name}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-[#CCCCCC]">{contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-[#CCCCCC]">{contact.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Protocols */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Emergency Protocols & Procedures
          </h2>
          
          <div className="space-y-8">
            {emergencyProtocols.map((protocol, index) => (
              <div key={index} className="gold-card rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[rgba(212,175,55,0.1)] rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{protocol.title}</h3>
                    <p className="text-[#CCCCCC] mb-4">{protocol.description}</p>
                    <div className="bg-[rgba(212,175,55,0.05)] border border-[rgba(212,175,55,0.2)] rounded-lg p-4">
                      <p className="text-[#D4AF37] font-medium">{protocol.protocol}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Always Accessible When You Need It
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Quick Access</h3>
              <p className="text-[#CCCCCC]">Find school contacts and information instantly, even in emergency situations.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Share Safely</h3>
              <p className="text-[#CCCCCC]">Securely share information with babysitters, grandparents, and authorized caregivers.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Stay Updated</h3>
              <p className="text-[#CCCCCC]">Get reminders for important dates and never miss school events or deadlines.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Organize Your School Information?
          </h2>
          <p className="text-xl text-[#CCCCCC] mb-8">
            Keep all school contacts, schedules, and important documents in one secure place.
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