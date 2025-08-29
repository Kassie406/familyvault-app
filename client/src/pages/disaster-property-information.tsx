import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Home, CheckCircle, Calendar, Camera, Shield, ArrowRight, Clock, Users, AlertCircle, FileText, MapPin, Wrench } from "lucide-react";

export default function DisasterPropertyInformation() {
  const propertyCategories = [
    {
      category: "Property Documentation",
      description: "Essential property ownership and legal documents",
      importance: "Critical",
      information: ["Deed or title documents", "Mortgage/loan information", "Property tax records", "HOA agreements and bylaws"],
      tips: "Keep originals in safe storage and copies in emergency kit with account numbers and contact information"
    },
    {
      category: "Insurance Records",
      description: "Comprehensive insurance coverage documentation",
      importance: "Critical", 
      information: ["Homeowner's/renter's insurance policy", "Flood insurance documentation", "Earthquake or specialty coverage", "Recent policy updates and riders"],
      tips: "Include agent contact information and know your coverage limits and deductibles"
    },
    {
      category: "Home Inventory",
      description: "Detailed record of personal belongings and valuables",
      importance: "High",
      information: ["Room-by-room photo/video inventory", "Serial numbers for electronics", "Appraisals for valuable items", "Recent purchase receipts"],
      tips: "Update inventory annually and store digital copies in cloud storage separate from your home"
    },
    {
      category: "Property Specifications", 
      description: "Technical details about your home's construction and systems",
      importance: "High",
      information: ["Home construction details", "HVAC system specifications", "Electrical and plumbing layouts", "Roof age and materials"],
      tips: "This information helps with insurance claims and reconstruction if needed"
    },
    {
      category: "Maintenance Records",
      description: "Documentation of home improvements and repairs",
      importance: "Medium",
      information: ["Major renovation records", "Appliance warranties", "Service provider contacts", "Annual maintenance logs"],
      tips: "Keep receipts for improvements that add value and affect insurance coverage"
    },
    {
      category: "Utility Information",
      description: "Service provider accounts and emergency contacts",
      importance: "Medium",
      information: ["Utility account numbers", "Service provider contacts", "Shutoff valve locations", "Emergency utility numbers"],
      tips: "Know how to shut off gas, water, and electricity in case of emergency"
    }
  ];

  const inventorySteps = [
    {
      step: 1,
      title: "Document Property Details",
      description: "Gather all property ownership documents, insurance policies, and legal papers",
      timeframe: "Week 1"
    },
    {
      step: 2, 
      title: "Create Visual Inventory",
      description: "Take photos/videos of all rooms, belongings, and valuable items",
      timeframe: "Week 2"
    },
    {
      step: 3,
      title: "Record Specifications",
      description: "Document home systems, construction details, and technical specifications", 
      timeframe: "Week 2"
    },
    {
      step: 4,
      title: "Organize Digital Files",
      description: "Scan documents and organize all information in secure digital storage",
      timeframe: "Week 3"
    },
    {
      step: 5,
      title: "Update Regularly",
      description: "Review and update property information annually or after major changes",
      timeframe: "Annually"
    }
  ];

  const inventoryTips = [
    {
      category: "Visual Documentation",
      icon: Camera,
      tip: "Take comprehensive photos and videos of your belongings",
      details: "Document each room thoroughly, including inside closets, cabinets, and storage areas."
    },
    {
      category: "Secure Storage", 
      icon: Shield,
      tip: "Store copies in multiple secure locations",
      details: "Keep digital copies in cloud storage and physical copies away from your property."
    },
    {
      category: "Regular Updates",
      icon: Calendar,
      tip: "Update your inventory after major purchases or changes",
      details: "Add new items immediately and remove items you no longer own to keep inventory current."
    }
  ];

  const inventoryChecklist = [
    {
      category: "Living Areas",
      items: ["Furniture and fixtures", "Electronics and appliances", "Art and decorations", "Books and collections"]
    },
    {
      category: "Kitchen & Dining",
      items: ["Appliances and cookware", "China and glassware", "Small appliances", "Food storage items"]
    },
    {
      category: "Bedrooms",
      items: ["Bedroom furniture", "Clothing and accessories", "Personal electronics", "Jewelry and valuables"]
    },
    {
      category: "Storage & Utility",
      items: ["Tools and equipment", "Seasonal items", "Sports equipment", "Emergency supplies"]
    },
    {
      category: "Outdoor Items",
      items: ["Patio furniture", "Grills and outdoor equipment", "Landscaping tools", "Vehicles and recreational items"]
    },
    {
      category: "Important Details",
      items: ["Model and serial numbers", "Purchase dates and prices", "Warranty information", "Appraisal values"]
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
              <Home className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Property Information
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Document and protect your property and belongings for disaster preparedness. 
              Maintain comprehensive records for insurance claims and recovery planning.
            </p>
          </div>
        </div>
      </section>

      {/* Property Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Property Information Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertyCategories.map((category, index) => (
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

      {/* Documentation Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Property Documentation Process
          </h2>
          <div className="space-y-8">
            {inventorySteps.map((step, index) => (
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

      {/* Property Documentation Tips */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Property Documentation Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {inventoryTips.map((tip, index) => {
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

      {/* Home Inventory Checklist */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Comprehensive Home Inventory Checklist
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventoryChecklist.map((area, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">{area.category}</h3>
                <ul className="space-y-2">
                  {area.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-[#A5A5A5] text-sm">
                      <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-xl p-6 text-center">
            <Camera className="w-8 h-8 text-[#FFD43B] mx-auto mb-3" />
            <p className="text-[#FFD43B] font-medium mb-2">Pro Tip: Document Everything</p>
            <p className="text-[#A5A5A5]">
              Take wide shots of each room, then close-ups of valuable items. Include serial numbers, 
              model numbers, and any unique identifying features in your documentation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to document your property information?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your property documents, home inventory, and important records secure and organized with FamilyCircle Secure.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-property"
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