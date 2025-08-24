import Navbar from "@/components/navbar";
import { Heart, FileText, DollarSign, Users, Home, Shield, Calendar, CheckCircle } from "lucide-react";

export default function GettingMarried() {
  const weddingCategories = [
    {
      title: "Legal Documents",
      icon: FileText,
      items: [
        "Marriage license application",
        "Birth certificates for both partners",
        "Divorce decrees (if applicable)",
        "Prenuptial agreement",
        "Name change documents",
        "Passport and ID updates"
      ]
    },
    {
      title: "Financial Planning",
      icon: DollarSign,
      items: [
        "Joint bank account setup",
        "Insurance beneficiary updates",
        "Credit report reviews",
        "Budget planning documents",
        "Investment account consolidation",
        "Tax filing status changes"
      ]
    },
    {
      title: "Wedding Planning",
      icon: Calendar,
      items: [
        "Venue contracts and permits",
        "Vendor agreements and receipts",
        "Guest list and RSVP tracking",
        "Wedding insurance policy",
        "Timeline and ceremony details",
        "Photography and videography contracts"
      ]
    },
    {
      title: "Post-Wedding Tasks",
      icon: Home,
      items: [
        "Will and estate plan updates",
        "Emergency contact changes",
        "Healthcare proxy designations",
        "Property ownership transfers",
        "Employer benefit updates",
        "Social Security notifications"
      ]
    }
  ];

  const planningTimeline = [
    {
      timeframe: "12+ Months Before",
      tasks: [
        "Discuss and create prenuptial agreement if needed",
        "Start financial planning conversations",
        "Research and book major vendors",
        "Apply for marriage license"
      ]
    },
    {
      timeframe: "6-12 Months Before", 
      tasks: [
        "Review and update insurance policies",
        "Plan joint financial accounts",
        "Finalize wedding vendor contracts",
        "Send save-the-dates to guests"
      ]
    },
    {
      timeframe: "3-6 Months Before",
      tasks: [
        "Send wedding invitations",
        "Finalize guest list and seating",
        "Update emergency contacts",
        "Plan honeymoon logistics"
      ]
    },
    {
      timeframe: "After the Wedding",
      tasks: [
        "Process name change documents",
        "Update all official records and accounts",
        "File marriage certificate copies",
        "Update estate planning documents"
      ]
    }
  ];

  const financialTips = [
    "Discuss money management styles and create a unified approach",
    "Review all debts and create a repayment strategy together",
    "Update insurance beneficiaries on all policies immediately",
    "Consider the tax implications of your new filing status",
    "Plan for major future expenses like home buying or children",
    "Maintain some individual financial independence"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-pink-50 to-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-pink-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Getting Married
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Organize all the important documents and decisions that come with marriage. From wedding planning 
            to legal changes, keep everything secure and accessible as you start your new life together.
          </p>
        </div>
      </section>

      {/* Wedding Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Essential Marriage Documentation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Keep track of all the important documents and decisions involved in getting married and building your life together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {weddingCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-pink-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-pink-500 mr-3 flex-shrink-0 mt-0.5" />
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

      {/* Planning Timeline */}
      <section className="py-20 bg-pink-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Calendar className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Wedding Planning Timeline</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Stay organized with this comprehensive timeline for managing all marriage-related documents and decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {planningTimeline.map((period, index) => (
              <div key={index} className="bg-pink-500 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">{period.timeframe}</h3>
                <ul className="space-y-2">
                  {period.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="text-pink-100 text-sm leading-relaxed">
                      • {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Tips */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <DollarSign className="w-12 h-12 text-pink-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Financial Planning for Newlyweds</h2>
            <p className="text-lg text-gray-600">
              Smart money management tips for couples starting their financial journey together
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {financialTips.map((tip, index) => (
              <div key={index} className="flex items-start p-4 bg-pink-50 rounded-lg">
                <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <span className="text-gray-800">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Start Your Married Life Organized
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Keep all your wedding documents, financial changes, and important information secure and organized in one place.
          </p>
          <a
            href="/signup"
            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Organize Your Wedding Documents
          </a>
        </div>
      </section>
    </div>
  );
}