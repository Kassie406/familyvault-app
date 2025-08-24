import Navbar from "@/components/navbar";
import { Package, Truck, Home, FileText, Users, MapPin, Calendar, CheckCircle } from "lucide-react";

export default function Moving() {
  const movingCategories = [
    {
      title: "Important Documents",
      icon: FileText,
      items: [
        "Birth certificates and passports",
        "Social Security cards", 
        "Marriage and divorce certificates",
        "Military service records",
        "Medical and dental records",
        "School transcripts and diplomas",
        "Insurance policies and claims",
        "Tax returns (last 3-7 years)",
        "Investment and bank statements",
        "Legal documents (wills, power of attorney)"
      ]
    },
    {
      title: "Moving Logistics",
      icon: Truck,
      items: [
        "Moving company contracts and estimates",
        "Inventory lists with photos",
        "Moving insurance documentation",
        "Utility shut-off and setup schedules",
        "Address change notifications list",
        "School transfer paperwork",
        "Pet transportation arrangements",
        "Storage unit rental agreements"
      ]
    },
    {
      title: "Home Documentation",
      icon: Home,
      items: [
        "Property deed and mortgage papers",
        "Home inspection reports",
        "Warranty information for appliances",
        "HOA documents and contact info",
        "Repair and maintenance records",
        "Property tax assessments",
        "Homeowner's insurance policies",
        "Security system information"
      ]
    },
    {
      title: "Contact Updates",
      icon: Users,
      items: [
        "Bank and credit card companies",
        "Employer HR department",
        "Insurance providers (auto, health, life)",
        "Subscription services",
        "Government agencies (IRS, DMV, voter registration)",
        "Healthcare providers and pharmacies",
        "Children's schools and activities",
        "Professional service providers"
      ]
    }
  ];

  const movingTimeline = [
    {
      timeframe: "8-10 Weeks Before",
      tasks: [
        "Research and book moving company",
        "Create moving binder/digital folder",
        "Start decluttering and organizing",
        "Research new area schools and services"
      ]
    },
    {
      timeframe: "6-8 Weeks Before",
      tasks: [
        "Order moving supplies",
        "Start using up frozen/perishable foods",
        "Research utility providers in new area",
        "Begin school transfer process if needed"
      ]
    },
    {
      timeframe: "4-6 Weeks Before",
      tasks: [
        "Start change of address notifications",
        "Schedule utility disconnection/connection",
        "Arrange pet transportation if needed",
        "Begin packing non-essential items"
      ]
    },
    {
      timeframe: "2-4 Weeks Before",
      tasks: [
        "Confirm moving day details",
        "Arrange child/pet care for moving day",
        "Use up remaining perishables",
        "Pack everything except essentials"
      ]
    },
    {
      timeframe: "Moving Week",
      tasks: [
        "Pack essentials and survival kit",
        "Confirm details with moving company",
        "Do final walk-through documentation",
        "Prepare cash for tips and unexpected costs"
      ]
    },
    {
      timeframe: "After Moving",
      tasks: [
        "Update voter registration",
        "Register children for new schools",
        "Find new healthcare providers",
        "Update emergency contacts everywhere"
      ]
    }
  ];

  const packingTips = [
    {
      category: "Essential Documents Box",
      description: "Pack all important documents in a clearly labeled box that travels with you, not the moving truck."
    },
    {
      category: "First Day Survival Kit", 
      description: "Pack essentials like medications, phone chargers, snacks, and basic toiletries in an easily accessible bag."
    },
    {
      category: "Room-by-Room Organization",
      description: "Color-code boxes by room and number them. Keep a master list of box contents for easy unpacking."
    },
    {
      category: "Valuables and Jewelry",
      description: "Transport valuable items, jewelry, and sentimental objects personally rather than with the moving company."
    },
    {
      category: "Digital Inventory",
      description: "Take photos or video of valuable items and box contents for insurance purposes and unpacking reference."
    },
    {
      category: "New Home Preparation",
      description: "Have utilities connected, security systems activated, and basic supplies ready before moving day."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-cyan-50 to-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-cyan-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Moving & Relocation Guide
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Make your move stress-free with organized planning and documentation. Keep track of 
            important documents, logistics, and address changes throughout your relocation process.
          </p>
        </div>
      </section>

      {/* Moving Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Essential Moving Organization
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Keep these important categories organized throughout your move to ensure nothing gets lost or forgotten.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {movingCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-cyan-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-cyan-500 mr-3 flex-shrink-0 mt-0.5" />
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

      {/* Moving Timeline */}
      <section className="py-20 bg-cyan-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Calendar className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Moving Timeline Checklist</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Stay organized and on track with this comprehensive moving timeline
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {movingTimeline.map((period, index) => (
              <div key={index} className="bg-cyan-500 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">{period.timeframe}</h3>
                <ul className="space-y-2">
                  {period.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="text-cyan-100 text-sm leading-relaxed">
                      • {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packing Tips */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Package className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Smart Packing & Organization Tips</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Expert strategies to make your move more efficient and reduce stress
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packingTips.map((tip, index) => (
              <div key={index} className="bg-cyan-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{tip.category}</h3>
                <p className="text-gray-700 leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Moving Statistics */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-cyan-600 mb-2">40M</div>
              <p className="text-gray-700">Americans move each year</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-600 mb-2">8-10</div>
              <p className="text-gray-700">weeks ideal planning timeline</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-600 mb-2">62%</div>
              <p className="text-gray-700">of people find moving stressful</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Make Your Next Move Stress-Free
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Keep all your moving documents, checklists, and important information organized and accessible throughout your relocation.
          </p>
          <a
            href="/signup"
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Organize Your Move
          </a>
        </div>
      </section>
    </div>
  );
}