import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { MapPin, CheckCircle, Calendar, Route, Shield, ArrowRight, Clock, Users, AlertCircle, Phone, Home, Car } from "lucide-react";

export default function DisasterEmergencyPlan() {
  const planCategories = [
    {
      category: "Evacuation Routes",
      description: "Multiple planned routes out of your area",
      importance: "Critical",
      information: ["Primary evacuation route", "Secondary/backup routes", "Meeting locations along routes", "Route maps and directions"],
      tips: "Plan multiple routes in case primary roads are blocked - practice driving these routes with your family"
    },
    {
      category: "Meeting Locations",
      description: "Designated family meeting points during emergencies",
      importance: "Critical", 
      information: ["Neighborhood meeting spot", "Local community center", "Out-of-area meeting location", "Contact information for each location"],
      tips: "Choose locations that are easily accessible and known to all family members"
    },
    {
      category: "Communication Plan",
      description: "How family members will contact and find each other",
      importance: "High",
      information: ["Out-of-state contact person", "Family communication methods", "Social media check-in procedures", "Emergency notification systems"],
      tips: "Long-distance calls often work when local calls don't - designate someone in another state as your contact hub"
    },
    {
      category: "Emergency Supplies", 
      description: "Location and contents of emergency supply kits",
      importance: "High",
      information: ["Home emergency kit contents", "Vehicle emergency supplies", "Workplace emergency items", "Go-bag locations and contents"],
      tips: "Keep emergency supplies in multiple locations and ensure all family members know where they are"
    },
    {
      category: "Special Considerations",
      description: "Plans for family members with special needs",
      importance: "Medium",
      information: ["Medical equipment and medications", "Pet evacuation plans", "Elderly or disabled family member needs", "Child care arrangements"],
      tips: "Account for mobility issues, medical needs, and pet transportation in your emergency planning"
    },
    {
      category: "Important Information",
      description: "Critical details for emergency situations",
      importance: "Medium",
      information: ["Utility shut-off locations", "Important document locations", "Insurance agent contacts", "Local emergency services"],
      tips: "Ensure all adult family members know how to shut off utilities and access important documents"
    }
  ];

  const planningSteps = [
    {
      step: 1,
      title: "Map Your Area",
      description: "Identify potential hazards and plan evacuation routes from your home, work, and school",
      timeframe: "Week 1"
    },
    {
      step: 2, 
      title: "Choose Meeting Places",
      description: "Select local and distant meeting locations that are familiar to all family members",
      timeframe: "Week 1"
    },
    {
      step: 3,
      title: "Establish Communication",
      description: "Set up communication procedures and designate an out-of-area contact person", 
      timeframe: "Week 2"
    },
    {
      step: 4,
      title: "Create Action Plans",
      description: "Develop specific procedures for different types of emergencies",
      timeframe: "Week 2-3"
    },
    {
      step: 5,
      title: "Practice and Update",
      description: "Practice your emergency plan regularly and update as circumstances change",
      timeframe: "Bi-annually"
    }
  ];

  const emergencyTypes = [
    {
      type: "Natural Disasters",
      icon: AlertCircle,
      considerations: ["Earthquakes, hurricanes, tornadoes", "Flooding and severe weather", "Wildfires", "Winter storms"],
      actions: "Know your area's most likely disasters and specific response procedures"
    },
    {
      type: "Home Emergencies", 
      icon: Home,
      considerations: ["House fires", "Gas leaks", "Power outages", "Water main breaks"],
      actions: "Practice evacuation routes and know utility shutoff locations"
    },
    {
      type: "Community Events",
      icon: Users,
      considerations: ["Large-scale evacuations", "Chemical spills", "Transportation accidents", "Public health emergencies"],
      actions: "Stay informed through local emergency alerts and official communications"
    }
  ];

  const evacuationKit = [
    {
      category: "Documents & Information",
      items: ["Important documents (copies)", "Emergency contact list", "Maps with evacuation routes marked", "Cash and credit cards"]
    },
    {
      category: "Personal Items",
      items: ["3-day supply of clothing", "Personal hygiene items", "Prescription medications", "Glasses/contact lenses"]
    },
    {
      category: "Emergency Supplies",
      items: ["Battery-powered radio", "Flashlights and batteries", "First aid kit", "Multi-tool or Swiss Army knife"]
    },
    {
      category: "Food & Water",
      items: ["Non-perishable food (3 days)", "Water (1 gallon per person per day)", "Manual can opener", "Paper plates and utensils"]
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
              <MapPin className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Emergency Plan
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Create comprehensive evacuation routes and emergency procedures for your family. 
              Be prepared with clear plans for different disaster scenarios and safe meeting locations.
            </p>
          </div>
        </div>
      </section>

      {/* Plan Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Emergency Plan Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {planCategories.map((category, index) => (
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
                  <h4 className="text-sm font-medium text-white mb-2">Key Elements:</h4>
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

      {/* Planning Steps */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Emergency Plan Development Process
          </h2>
          <div className="space-y-8">
            {planningSteps.map((step, index) => (
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

      {/* Emergency Types */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Plan for Different Emergency Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {emergencyTypes.map((emergency, index) => {
              const IconComponent = emergency.icon;
              return (
                <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="w-12 h-12 bg-[#FFD43B]/10 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-[#FFD43B]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{emergency.type}</h3>
                  <div className="mb-4">
                    <ul className="space-y-1">
                      {emergency.considerations.map((consideration, considerationIndex) => (
                        <li key={considerationIndex} className="flex items-center text-[#A5A5A5] text-sm">
                          <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                          {consideration}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-[#FFD43B] text-sm font-medium">{emergency.actions}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Evacuation Kit */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Emergency Evacuation Kit Checklist
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {evacuationKit.map((kit, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{kit.category}</h3>
                <ul className="space-y-2">
                  {kit.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-[#A5A5A5]">
                      <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <Route className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-medium mb-2">Practice Makes Perfect</p>
            <p className="text-[#A5A5A5]">
              Practice your evacuation plan at least twice a year. Time your routes, ensure everyone knows meeting locations, 
              and update your plan as family circumstances change.
            </p>
          </div>
        </div>
      </section>

      {/* Family Communication Plan */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Family Emergency Communication Template
          </h2>
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Meeting Locations:</h3>
                <ul className="space-y-2 text-[#A5A5A5]">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Local meeting place (neighborhood)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Regional meeting place (outside neighborhood)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Out-of-state meeting place
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Essential Contact Info:</h3>
                <ul className="space-y-2 text-[#A5A5A5]">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Out-of-state contact person
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Local emergency services
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#FFD43B] mr-2" />
                    Work and school contacts
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
            Ready to create your emergency plan?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all your emergency plans, evacuation routes, and critical information organized and accessible with FamilyVault.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-emergency-plan"
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