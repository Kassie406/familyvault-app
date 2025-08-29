import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Heart, CheckCircle, Calendar, Users, Shield, ArrowRight, Clock, Camera, Music, AlertCircle, FileText, MapPin, Utensils } from "lucide-react";

export default function MarriedWeddingPlanning() {
  const weddingCategories = [
    {
      category: "Vendor Management",
      description: "Organize all your wedding vendor information and contracts",
      importance: "Critical",
      documents: ["Venue contracts", "Catering agreements", "Photography contracts", "Music/DJ contracts"],
      tips: "Keep all vendor contracts in one place with payment schedules and contact information easily accessible"
    },
    {
      category: "Guest Management",
      description: "Track guest lists, RSVPs, and seating arrangements",
      importance: "Critical", 
      documents: ["Master guest list", "RSVP tracking", "Dietary restrictions", "Seating chart planning"],
      tips: "Maintain separate lists for ceremony and reception if different, and track plus-ones carefully"
    },
    {
      category: "Budget Tracking",
      description: "Monitor wedding expenses and payments",
      importance: "High",
      documents: ["Budget spreadsheet", "Payment receipts", "Vendor invoices", "Final expense summary"],
      tips: "Set aside 10% of your budget for unexpected costs and track expenses weekly"
    },
    {
      category: "Timeline & Logistics", 
      description: "Detailed planning schedules and day-of coordination",
      importance: "High",
      documents: ["Wedding day timeline", "Setup/breakdown schedules", "Transportation plans", "Emergency contact lists"],
      tips: "Create detailed timelines for the week leading up to the wedding, not just the wedding day"
    },
    {
      category: "Legal Documents",
      description: "Marriage license and legal requirements",
      importance: "Critical",
      documents: ["Marriage license", "Officiant credentials", "Witness information", "Name change documents"],
      tips: "Apply for your marriage license well in advance - requirements vary by state and some have waiting periods"
    },
    {
      category: "Post-Wedding Tasks",
      description: "Organization for after the wedding celebration",
      importance: "Medium",
      documents: ["Thank you card tracking", "Gift registry management", "Photo/video collection", "Vendor reviews"],
      tips: "Create a system for tracking thank you notes sent and received gifts to ensure no one is missed"
    }
  ];

  const planningTimeline = [
    {
      timeframe: "12+ Months Before",
      tasks: ["Set budget and guest list", "Book venue and major vendors", "Choose wedding party"],
      priority: "Critical"
    },
    {
      timeframe: "6-12 Months Before", 
      tasks: ["Send save-the-dates", "Choose photographer/videographer", "Plan honeymoon"],
      priority: "High"
    },
    {
      timeframe: "3-6 Months Before",
      tasks: ["Send invitations", "Finalize menu and flowers", "Schedule dress fittings"],
      priority: "High"
    },
    {
      timeframe: "1-3 Months Before",
      tasks: ["Final guest count", "Create seating chart", "Confirm all details with vendors"],
      priority: "Critical"
    },
    {
      timeframe: "1 Week Before",
      tasks: ["Final preparations", "Rehearsal dinner", "Pack for honeymoon"],
      priority: "Medium"
    }
  ];

  const budgetGuide = [
    { category: "Venue & Catering", percentage: "40-50%", description: "Location, food, and beverages" },
    { category: "Photography/Videography", percentage: "10-15%", description: "Capturing your special day" },
    { category: "Attire & Beauty", percentage: "8-10%", description: "Dress, suit, hair, makeup" },
    { category: "Flowers & Decor", percentage: "8-10%", description: "Bouquets, centerpieces, decorations" },
    { category: "Music & Entertainment", percentage: "8-10%", description: "DJ, band, or other entertainment" },
    { category: "Miscellaneous", percentage: "10-15%", description: "Rings, invitations, transportation" }
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
                Wedding Planning
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize every detail of your wedding planning process. From vendor contracts to guest lists, 
              keep all your wedding documentation and planning materials in one secure place.
            </p>
          </div>
        </div>
      </section>

      {/* Wedding Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Wedding Planning Areas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {weddingCategories.map((category, index) => (
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
                  <h4 className="text-sm font-medium text-white mb-2">Key Documents:</h4>
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

      {/* Planning Timeline */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Wedding Planning Timeline
          </h2>
          <div className="space-y-6">
            {planningTimeline.map((phase, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{phase.timeframe}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    phase.priority === 'Critical' 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : phase.priority === 'High'
                      ? 'bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {phase.priority}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {phase.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2 flex-shrink-0" />
                      <span className="text-[#A5A5A5] text-sm">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Budget Guide */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Wedding Budget Allocation Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgetGuide.map((budget, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">{budget.category}</h3>
                  <span className="text-[#FFD43B] font-bold text-lg">{budget.percentage}</span>
                </div>
                <p className="text-[#A5A5A5] text-sm">{budget.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium">
              Remember to set aside 5-10% of your total budget for unexpected expenses or last-minute changes.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your wedding planning?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your wedding planning documents, vendor contracts, and important details secure and organized with FamilyCircle Secure.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-wedding"
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