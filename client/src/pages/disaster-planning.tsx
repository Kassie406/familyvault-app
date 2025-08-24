import Navbar from "@/components/navbar";
import { AlertTriangle, Shield, FileText, Users, Home, Phone, Heart, Clock } from "lucide-react";

export default function DisasterPlanning() {
  const emergencyCategories = [
    {
      title: "Important Documents",
      icon: FileText,
      items: [
        "Insurance policies (home, auto, life, health)",
        "Property deeds and mortgage documents",
        "Birth certificates and passports",
        "Social Security cards",
        "Financial account information",
        "Wills and estate planning documents"
      ]
    },
    {
      title: "Emergency Contacts",
      icon: Phone,
      items: [
        "Family and friends contact list",
        "Medical professionals",
        "Insurance agents and companies",
        "Utility companies",
        "Local emergency services",
        "Out-of-state contact person"
      ]
    },
    {
      title: "Medical Information",
      icon: Heart,
      items: [
        "Medical conditions and allergies",
        "Current medications list",
        "Medical device information",
        "Healthcare provider contacts",
        "Prescription numbers",
        "Blood type and emergency medical info"
      ]
    },
    {
      title: "Home & Property",
      icon: Home,
      items: [
        "Home inventory with photos",
        "Utility shut-off locations",
        "Safe room or shelter locations",
        "Important item storage locations",
        "Security system information",
        "Evacuation route planning"
      ]
    }
  ];

  const preparednessSteps = [
    {
      step: "1",
      title: "Document Everything",
      description: "Gather and digitize all important family documents, storing them securely in FamilyVault"
    },
    {
      step: "2", 
      title: "Create Emergency Plans",
      description: "Develop family evacuation routes and communication plans for different disaster scenarios"
    },
    {
      step: "3",
      title: "Build Emergency Kits", 
      description: "Prepare disaster supply kits for home, work, and vehicles with essential supplies"
    },
    {
      step: "4",
      title: "Stay Informed",
      description: "Set up emergency alerts and maintain current information about local risks and resources"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-red-50 to-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Disaster Planning & Emergency Preparedness
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Be ready for any emergency with organized documents, clear plans, and accessible information 
            when you need it most. Protect your family with proper disaster preparedness.
          </p>
        </div>
      </section>

      {/* Emergency Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Essential Emergency Information
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Organize these critical categories to ensure your family is prepared for any disaster or emergency situation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {emergencyCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2.5 mr-3 flex-shrink-0"></div>
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

      {/* Preparedness Steps */}
      <section className="py-20 bg-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">4-Step Emergency Preparedness Plan</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Follow this comprehensive approach to protect your family and ensure you're ready for any emergency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {preparednessSteps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-red-100 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">72%</div>
              <p className="text-gray-700">of families are unprepared for emergencies</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">3 Days</div>
              <p className="text-gray-700">minimum emergency supply recommendation</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">24 Hours</div>
              <p className="text-gray-700">to create a comprehensive emergency plan</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Don't Wait for Disaster to Strike
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start organizing your emergency information today with FamilyVault's secure, accessible platform.
          </p>
          <a
            href="/signup"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Start Emergency Planning Now
          </a>
        </div>
      </section>
    </div>
  );
}