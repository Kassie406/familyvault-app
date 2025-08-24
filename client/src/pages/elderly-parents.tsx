import Navbar from "@/components/navbar";
import { Users, Heart, FileText, Shield, Home, Phone, Pills, Clock } from "lucide-react";

export default function ElderlyParents() {
  const careCategories = [
    {
      title: "Medical & Health Records",
      icon: Heart,
      items: [
        "Complete medical history",
        "Current medications list",
        "Healthcare provider contacts",
        "Insurance cards and policies",
        "Advanced directives and living wills",
        "Emergency medical information"
      ]
    },
    {
      title: "Legal & Financial Documents",
      icon: Shield,
      items: [
        "Power of attorney documents",
        "Will and estate planning papers",
        "Social Security and Medicare cards",
        "Bank and investment account info",
        "Property deeds and titles",
        "Tax documents and records"
      ]
    },
    {
      title: "Daily Care Information",
      icon: Home,
      items: [
        "Daily routine and preferences",
        "Emergency contact list",
        "Home safety modifications needed",
        "Transportation arrangements",
        "Meal planning and dietary restrictions",
        "Social activities and connections"
      ]
    },
    {
      title: "Professional Care Team",
      icon: Users,
      items: [
        "Primary care physician",
        "Specialists and therapists",
        "Home care providers",
        "Legal and financial advisors",
        "Pharmacy contacts",
        "Emergency services information"
      ]
    }
  ];

  const careTips = [
    {
      title: "Start Conversations Early",
      description: "Have open discussions about preferences and wishes while your parent is healthy and able to participate in planning decisions."
    },
    {
      title: "Organize Medical Information",
      description: "Keep a comprehensive list of medications, conditions, and healthcare providers easily accessible for emergencies."
    },
    {
      title: "Ensure Legal Documents are Current",
      description: "Review and update power of attorney, wills, and healthcare directives regularly to reflect current wishes."
    },
    {
      title: "Create a Support Network",
      description: "Build relationships with neighbors, community members, and professional services to provide comprehensive care."
    },
    {
      title: "Plan for Different Scenarios",
      description: "Consider various levels of care needed and research options from in-home assistance to residential care facilities."
    },
    {
      title: "Stay Connected and Involved",
      description: "Regular communication and involvement in decisions helps maintain dignity and quality of life for aging parents."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Caring for Elderly Parents
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Support your aging parents with organized information, coordinated care, and peace of mind. 
            Keep all essential documents and care details accessible when you need them most.
          </p>
        </div>
      </section>

      {/* Care Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Essential Information for Elder Care
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Organize these key areas to provide the best care and support for your aging parents.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {careCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2.5 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Care Tips */}
      <section className="py-20 bg-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Heart className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Compassionate Care Guidelines</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Proven strategies for providing loving, comprehensive care while maintaining your parent's independence and dignity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {careTips.map((tip, index) => (
              <div key={index} className="bg-purple-500 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3">{tip.title}</h3>
                <p className="text-purple-100 leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Elder Care by the Numbers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">53.4M</div>
              <p className="text-gray-700">Americans provide unpaid family caregiving</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">18 Hrs</div>
              <p className="text-gray-700">average weekly hours of care provided</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">61%</div>
              <p className="text-gray-700">of caregivers have full or part-time jobs</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Simplify Elder Care with Better Organization
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Keep all your parent's important information secure, organized, and accessible to family members and care providers.
          </p>
          <a
            href="/signup"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Start Organizing Care Information
          </a>
        </div>
      </section>
    </div>
  );
}