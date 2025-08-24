import Navbar from "@/components/navbar";
import { Users, Baby, Heart, Shield, Home, DollarSign, FileText, CheckCircle } from "lucide-react";

export default function StartingAFamily() {
  const familyCategories = [
    {
      title: "Pre-Conception Planning",
      icon: Heart,
      items: [
        "Health insurance coverage review",
        "Pre-conception medical checkups",
        "Genetic counseling records",
        "Prenatal vitamin prescriptions",
        "Fertility treatment documentation",
        "Family medical history compilation"
      ]
    },
    {
      title: "Pregnancy Documentation",
      icon: Baby,
      items: [
        "Prenatal care appointment records",
        "Ultrasound images and reports",
        "Medical test results and screenings",
        "Hospital pre-registration forms",
        "Birth plan and preferences",
        "Maternity/paternity leave paperwork"
      ]
    },
    {
      title: "Financial Planning",
      icon: DollarSign,
      items: [
        "Budget adjustments for child expenses",
        "Life insurance policy updates",
        "529 education savings plan",
        "Healthcare FSA or HSA setup",
        "Emergency fund planning",
        "Childcare cost research and contracts"
      ]
    },
    {
      title: "Legal Preparations",
      icon: Shield,
      items: [
        "Will and estate plan updates",
        "Guardianship designations",
        "Healthcare proxy for pregnancy",
        "Power of attorney documents",
        "Beneficiary updates on all accounts",
        "Hospital emergency contacts"
      ]
    }
  ];

  const preparationTimeline = [
    {
      phase: "Pre-Conception",
      timeframe: "6-12 months before",
      tasks: [
        "Schedule medical consultations",
        "Review and update insurance coverage",
        "Start taking prenatal vitamins",
        "Create family health history records"
      ]
    },
    {
      phase: "Early Pregnancy",
      timeframe: "First trimester",
      tasks: [
        "Confirm pregnancy and choose healthcare provider",
        "Update emergency contacts everywhere",
        "Research maternity/paternity leave policies",
        "Start documenting prenatal appointments"
      ]
    },
    {
      phase: "Mid Pregnancy",
      timeframe: "Second trimester",
      tasks: [
        "Complete genetic screening tests",
        "Shop for life insurance if needed",
        "Begin nursery planning and baby-proofing",
        "Research pediatricians in your area"
      ]
    },
    {
      phase: "Late Pregnancy",
      timeframe: "Third trimester",
      tasks: [
        "Complete hospital pre-registration",
        "Pack hospital bag with essentials",
        "Finalize birth plan and preferences",
        "Prepare newborn documentation needs"
      ]
    }
  ];

  const financialConsiderations = [
    {
      category: "One-Time Costs",
      items: ["Hospital delivery fees", "Baby gear and furniture", "Car seat and stroller", "Nursery setup"]
    },
    {
      category: "Ongoing Expenses", 
      items: ["Childcare or daycare", "Health insurance premiums", "Baby food and supplies", "Clothing and diapers"]
    },
    {
      category: "Long-Term Planning",
      items: ["College savings (529 plan)", "Increased life insurance", "Emergency fund expansion", "Future housing needs"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50 to-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Starting a Family
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Prepare for your family's arrival with organized planning and documentation. From pre-conception 
            through birth and beyond, keep all essential information secure and accessible.
          </p>
        </div>
      </section>

      {/* Family Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Essential Family Planning Documentation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Organize these important areas as you prepare for and welcome your growing family.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {familyCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
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

      {/* Preparation Timeline */}
      <section className="py-20 bg-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Baby className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Family Planning Timeline</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              A comprehensive timeline to help you prepare for each stage of starting your family
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {preparationTimeline.map((phase, index) => (
              <div key={index} className="bg-orange-500 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2">{phase.phase}</h3>
                <p className="text-orange-200 text-sm mb-4">{phase.timeframe}</p>
                <ul className="space-y-2">
                  {phase.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="text-orange-100 text-sm leading-relaxed">
                      • {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Considerations */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <DollarSign className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Financial Planning for New Parents</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Understand the financial aspects of starting a family and plan accordingly
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {financialConsiderations.map((consideration, index) => (
              <div key={index} className="bg-orange-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{consideration.category}</h3>
                <ul className="space-y-3">
                  {consideration.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2.5 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">$12,980</div>
              <p className="text-gray-700">average cost of first year with baby</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">40 Weeks</div>
              <p className="text-gray-700">time to prepare during pregnancy</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">3 Months</div>
              <p className="text-gray-700">ideal emergency fund increase</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Start Your Family Journey Prepared
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Keep all your family planning documents, medical records, and important information organized and secure.
          </p>
          <a
            href="/signup"
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Organize Family Planning Documents
          </a>
        </div>
      </section>
    </div>
  );
}