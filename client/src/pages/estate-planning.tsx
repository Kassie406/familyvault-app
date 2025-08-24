import Navbar from "@/components/navbar";
import { FileText, Shield, Users, Heart, Home, DollarSign, Clock, CheckCircle } from "lucide-react";

export default function EstatePlanning() {
  const essentialDocuments = [
    {
      title: "Wills & Trusts",
      icon: FileText,
      items: [
        "Last will and testament",
        "Living trust documents",
        "Pour-over will",
        "Trust amendments and modifications",
        "Executor and trustee information",
        "Beneficiary designations"
      ]
    },
    {
      title: "Power of Attorney",
      icon: Shield,
      items: [
        "Durable power of attorney for finances",
        "Healthcare power of attorney",
        "Limited power of attorney documents",
        "Agent contact information",
        "Backup agent designations",
        "Specific authority limitations"
      ]
    },
    {
      title: "Healthcare Directives",
      icon: Heart,
      items: [
        "Living will/advance directive",
        "Healthcare proxy designation",
        "DNR orders (if applicable)",
        "Organ donation authorization",
        "Medical preferences document",
        "HIPAA authorization forms"
      ]
    },
    {
      title: "Financial Accounts",
      icon: DollarSign,
      items: [
        "Bank and investment accounts",
        "Retirement account beneficiaries",
        "Life insurance policies",
        "Property titles and deeds",
        "Business ownership documents",
        "Digital asset inventory"
      ]
    }
  ];

  const planningSteps = [
    {
      step: "1",
      title: "Inventory Your Assets",
      description: "List all property, accounts, investments, and personal belongings with their current values"
    },
    {
      step: "2",
      title: "Choose Your Beneficiaries",
      description: "Decide who will inherit your assets and consider contingent beneficiaries for all scenarios"
    },
    {
      step: "3",
      title: "Select Trusted Representatives",
      description: "Choose executors, trustees, and agents who will handle your affairs responsibly"
    },
    {
      step: "4",
      title: "Create Legal Documents",
      description: "Work with an attorney to draft wills, trusts, and other necessary legal documents"
    },
    {
      step: "5",
      title: "Review and Update Regularly",
      description: "Update your plan after major life events and review annually for changes"
    },
    {
      step: "6",
      title: "Communicate Your Wishes",
      description: "Share your plans with family and ensure important people know their roles"
    }
  ];

  const benefits = [
    "Avoid probate court delays and expenses",
    "Minimize estate taxes for your beneficiaries",
    "Protect minor children with guardian designations",
    "Ensure healthcare wishes are honored",
    "Maintain privacy of family financial matters",
    "Prevent family disputes and confusion"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Estate Planning Essentials
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Protect your family's future with comprehensive estate planning. Organize wills, trusts, 
            and important documents to ensure your wishes are carried out and your loved ones are cared for.
          </p>
        </div>
      </section>

      {/* Essential Documents */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Essential Estate Planning Documents
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These critical documents form the foundation of a comprehensive estate plan that protects your assets and family.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {essentialDocuments.map((category, index) => {
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

      {/* Planning Steps */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">6-Step Estate Planning Process</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Follow this systematic approach to create a comprehensive estate plan that protects your family's future
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {planningSteps.map((item, index) => (
              <div key={index} className="bg-green-500 rounded-xl p-6">
                <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mb-4">
                  <span className="text-lg font-bold">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-green-100 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits of Proper Estate Planning</h2>
            <p className="text-lg text-gray-600">
              A well-organized estate plan provides peace of mind and protects your family in numerous ways
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mr-4 flex-shrink-0" />
                <span className="text-gray-800 font-medium">{benefit}</span>
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
              <div className="text-4xl font-bold text-green-600 mb-2">68%</div>
              <p className="text-gray-700">of Americans don't have a will</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">$12,000</div>
              <p className="text-gray-700">average probate cost that can be avoided</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">18 Months</div>
              <p className="text-gray-700">average time to settle an estate without planning</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Start Organizing Your Estate Plan Today
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Keep all your estate planning documents secure and organized in one place with FamilyVault's trusted platform.
          </p>
          <a
            href="/signup"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Secure Your Family's Future
          </a>
        </div>
      </section>
    </div>
  );
}