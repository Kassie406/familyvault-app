import Navbar from "@/components/navbar";
import { Leaf, Heart, FileText, Users, Shield, Phone, Clock, CheckCircle } from "lucide-react";

export default function WhenSomeoneDies() {
  const immediateSteps = [
    {
      title: "First 24-48 Hours",
      icon: Clock,
      items: [
        "Contact funeral home or medical examiner",
        "Obtain death certificates (order 10-15 copies)",
        "Notify immediate family and close friends",
        "Contact deceased's employer if applicable",
        "Secure the home and valuable possessions",
        "Care for dependents and pets"
      ]
    },
    {
      title: "Important Notifications",
      icon: Phone,
      items: [
        "Social Security Administration",
        "Banks and credit card companies",
        "Insurance companies (life, health, auto)",
        "Employer benefits department",
        "Medicare/Medicaid offices",
        "Utility companies and landlord"
      ]
    },
    {
      title: "Legal and Financial",
      icon: Shield,
      items: [
        "Locate will and contact estate attorney",
        "Contact financial advisor or accountant",
        "Freeze bank accounts and credit",
        "Notify investment and retirement accounts",
        "Contact life insurance beneficiaries",
        "Review and cancel subscriptions"
      ]
    },
    {
      title: "Ongoing Support",
      icon: Heart,
      items: [
        "Arrange grief counseling if needed",
        "Connect with community support groups",
        "Take care of your own health",
        "Ask for help from friends and family",
        "Consider professional organizers",
        "Document important memories"
      ]
    }
  ];

  const essentialDocuments = [
    {
      category: "Identity Documents",
      documents: [
        "Death certificate (multiple copies)",
        "Birth certificate",
        "Marriage certificate",
        "Divorce decree (if applicable)",
        "Military discharge papers",
        "Social Security card"
      ]
    },
    {
      category: "Financial Records", 
      documents: [
        "Bank and investment statements",
        "Credit card statements",
        "Tax returns (last 3-5 years)",
        "Property deeds and mortgages",
        "Loan documents and debts",
        "Business ownership papers"
      ]
    },
    {
      category: "Insurance Policies",
      documents: [
        "Life insurance policies",
        "Health insurance cards",
        "Auto insurance policies",
        "Homeowner's/renter's insurance",
        "Disability insurance",
        "Long-term care insurance"
      ]
    },
    {
      category: "Estate Planning",
      documents: [
        "Last will and testament",
        "Trust documents",
        "Power of attorney forms",
        "Advanced healthcare directives",
        "Beneficiary designations",
        "Funeral and burial instructions"
      ]
    }
  ];

  const timeline = [
    {
      period: "Immediately",
      tasks: [
        "Call 911 or medical examiner",
        "Contact funeral home",
        "Notify immediate family",
        "Secure the deceased's home"
      ]
    },
    {
      period: "Within 1-2 Days",
      tasks: [
        "Order death certificates",
        "Contact Social Security",
        "Notify banks and employers",
        "Begin funeral arrangements"
      ]
    },
    {
      period: "Within 1 Week",
      tasks: [
        "Meet with estate attorney",
        "Contact insurance companies",
        "Cancel credit cards and subscriptions",
        "Notify government agencies"
      ]
    },
    {
      period: "Within 1 Month",
      tasks: [
        "File life insurance claims",
        "Transfer or close accounts",
        "Pay immediate bills and debts",
        "Begin probate process if needed"
      ]
    },
    {
      period: "Ongoing",
      tasks: [
        "File final tax returns",
        "Distribute assets per will",
        "Close estate accounts",
        "Keep detailed records"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            When Someone Dies
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Navigate this difficult time with compassionate guidance and organized support. 
            Keep important documents accessible and know the essential steps to take when you lose a loved one.
          </p>
        </div>
      </section>

      {/* Immediate Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Immediate Steps and Important Actions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Essential actions organized by priority to help you through the first days and weeks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {immediateSteps.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
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

      {/* Essential Documents */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FileText className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Essential Documents You'll Need</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Having these documents organized and accessible will help manage affairs more efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {essentialDocuments.map((category, index) => (
              <div key={index} className="bg-green-500 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">{category.category}</h3>
                <ul className="space-y-2">
                  {category.documents.map((doc, docIndex) => (
                    <li key={docIndex} className="text-green-100 text-sm leading-relaxed">
                      • {doc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Timeline for Managing Affairs</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A helpful timeline to guide you through the process of settling a loved one's affairs
            </p>
          </div>

          <div className="space-y-8">
            {timeline.map((period, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-32">
                  <div className="bg-green-100 rounded-lg p-4 text-center">
                    <span className="text-sm font-bold text-green-800">{period.period}</span>
                  </div>
                </div>
                <div className="ml-6 flex-1">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <ul className="grid md:grid-cols-2 gap-3">
                      {period.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Resources */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-12 h-12 text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Remember: You Don't Have to Do This Alone
          </h2>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Losing someone is one of life's most difficult experiences. While handling practical matters is important, 
              remember to take care of yourself and accept help from others.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Professional Help</h3>
                <p className="text-sm text-gray-600">Estate attorneys, financial advisors, and funeral directors</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Emotional Support</h3>
                <p className="text-sm text-gray-600">Grief counselors, support groups, and trusted friends</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Practical Assistance</h3>
                <p className="text-sm text-gray-600">Family members, organizers, and community resources</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Keep Important Information Organized
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Having essential documents and information organized in advance can provide peace of mind and make difficult times more manageable.
          </p>
          <a
            href="/signup"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Organize Important Documents
          </a>
        </div>
      </section>
    </div>
  );
}