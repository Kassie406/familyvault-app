import { Users, Shield, UserCheck, Settings, Clock, Share2 } from 'lucide-react';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ElderlyCareTeamAccess() {
  const accessCategories = [
    {
      icon: Users,
      title: "Family Members",
      description: "Give family members appropriate access to information",
      features: ["Adult Children Access", "Sibling Coordination", "Emergency Family Contact", "Permission Levels"]
    },
    {
      icon: UserCheck,
      title: "Healthcare Providers",
      description: "Share medical information with doctors and specialists",
      features: ["Primary Care Physician", "Specialist Access", "Hospital Information", "Medical Records Sharing"]
    },
    {
      icon: Shield,
      title: "Professional Caregivers",
      description: "Provide access to home health aides and nursing staff",
      features: ["Home Health Aides", "Visiting Nurses", "Physical Therapists", "Care Coordinators"]
    },
    {
      icon: Settings,
      title: "Legal Representatives",
      description: "Share information with attorneys and legal advisors",
      features: ["Estate Attorney", "Power of Attorney", "Legal Guardian", "Financial Advisor"]
    },
    {
      icon: Clock,
      title: "Temporary Access",
      description: "Grant time-limited access for specific situations",
      features: ["Emergency Access", "Travel Coverage", "Temporary Caregivers", "Respite Care"]
    },
    {
      icon: Share2,
      title: "Information Sharing",
      description: "Control what information is shared with whom",
      features: ["Medical Information", "Financial Details", "Emergency Contacts", "Property Information"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#121212] to-[#0E0E0E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-[#FFD43B] mr-2" />
              <span className="text-[#FFD43B] text-sm font-medium">Care Team Access Management</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Care Team Access for Elderly Parents
            </h1>
            
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Securely share your elderly parents' information with family members, healthcare providers, and caregivers. Control who has access to what information and when.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pricing"
              data-testid="button-get-started"
              className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-3 rounded-full hover:bg-[#E6C140] transition-colors"
            >
              Start Managing Access
            </a>
            <a
              href="/elderly-parents"
              data-testid="button-back-elder-care"
              className="inline-flex items-center justify-center border border-[#FFD43B] text-[#FFD43B] font-semibold px-8 py-3 rounded-full hover:bg-[#FFD43B]/10 transition-colors"
            >
              Back to Elder Care
            </a>
          </div>
        </div>
      </section>

      {/* Access Categories */}
      <section className="py-16 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Comprehensive Care Team Management
            </h2>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto">
              Organize and control access for everyone involved in your elderly parents' care.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accessCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div 
                  key={index}
                  data-testid={`access-category-${index + 1}`}
                  className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8 hover:border-[#FFD43B]/30 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#FFD43B]/10 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-[#FFD43B]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">{category.title}</h3>
                  <p className="text-[#A5A5A5] mb-6">{category.description}</p>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-[#FFD43B] mb-3">Access Features:</h4>
                    <ul className="space-y-2">
                      {category.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-[#CCCCCC]">
                          <div className="w-1.5 h-1.5 bg-[#FFD43B] rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    data-testid={`button-manage-${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="w-full mt-6 bg-[#FFD43B] text-[#0E0E0E] font-semibold py-3 rounded-lg hover:bg-[#E6C140] transition-colors flex items-center justify-center"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage {category.title}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Secure Access Control
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8 text-center">
              <Shield className="w-12 h-12 text-[#FFD43B] mx-auto mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Permission Levels</h3>
              <p className="text-[#A5A5A5] mb-4">Control exactly what information each person can access</p>
              <ul className="text-sm text-[#CCCCCC] space-y-2">
                <li>• View-only access</li>
                <li>• Edit permissions</li>
                <li>• Emergency access</li>
                <li>• Time-limited access</li>
              </ul>
            </div>
            
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8 text-center">
              <UserCheck className="w-12 h-12 text-[#FFD43B] mx-auto mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Identity Verification</h3>
              <p className="text-[#A5A5A5] mb-4">Ensure only authorized individuals can access information</p>
              <ul className="text-sm text-[#CCCCCC] space-y-2">
                <li>• Multi-factor authentication</li>
                <li>• Identity verification</li>
                <li>• Audit trails</li>
                <li>• Access logging</li>
              </ul>
            </div>
            
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8 text-center">
              <Clock className="w-12 h-12 text-[#FFD43B] mx-auto mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Access Monitoring</h3>
              <p className="text-[#A5A5A5] mb-4">Track when and how information is accessed</p>
              <ul className="text-sm text-[#CCCCCC] space-y-2">
                <li>• Access history</li>
                <li>• Login notifications</li>
                <li>• Usage reports</li>
                <li>• Security alerts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
            Why Organized Care Team Access Matters
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-left">
              <h3 className="text-xl font-bold text-white mb-4">Better Coordination</h3>
              <ul className="space-y-3 text-[#A5A5A5]">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Everyone has access to current information
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Reduced miscommunication between caregivers
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Improved quality of care coordination
                </li>
              </ul>
            </div>
            
            <div className="text-left">
              <h3 className="text-xl font-bold text-white mb-4">Emergency Preparedness</h3>
              <ul className="space-y-3 text-[#A5A5A5]">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Quick access to critical information during emergencies
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Authorized family members can assist remotely
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Healthcare providers have immediate access to medical history
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Start Managing Care Team Access
          </h2>
          <p className="text-xl text-[#A5A5A5] mb-8 leading-relaxed">
            Give your elderly parents' care team secure, controlled access to the information they need.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pricing"
              data-testid="button-start-organizing"
              className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-4 rounded-full hover:bg-[#E6C140] transition-colors"
            >
              Start Managing Care Team Access
            </a>
            <a
              href="/schedule-demo"
              data-testid="button-schedule-demo"
              className="inline-flex items-center justify-center border border-[#FFD43B] text-[#FFD43B] font-semibold px-8 py-4 rounded-full hover:bg-[#FFD43B]/10 transition-colors"
            >
              Schedule a Demo
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}