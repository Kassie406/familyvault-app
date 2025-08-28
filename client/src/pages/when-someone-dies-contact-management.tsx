import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Users, CheckCircle, Calendar, Phone, Shield, ArrowRight, Clock, UserCheck, AlertCircle, Building, Mail, MessageSquare } from "lucide-react";

export default function WhenSomeoneDiesContactManagement() {
  const contactCategories = [
    {
      category: "Professional Advisors",
      description: "Attorneys, accountants, and financial advisors",
      importance: "Critical",
      information: ["Estate attorney contact information", "Accountant and tax preparer details", "Financial advisor and investment contacts", "Insurance agents and brokers"],
      tips: "Contact professional advisors within the first week to understand estate administration requirements"
    },
    {
      category: "Financial Institutions",
      description: "Banks, credit unions, and investment firms",
      importance: "Critical", 
      information: ["Bank relationship managers", "Investment firm contacts", "Credit card company representatives", "Loan servicing contacts"],
      tips: "Financial institutions often have dedicated estate services departments for faster processing"
    },
    {
      category: "Government Agencies",
      description: "Social Security, IRS, and other government contacts",
      importance: "High",
      information: ["Social Security Administration", "Internal Revenue Service", "State tax authorities", "Veterans Affairs (if applicable)"],
      tips: "Government agencies have specific procedures and deadlines for death notifications"
    },
    {
      category: "Healthcare and Medical", 
      description: "Doctors, hospitals, and medical service providers",
      importance: "High",
      information: ["Primary care physicians", "Specialists and medical providers", "Hospitals and medical facilities", "Medical billing departments"],
      tips: "Notify medical providers to close accounts and obtain final medical records if needed"
    },
    {
      category: "Utilities and Services",
      description: "Essential service providers and subscription services",
      importance: "Medium",
      information: ["Utility companies (electric, gas, water)", "Internet and phone providers", "Cable and streaming services", "Home security and monitoring"],
      tips: "Some services may need to continue for estate property maintenance while others can be canceled"
    },
    {
      category: "Personal and Family",
      description: "Family members, friends, and personal contacts",
      importance: "Medium",
      information: ["Immediate family members", "Extended family and relatives", "Close friends and colleagues", "Employer and coworkers"],
      tips: "Create a structured communication plan to notify personal contacts in order of closeness and importance"
    }
  ];

  const managementSteps = [
    {
      step: 1,
      title: "Immediate Priority Contacts",
      description: "Notify the most critical contacts within 24-48 hours",
      timeframe: "Within 48 hours"
    },
    {
      step: 2, 
      title: "Professional and Business Contacts",
      description: "Contact attorneys, accountants, financial advisors, and business associates",
      timeframe: "Within 1 week"
    },
    {
      step: 3,
      title: "Financial Institution Notifications",
      description: "Notify all banks, investment firms, and financial service providers", 
      timeframe: "Within 2 weeks"
    },
    {
      step: 4,
      title: "Government and Legal Notifications",
      description: "Contact government agencies and complete required notifications",
      timeframe: "Within 30 days"
    },
    {
      step: 5,
      title: "Service Provider and Personal Contacts",
      description: "Update service providers and notify extended personal network",
      timeframe: "Within 60 days"
    }
  ];

  const organizationTips = [
    {
      category: "Systematic Approach",
      icon: UserCheck,
      tip: "Create organized contact lists with priorities and deadlines",
      details: "Group contacts by urgency and relationship type to ensure important notifications happen first."
    },
    {
      category: "Communication Tracking", 
      icon: MessageSquare,
      tip: "Track all communications and follow up on important contacts",
      details: "Keep records of who was contacted, when, and what information was provided for estate administration."
    },
    {
      category: "Documentation",
      icon: Building,
      tip: "Maintain records of all contact interactions and responses",
      details: "Document confirmation of notifications, account closures, and any special instructions received."
    }
  ];

  const notificationTemplates = [
    {
      type: "Formal Business Notification",
      purpose: "Professional advisors, financial institutions, and business contacts",
      keyElements: ["Date of death", "Your relationship to deceased", "Your contact information", "Request for next steps"],
      sample: "I am writing to inform you of the death of [Name] on [Date]. I am the [relationship/executor] and will be handling their estate matters. Please advise on procedures for [specific request]."
    },
    {
      type: "Government Agency Notification",
      purpose: "Social Security, IRS, and other government agencies",
      keyElements: ["Full legal name of deceased", "Date of death", "Social Security number", "Request for benefits information"],
      sample: "Please be advised that [Full Name], SSN [number], passed away on [Date]. Please stop all benefits and advise on any reporting requirements."
    },
    {
      type: "Service Provider Notification",
      purpose: "Utilities, subscriptions, and ongoing services",
      keyElements: ["Account information", "Date services should end", "Final billing requests", "Property status if applicable"],
      sample: "Account holder [Name] passed away on [Date]. Please [cancel/transfer] service as of [Date] and send final bill to [address]."
    },
    {
      type: "Personal Notification",
      purpose: "Family, friends, and personal contacts",
      keyElements: ["Expression of the loss", "Basic information about services", "How they can help or support", "Contact for more information"],
      sample: "I am deeply saddened to inform you that [Name] passed away on [Date]. [Service information]. Your support during this time means so much to our family."
    }
  ];

  const priorityContacts = [
    {
      priority: "Immediate (0-24 hours)",
      contacts: ["Close family members", "Funeral home", "Family doctor", "Employer (if still working)", "Clergy or spiritual advisor"],
      purpose: "Essential notifications for immediate decisions and arrangements"
    },
    {
      priority: "Critical (1-3 days)",
      contacts: ["Estate attorney", "Life insurance companies", "Primary bank", "Investment advisor", "Mortgage company"],
      purpose: "Legal and financial matters that may affect estate and benefits"
    },
    {
      priority: "Important (1-2 weeks)",
      contacts: ["All banks and credit unions", "Credit card companies", "Accountant/tax preparer", "Social Security Administration", "Health insurance providers"],
      purpose: "Financial accounts and government benefits that require timely notification"
    },
    {
      priority: "Standard (2-4 weeks)",
      contacts: ["Utility companies", "Subscription services", "Professional associations", "Extended family and friends", "Former employers for retirement benefits"],
      purpose: "Service providers and personal contacts that need notification but aren't time-critical"
    }
  ];

  const specialSituations = [
    {
      situation: "Business Owner or Partner",
      considerations: ["Business partners and stakeholders", "Key employees and managers", "Business bank accounts", "Commercial insurance providers", "Business attorneys and accountants"],
      actions: ["Review partnership agreements", "Assess business continuity needs", "Notify business contacts promptly", "Secure business assets and operations"],
      urgency: "Critical - business operations may be at risk"
    },
    {
      situation: "Military Veteran",
      considerations: ["Veterans Affairs", "Military finance centers", "Veteran service organizations", "Military burial honors coordinator", "Dependent ID card office"],
      actions: ["Contact VA for burial benefits", "Notify military pension offices", "Arrange military honors if desired", "Update dependent benefits"],
      urgency: "High - veteran benefits have specific procedures and deadlines"
    },
    {
      situation: "Federal Employee",
      considerations: ["Office of Personnel Management", "Thrift Savings Plan", "Federal Employee Group Life Insurance", "Health benefits program", "Employing agency HR"],
      actions: ["Contact OPM for survivor benefits", "File life insurance claims", "Address health insurance continuation", "Handle final pay and benefits"],
      urgency: "High - federal benefits have strict notification requirements"
    },
    {
      situation: "Multiple Residences",
      considerations: ["Utility companies in all locations", "Local government offices", "Property management companies", "Security services", "Mail forwarding services"],
      actions: ["Secure all properties", "Handle utilities appropriately", "Update address information", "Arrange property maintenance"],
      urgency: "Medium - properties need ongoing attention and security"
    }
  ];

  const contactInformation = [
    {
      category: "Social Security Administration",
      phone: "1-800-772-1213",
      website: "www.ssa.gov",
      hours: "Monday - Friday, 8:00 AM to 7:00 PM",
      services: ["Death benefits", "Survivor benefits", "Medicare termination", "Overpayment recovery"],
      tips: "Have death certificate and Social Security number ready when calling"
    },
    {
      category: "Internal Revenue Service",
      phone: "1-800-829-1040",
      website: "www.irs.gov",
      hours: "Monday - Friday, 7:00 AM to 7:00 PM",
      services: ["Final tax returns", "Estate tax information", "Taxpayer identification numbers", "Tax account transcripts"],
      tips: "Estate may need separate taxpayer identification number"
    },
    {
      category: "Veterans Affairs",
      phone: "1-800-827-1000",
      website: "www.va.gov",
      hours: "Monday - Friday, 8:00 AM to 9:00 PM",
      services: ["Burial benefits", "Survivor pensions", "Dependency benefits", "Military records"],
      tips: "VA benefits may be available even if veteran wasn't receiving them at time of death"
    },
    {
      category: "Medicare",
      phone: "1-800-633-4227",
      website: "www.medicare.gov",
      hours: "24 hours a day, 7 days a week",
      services: ["Coverage termination", "Claim information", "Supplemental insurance coordination", "Beneficiary services"],
      tips: "Medicare coverage ends the month of death - notify promptly to avoid billing issues"
    }
  ];

  const communicationBestPractices = [
    {
      practice: "Written Documentation",
      description: "Keep written records of all important communications",
      benefits: ["Legal protection", "Estate accounting", "Prevents misunderstandings", "Helps with follow-up"],
      implementation: "Send emails, keep copies of letters, document phone calls with date, time, and summary"
    },
    {
      practice: "Confirmation Follow-up",
      description: "Confirm receipt of important notifications",
      benefits: ["Ensures message was received", "Creates paper trail", "Identifies any issues early", "Professional approach"],
      implementation: "Request confirmation receipts for emails, follow up on critical notifications within a week"
    },
    {
      practice: "Professional Tone",
      description: "Maintain professional, respectful communication in business contexts",
      benefits: ["Facilitates cooperation", "Reduces complications", "Shows competence", "Protects relationships"],
      implementation: "Use formal language, be clear and concise, express appreciation for assistance"
    },
    {
      practice: "Information Security",
      description: "Protect sensitive information while providing necessary details",
      benefits: ["Prevents identity theft", "Maintains privacy", "Complies with regulations", "Protects estate"],
      implementation: "Share only necessary information, use secure communication methods, verify recipient identity"
    }
  ];

  const commonChallenges = [
    {
      challenge: "Overwhelming Number of Contacts",
      impact: "Important notifications may be delayed or missed",
      solutions: ["Create prioritized contact lists", "Use templates for efficiency", "Ask family members to help", "Focus on most critical contacts first"],
      prevention: "Maintain organized contact lists and communication preferences during lifetime"
    },
    {
      challenge: "Lack of Account Information",
      impact: "Unable to notify all relevant parties or close accounts",
      solutions: ["Review mail and email for service providers", "Check bank statements for automatic payments", "Contact previous employers for retirement accounts", "Use asset search services"],
      prevention: "Keep comprehensive records of all accounts and service providers"
    },
    {
      challenge: "Unresponsive Organizations",
      impact: "Delays in processing and potential ongoing charges or complications",
      solutions: ["Follow up persistently", "Escalate to supervisors", "Use registered mail", "Seek legal assistance if necessary"],
      prevention: "Document all communications and maintain professional relationships"
    },
    {
      challenge: "Complex Family Dynamics",
      impact: "Disagreements over who should be notified and what information to share",
      solutions: ["Follow legal authority (will/court orders)", "Communicate transparently", "Consider mediation", "Focus on legal requirements"],
      prevention: "Discuss communication preferences and family dynamics before they become issues"
    }
  ];

  const digitalContacts = [
    {
      category: "Email and Social Media",
      services: ["Email providers (Gmail, Yahoo, etc.)", "Social media platforms", "Professional networking sites", "Dating or social apps"],
      procedures: ["Request account memorialization or closure", "Provide required documentation", "Follow platform-specific procedures", "Consider digital legacy wishes"],
      considerations: "Each platform has different policies for deceased user accounts"
    },
    {
      category: "Digital Subscriptions",
      services: ["Streaming services", "Software subscriptions", "Cloud storage", "Online publications"],
      procedures: ["Cancel subscriptions to prevent ongoing charges", "Download important data if possible", "Transfer accounts if transferable", "Request refunds where appropriate"],
      considerations: "Some subscriptions may have been bundled or paid annually"
    },
    {
      category: "Online Financial Services",
      services: ["Online banks", "Investment platforms", "Payment services", "Cryptocurrency exchanges"],
      procedures: ["Follow financial institution estate procedures", "Provide death certificate and legal documentation", "Transfer or close accounts per instructions", "Secure access credentials"],
      considerations: "Online financial services may require additional identity verification"
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
              <Users className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Contact Management
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize and manage all important contacts including family, advisors, and service providers. 
              Ensure proper notifications are made during estate administration.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Contact Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contactCategories.map((category, index) => (
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
                  <h4 className="text-sm font-medium text-white mb-2">Key Contacts:</h4>
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

      {/* Management Process */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Contact Management Process
          </h2>
          <div className="space-y-8">
            {managementSteps.map((step, index) => (
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

      {/* Organization Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Contact Management Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {organizationTips.map((tip, index) => {
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

      {/* Priority Contact Framework */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Priority Contact Framework
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {priorityContacts.map((priority, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{priority.priority}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    priority.priority.includes('Immediate') || priority.priority.includes('Critical')
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : priority.priority.includes('Important')
                      ? 'bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {priority.priority.split(' ')[0]}
                  </span>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Key Contacts:</h4>
                  <ul className="space-y-1 mb-4">
                    {priority.contacts.map((contact, contactIndex) => (
                      <li key={contactIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <Phone className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {contact}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm">{priority.purpose}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Communication Templates */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Communication Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {notificationTemplates.map((template, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{template.type}</h3>
                <p className="text-[#A5A5A5] mb-4">For: {template.purpose}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Key Elements:</h4>
                  <ul className="space-y-1 mb-4">
                    {template.keyElements.map((element, elementIndex) => (
                      <li key={elementIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {element}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-blue-400 text-sm font-medium mb-2">Sample Template:</p>
                  <p className="text-blue-400 text-sm italic">"{template.sample}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Situations */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Special Situation Contact Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specialSituations.map((situation, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{situation.situation}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    situation.urgency.includes('Critical') 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : situation.urgency.includes('High')
                      ? 'bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {situation.urgency.split(' - ')[0]}
                  </span>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Key Considerations:</h4>
                  <ul className="space-y-1 mb-4">
                    {situation.considerations.map((consideration, considerationIndex) => (
                      <li key={considerationIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <AlertCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {consideration}
                      </li>
                    ))}
                  </ul>
                  <h4 className="text-sm font-medium text-white mb-2">Required Actions:</h4>
                  <ul className="space-y-1 mb-4">
                    {situation.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm">{situation.urgency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Contact Information */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Key Government Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contactInformation.map((contact, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{contact.category}</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-[#A5A5A5]">
                    <Phone className="w-4 h-4 text-[#FFD43B] mr-2" />
                    <span className="font-mono">{contact.phone}</span>
                  </div>
                  <div className="flex items-center text-[#A5A5A5]">
                    <Building className="w-4 h-4 text-[#FFD43B] mr-2" />
                    <span>{contact.website}</span>
                  </div>
                  <div className="flex items-center text-[#A5A5A5]">
                    <Clock className="w-4 h-4 text-[#FFD43B] mr-2" />
                    <span>{contact.hours}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Services:</h4>
                  <ul className="space-y-1 mb-4">
                    {contact.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <span className="text-[#FFD43B] mr-2">•</span>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm">{contact.tips}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Communication Best Practices */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Communication Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {communicationBestPractices.map((practice, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{practice.practice}</h3>
                <p className="text-[#A5A5A5] mb-4">{practice.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Benefits:</h4>
                  <ul className="space-y-1 mb-4">
                    {practice.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-blue-400 text-sm font-medium">Implementation: {practice.implementation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Challenges */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Common Contact Management Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {commonChallenges.map((challenge, index) => (
              <div key={index} className="bg-[#121212] border border-red-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-red-400 mb-3">{challenge.challenge}</h3>
                <p className="text-[#A5A5A5] mb-4">{challenge.impact}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Solutions:</h4>
                  <ul className="space-y-1 mb-4">
                    {challenge.solutions.map((solution, solutionIndex) => (
                      <li key={solutionIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                        {solution}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-blue-400 text-sm font-medium">Prevention: {challenge.prevention}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Contact Management */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Digital Contact and Account Management
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {digitalContacts.map((contact, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{contact.category}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Common Services:</h4>
                  <ul className="space-y-1 mb-4">
                    {contact.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <span className="text-[#FFD43B] mr-2">•</span>
                        {service}
                      </li>
                    ))}
                  </ul>
                  <h4 className="text-sm font-medium text-white mb-2">Procedures:</h4>
                  <ul className="space-y-1 mb-4">
                    {contact.procedures.map((procedure, procedureIndex) => (
                      <li key={procedureIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {procedure}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm">{contact.considerations}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-blue-500/5 border border-blue-500/20 rounded-xl p-6 text-center">
            <Mail className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <p className="text-blue-400 font-medium mb-2">Digital Legacy Planning</p>
            <p className="text-[#A5A5A5]">
              Consider creating a digital estate plan that includes instructions for handling online accounts, 
              social media profiles, and digital assets. This makes the contact management process much easier for loved ones.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your contact management?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all important family, advisor, and service provider contacts organized and accessible with FamilyVault.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-contact-management"
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