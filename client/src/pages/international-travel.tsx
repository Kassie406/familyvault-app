import Navbar from "@/components/navbar";
import { Plane, FileText, Shield, Heart, MapPin, Clock, CheckCircle, BookOpen } from "lucide-react";

export default function InternationalTravel() {
  const travelCategories = [
    {
      title: "Travel Documents",
      icon: BookOpen,
      items: [
        "Passport (valid for 6+ months)",
        "Visa documents and permits",
        "Travel itinerary and confirmations",
        "Driver's license and IDP",
        "Birth certificates for children",
        "Marriage certificate (if needed)"
      ]
    },
    {
      title: "Health & Medical",
      icon: Heart,
      items: [
        "Vaccination records and certificates",
        "Prescription medications with labels",
        "Medical insurance travel coverage",
        "Doctor's letter for medical conditions",
        "Emergency medical contact information",
        "Blood type and allergy information"
      ]
    },
    {
      title: "Financial & Insurance",
      icon: Shield,
      items: [
        "Travel insurance policy documents",
        "Credit and debit card information",
        "Bank contact numbers for international use",
        "Emergency cash and backup payment methods",
        "Trip cancellation insurance",
        "Embassy and consulate contact info"
      ]
    },
    {
      title: "Emergency Preparedness",
      icon: FileText,
      items: [
        "Emergency contact list",
        "Copies of all important documents",
        "Local emergency service numbers",
        "Embassy registration information",
        "Travel advisory updates",
        "Communication plan with family"
      ]
    }
  ];

  const travelTips = [
    {
      title: "Document Preparation",
      description: "Make multiple copies of important documents and store them separately. Keep digital copies in secure cloud storage accessible offline."
    },
    {
      title: "Health Precautions",
      description: "Research required vaccinations and health precautions for your destination. Pack a comprehensive first-aid kit with prescription medications."
    },
    {
      title: "Financial Planning",
      description: "Notify banks of travel plans, research currency exchange rates, and have multiple payment methods including emergency cash."
    },
    {
      title: "Communication Setup",
      description: "Set up international phone plans, download offline maps and translation apps, and share detailed itinerary with family."
    },
    {
      title: "Cultural Research",
      description: "Learn about local customs, laws, and etiquette. Understand entry/exit requirements and any restricted items."
    },
    {
      title: "Emergency Planning",
      description: "Register with your embassy, know local emergency numbers, and have evacuation insurance if traveling to high-risk areas."
    }
  ];

  const preFlightChecklist = [
    "Passport valid for 6+ months from travel date",
    "Visa obtained and printed (if required)",
    "Travel insurance purchased and documented",
    "Vaccinations completed and recorded",
    "Bank and credit card companies notified",
    "International driving permit obtained",
    "Embassy registration completed",
    "Emergency contacts shared with family",
    "Prescription medications properly labeled",
    "Important documents copied and stored",
    "Local currency exchanged",
    "International phone plan activated"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50 to-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plane className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            International Travel Planning
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Travel internationally with confidence and preparation. Organize all essential documents, 
            health records, and emergency information for safe and smooth international adventures.
          </p>
        </div>
      </section>

      {/* Travel Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Essential International Travel Documents
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ensure you have all necessary documents organized and accessible for international travel.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {travelCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0 mt-0.5" />
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

      {/* Travel Tips */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <MapPin className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Smart Travel Planning Tips</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Expert advice for safe, organized, and enjoyable international travel experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {travelTips.map((tip, index) => (
              <div key={index} className="bg-indigo-500 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3">{tip.title}</h3>
                <p className="text-indigo-100 leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-Flight Checklist */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Clock className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pre-Departure Checklist</h2>
            <p className="text-lg text-gray-600">
              Complete this checklist before your international trip to ensure you're fully prepared
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {preFlightChecklist.map((item, index) => (
              <div key={index} className="flex items-center p-4 bg-indigo-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-indigo-600 mr-4 flex-shrink-0" />
                <span className="text-gray-800">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Statistics */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">180</div>
              <p className="text-gray-700">countries requiring valid passport</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">6 Months</div>
              <p className="text-gray-700">recommended passport validity period</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">72 Hours</div>
              <p className="text-gray-700">minimum advance planning recommended</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Travel the World with Confidence
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Keep all your international travel documents organized, secure, and easily accessible wherever you go.
          </p>
          <a
            href="/signup"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Organize Travel Documents
          </a>
        </div>
      </section>
    </div>
  );
}