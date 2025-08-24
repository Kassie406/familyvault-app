import Navbar from "@/components/navbar";
import { Baby, FileText, Shield, Users, Heart, Clock, CheckCircle, Star } from "lucide-react";

export default function ChildInformation() {
  const essentialDocuments = [
    {
      category: "Birth & Identity",
      icon: Baby,
      documents: [
        "Birth certificate (certified copies)",
        "Social Security card",
        "Passport/ID documents",
        "Adoption papers (if applicable)"
      ]
    },
    {
      category: "Medical Records",
      icon: Heart,
      documents: [
        "Vaccination records",
        "Medical history and allergies",
        "Insurance cards and policies",
        "Emergency medical information"
      ]
    },
    {
      category: "Education",
      icon: FileText,
      documents: [
        "School enrollment forms",
        "Report cards and transcripts",
        "IEP/504 plan documents",
        "Educational assessments"
      ]
    },
    {
      category: "Legal & Financial",
      icon: Shield,
      documents: [
        "Custody agreements",
        "Guardianship documents",
        "Child support orders",
        "Trust or savings account info"
      ]
    }
  ];

  const tips = [
    "Keep digital copies of all documents in FamilyVault for easy access during emergencies",
    "Update medical information regularly, especially allergy and medication details",
    "Share access with trusted family members, babysitters, and school contacts",
    "Create emergency contact lists with backup caregivers and medical professionals"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Baby className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Child Information Organization
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Keep all your child's important documents organized, secure, and easily accessible. 
            From birth certificates to school records, ensure you're prepared for any situation.
          </p>
        </div>
      </section>

      {/* Essential Documents */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Essential Documents for Every Child
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Organize your child's important information into these key categories for complete family preparedness.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {essentialDocuments.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
                  </div>
                  <ul className="space-y-3">
                    {category.documents.map((doc, docIndex) => (
                      <li key={docIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pro Tips */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Pro Tips for Parents</h2>
            <p className="text-xl opacity-90">
              Smart strategies to keep your child's information organized and accessible
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <span className="text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-lg leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Start Organizing Your Child's Information Today
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of parents who trust FamilyVault to keep their children's important documents safe and organized.
          </p>
          <a
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Get Started Free
          </a>
        </div>
      </section>
    </div>
  );
}