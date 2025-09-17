import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Shield, Calendar, FileText, Bell, CheckCircle, AlertTriangle, Smartphone, Users } from "lucide-react";

export default function Immunizations() {
  const immunizationCategories = [
    {
      icon: Shield,
      title: "Vaccination Records",
      description: "Complete immunization history with dates and provider information",
      examples: ["MMR - 12/15/2019 - Dr. Johnson", "COVID-19 - 03/22/2022 - CVS Pharmacy", "Flu shot - 09/10/2023 - Urgent Care", "Tetanus booster - 05/08/2021", "HPV series - completed 2022"]
    },
    {
      icon: Calendar,
      title: "Upcoming Vaccines",
      description: "Scheduled immunizations and recommended vaccination timeline",
      examples: ["Annual flu shot - October 2024", "COVID booster - due March 2024", "Meningitis - age 16 (2026)", "Travel vaccines if needed", "School requirement updates"]
    },
    {
      icon: FileText,
      title: "School Requirements",
      description: "State and school-specific immunization requirements",
      examples: ["Illinois state requirements", "Private school additional needs", "Sports physical requirements", "Camp vaccination forms", "International travel requirements"]
    },
    {
      icon: Bell,
      title: "Reminder System",
      description: "Automated alerts for upcoming vaccinations and boosters",
      examples: ["30-day advance reminders", "Appointment booking alerts", "Insurance coverage notifications", "Provider contact information", "Seasonal vaccine reminders"]
    }
  ];

  const vaccineSchedule = [
    {
      vaccine: "Annual Flu Shot",
      lastDate: "October 12, 2023",
      nextDue: "October 2024",
      provider: "Dr. Sarah Johnson",
      status: "Current",
      statusColor: "text-green-400"
    },
    {
      vaccine: "COVID-19 Booster",
      lastDate: "March 22, 2023",
      nextDue: "March 2024",
      provider: "CVS Pharmacy",
      status: "Due Soon",
      statusColor: "text-yellow-400"
    },
    {
      vaccine: "Tetanus/Tdap",
      lastDate: "May 8, 2021",
      nextDue: "May 2031",
      provider: "Urgent Care Plus",
      status: "Current",
      statusColor: "text-green-400"
    },
    {
      vaccine: "MMR (Measles, Mumps, Rubella)",
      lastDate: "December 15, 2019",
      nextDue: "Complete",
      provider: "Dr. Sarah Johnson",
      status: "Complete",
      statusColor: "text-blue-400"
    },
    {
      vaccine: "Meningitis ACWY",
      lastDate: "Not yet received",
      nextDue: "Age 16 (2026)",
      provider: "TBD",
      status: "Future",
      statusColor: "text-gray-400"
    }
  ];

  const schoolRequirements = [
    { requirement: "MMR (2 doses)", status: "Complete", date: "12/15/2019" },
    { requirement: "Polio (4 doses)", status: "Complete", date: "08/22/2018" },
    { requirement: "DTaP/Tdap (5 doses)", status: "Complete", date: "05/08/2021" },
    { requirement: "Varicella (2 doses)", status: "Complete", date: "01/10/2020" },
    { requirement: "Hepatitis B (3 doses)", status: "Complete", date: "09/15/2017" },
    { requirement: "Annual TB screening", status: "Current", date: "08/15/2023" }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F3F4F6]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#0B0B0B] to-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#D4AF37] font-medium bg-[rgba(212,175,55,0.08)] px-4 py-2 rounded-full border border-[rgba(212,175,55,0.25)] mb-6">
              <Shield className="w-5 h-5" />
              Immunizations
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Complete Immunization Tracking
            </h1>
            <p className="text-xl text-[#CCCCCC] max-w-3xl mx-auto">
              Keep all vaccination records organized with automated reminders for upcoming immunizations and school requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Immunization Categories */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Complete Vaccination Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {immunizationCategories.map((category, index) => {
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

      {/* Vaccination Schedule */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Sample Vaccination Schedule
          </h2>
          
          <div className="gold-card rounded-2xl p-8">
            <div className="space-y-4">
              {vaccineSchedule.map((vaccine, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[rgba(212,175,55,0.05)] rounded-lg border border-[rgba(212,175,55,0.2)]">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1">{vaccine.vaccine}</h4>
                    <div className="text-sm text-[#CCCCCC]">
                      Last: {vaccine.lastDate} | Provider: {vaccine.provider}
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0 md:text-right">
                    <div className="text-[#D4AF37] font-medium mb-1">Next Due: {vaccine.nextDue}</div>
                    <div className={`text-sm font-semibold ${vaccine.statusColor}`}>{vaccine.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* School Requirements */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            School Immunization Requirements
          </h2>
          
          <div className="gold-card rounded-2xl p-8">
            <h3 className="text-xl font-bold text-[#D4AF37] mb-6">Illinois State Requirements - Current Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schoolRequirements.map((req, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[rgba(212,175,55,0.05)] rounded-lg border border-[rgba(212,175,55,0.2)]">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white font-medium">{req.requirement}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 text-sm font-semibold">{req.status}</div>
                    <div className="text-[#CCCCCC] text-xs">{req.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Never Miss an Important Vaccination
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Smart Reminders</h3>
              <p className="text-[#CCCCCC]">Get automated reminders for upcoming vaccinations and booster shots.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">School Compliance</h3>
              <p className="text-[#CCCCCC]">Track state and school requirements to ensure your child stays compliant.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Digital Records</h3>
              <p className="text-[#CCCCCC]">Access vaccination records instantly for school, travel, or medical appointments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Track Your Child's Immunizations?
          </h2>
          <p className="text-xl text-[#CCCCCC] mb-8">
            Keep vaccination records organized with automated reminders and school compliance tracking.
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