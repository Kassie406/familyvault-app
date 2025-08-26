import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Users, Shield, Clock, Key, Smartphone, Eye, Lock, CheckCircle } from "lucide-react";

export default function CaregiverAccess() {
  const accessCategories = [
    {
      icon: Users,
      title: "Trusted Caregivers",
      description: "Safely share information with babysitters, family members, and trusted friends",
      examples: ["Grandparents with medical info", "Babysitter with emergency contacts", "School pickup authorization", "Nanny with daily schedule", "Family friend emergency access"]
    },
    {
      icon: Key,
      title: "Permission Levels",
      description: "Control exactly what information each caregiver can access",
      examples: ["Basic contact info only", "Medical emergency details", "School pickup authorization", "Full access for grandparents", "Limited babysitter access"]
    },
    {
      icon: Clock,
      title: "Time-Limited Access",
      description: "Set temporary access for specific caregiving situations",
      examples: ["Weekend babysitter access", "Vacation caregiver permissions", "One-time emergency contact", "School event volunteer", "Temporary guardian access"]
    },
    {
      icon: Eye,
      title: "Access Monitoring",
      description: "See when and what information was accessed by caregivers",
      examples: ["Login notifications", "Information access logs", "Emergency contact usage", "Document view history", "Share activity tracking"]
    }
  ];

  const caregiverTypes = [
    {
      type: "Grandparents",
      accessLevel: "Full Access",
      permissions: ["All medical information", "Emergency contacts", "School details", "Activity schedules", "Direct communication"],
      duration: "Permanent",
      status: "Active"
    },
    {
      type: "Regular Babysitter", 
      accessLevel: "Standard Access",
      permissions: ["Emergency contacts only", "Basic medical info", "Bedtime routine", "Approved snacks", "Pickup authorization"],
      duration: "Ongoing",
      status: "Active"
    },
    {
      type: "Occasional Sitter",
      accessLevel: "Limited Access", 
      permissions: ["Emergency contacts", "Basic allergies", "Bedtime only", "No medical details", "Parent contact required"],
      duration: "Per event",
      status: "As needed"
    },
    {
      type: "School Personnel",
      accessLevel: "Educational Access",
      permissions: ["Emergency contacts", "Medical conditions", "Authorized pickup list", "Special needs info", "Parent preferences"],
      duration: "School year",
      status: "Active"
    }
  ];

  const sharingScenarios = [
    {
      scenario: "Date Night Babysitter",
      duration: "4 hours",
      shared: ["Emergency contacts", "Bedtime routine", "Approved snacks", "House rules"],
      restricted: ["Medical history", "School information", "Financial details"]
    },
    {
      scenario: "Weekend with Grandparents",
      duration: "2 days", 
      shared: ["All medical information", "Emergency protocols", "Activity schedules", "Medication reminders"],
      restricted: ["Financial information", "Private family matters"]
    },
    {
      scenario: "School Field Trip",
      duration: "1 day",
      shared: ["Medical conditions", "Emergency contacts", "Medication instructions", "Allergy information"],
      restricted: ["Home address", "Personal schedules", "Family contacts"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F3F4F6]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#0B0B0B] to-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#D4AF37] font-medium bg-[rgba(212,175,55,0.08)] px-4 py-2 rounded-full border border-[rgba(212,175,55,0.25)] mb-6">
              <Users className="w-5 h-5" />
              Caregiver Access
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Secure Information Sharing
            </h1>
            <p className="text-xl text-[#CCCCCC] max-w-3xl mx-auto">
              Safely share your child's information with babysitters, family members, and caregivers with complete control over access levels.
            </p>
          </div>
        </div>
      </section>

      {/* Access Categories */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Complete Access Control System
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {accessCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="gold-card rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[rgba(212,175,55,0.1)] rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                  </div>
                  
                  <p className="text-[#CCCCCC] mb-6">{category.description}</p>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wide">Examples:</h4>
                    <ul className="space-y-2">
                      {category.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="text-[#CCCCCC] flex items-start">
                          <span className="text-[#D4AF37] mr-2">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Caregiver Access Levels */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Different Access Levels for Different Caregivers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caregiverTypes.map((caregiver, index) => (
              <div key={index} className="gold-card rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{caregiver.type}</h3>
                    <p className="text-[#D4AF37] font-semibold">{caregiver.accessLevel}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#CCCCCC]">Duration: {caregiver.duration}</div>
                    <div className="text-sm text-green-400">{caregiver.status}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wide">Permissions:</h4>
                  <ul className="space-y-1">
                    {caregiver.permissions.map((permission, permissionIndex) => (
                      <li key={permissionIndex} className="text-[#CCCCCC] flex items-start text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sharing Scenarios */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Real-World Sharing Scenarios
          </h2>
          
          <div className="space-y-8">
            {sharingScenarios.map((scenario, index) => (
              <div key={index} className="gold-card rounded-2xl p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{scenario.scenario}</h3>
                    <div className="flex items-center gap-2 text-[#D4AF37]">
                      <Clock className="w-4 h-4" />
                      <span>Duration: {scenario.duration}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-[#D4AF37] mb-4">Information Shared</h4>
                    <ul className="space-y-2">
                      {scenario.shared.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-[#CCCCCC] flex items-start text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-[#D4AF37] mb-4">Information Restricted</h4>
                    <ul className="space-y-2">
                      {scenario.restricted.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-[#CCCCCC] flex items-start text-sm">
                          <Lock className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                          {item}
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

      {/* Features Section */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Safe, Secure, and Simple
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Bank-Level Security</h3>
              <p className="text-[#CCCCCC]">Your family's information is protected with the highest security standards.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Key className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Complete Control</h3>
              <p className="text-[#CCCCCC]">You decide who sees what information and for how long they can access it.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Easy Access</h3>
              <p className="text-[#CCCCCC]">Caregivers can access information instantly from any device when they need it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Share Information Safely?
          </h2>
          <p className="text-xl text-[#CCCCCC] mb-8">
            Give caregivers the information they need while keeping your family's privacy protected.
          </p>
          <a
            href="/signup"
            data-testid="button-get-started"
            className="bg-[#D4AF37] text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#C7A233] transition-colors inline-block"
          >
            Get Started Free
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}