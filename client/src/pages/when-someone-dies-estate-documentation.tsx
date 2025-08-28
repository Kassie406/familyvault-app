import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { FileText, CheckCircle, Calendar, Scale, Shield, ArrowRight, Clock, Users, AlertCircle, Award, Building, Search } from "lucide-react";

export default function WhenSomeoneDiesEstateDocumentation() {
  const documentCategories = [
    {
      category: "Will and Testament",
      description: "Primary document outlining the deceased's final wishes",
      importance: "Critical",
      information: ["Original will document", "Codicils or amendments", "Witness information", "Self-proving affidavit"],
      tips: "The will must be filed with the probate court within 30 days of death in most states"
    },
    {
      category: "Trust Documents",
      description: "Trust agreements and related documentation",
      importance: "Critical", 
      information: ["Trust agreements", "Trust amendments", "Trustee appointment documents", "Beneficiary designations"],
      tips: "Trust assets may avoid probate but still require proper administration and documentation"
    },
    {
      category: "Death Certificate",
      description: "Official documentation of death required for most transactions",
      importance: "Critical",
      information: ["Multiple certified copies", "Medical examiner reports", "Autopsy reports (if applicable)", "Burial or cremation permits"],
      tips: "Order at least 10-15 certified copies - you'll need them for banks, insurance, and legal proceedings"
    },
    {
      category: "Property Ownership Documents", 
      description: "Real estate and personal property documentation",
      importance: "High",
      information: ["Property deeds", "Vehicle titles", "Personal property lists", "Appraisal documents"],
      tips: "Property ownership documents determine what goes through probate and what transfers automatically"
    },
    {
      category: "Legal Identification",
      description: "Official identification documents of the deceased",
      importance: "High",
      information: ["Driver's license", "Passport", "Social Security card", "Birth certificate"],
      tips: "These documents are needed to establish identity and may be required to cancel accounts and services"
    },
    {
      category: "Marriage and Family Documents",
      description: "Documentation of family relationships and marital status",
      importance: "Medium",
      information: ["Marriage certificates", "Divorce decrees", "Adoption papers", "Birth certificates of children"],
      tips: "Family documentation establishes who has legal standing in estate matters"
    }
  ];

  const gatheringSteps = [
    {
      step: 1,
      title: "Locate Primary Documents",
      description: "Find the will, trust documents, and death certificate",
      timeframe: "Within 7 days of death"
    },
    {
      step: 2, 
      title: "Inventory Estate Assets",
      description: "Create comprehensive list of all assets and their documentation",
      timeframe: "Within 30 days"
    },
    {
      step: 3,
      title: "Organize Legal Documentation",
      description: "Gather all legal papers and organize for probate or trust administration", 
      timeframe: "Within 60 days"
    },
    {
      step: 4,
      title: "File Required Documents",
      description: "Submit necessary documents to courts, government agencies, and institutions",
      timeframe: "Within statutory deadlines"
    },
    {
      step: 5,
      title: "Maintain Documentation System",
      description: "Keep organized records throughout the estate administration process",
      timeframe: "Throughout administration"
    }
  ];

  const organizationTips = [
    {
      category: "Document Security",
      icon: Shield,
      tip: "Keep original documents secure while providing copies when needed",
      details: "Store originals in safe deposit box or fireproof safe, and make multiple copies for working files."
    },
    {
      category: "Systematic Organization", 
      icon: FileText,
      tip: "Create filing system organized by asset type and deadline importance",
      details: "Group documents by real estate, financial accounts, personal property, and legal requirements."
    },
    {
      category: "Professional Access",
      icon: Users,
      tip: "Ensure attorneys and accountants have access to necessary documents",
      details: "Create shared systems for professional advisors while maintaining security and organization."
    }
  ];

  const documentLocations = [
    {
      location: "Safe Deposit Box",
      likelyContents: ["Original will", "Trust documents", "Property deeds", "Stock certificates", "Important contracts"],
      accessRequirements: "Court order or co-owner authorization may be required",
      urgency: "High - access may be restricted after death"
    },
    {
      location: "Home Safe or Filing System",
      likelyContents: ["Copies of important documents", "Insurance policies", "Financial statements", "Personal records"],
      accessRequirements: "Physical access to home and knowledge of location",
      urgency: "Medium - generally accessible to family members"
    },
    {
      location: "Attorney's Office",
      likelyContents: ["Will", "Trust documents", "Legal correspondence", "Estate planning documents"],
      accessRequirements: "Contact with attorney's office and proper identification",
      urgency: "High - attorney may have most current documents"
    },
    {
      location: "Financial Institutions",
      likelyContents: ["Account documentation", "Beneficiary forms", "Loan documents", "Investment records"],
      accessRequirements: "Executor authority or beneficiary designation",
      urgency: "Medium - needed for account management"
    }
  ];

  const probateDocuments = [
    {
      document: "Petition for Probate",
      purpose: "Initiates probate proceedings",
      required: ["Death certificate", "Original will", "List of heirs", "Asset inventory"],
      deadline: "Varies by state (typically 30-120 days)",
      filed: "Probate court in county of residence"
    },
    {
      document: "Letters Testamentary/Administration",
      purpose: "Court authorization for executor to act",
      required: ["Approved petition", "Executor oath", "Bond (if required)", "Notice to beneficiaries"],
      deadline: "After probate petition approval",
      filed: "Issued by probate court"
    },
    {
      document: "Inventory and Appraisal",
      purpose: "Official listing of estate assets and values",
      required: ["Asset documentation", "Professional appraisals", "Financial statements", "Property valuations"],
      deadline: "90-180 days after appointment",
      filed: "Probate court"
    },
    {
      document: "Final Accounting",
      purpose: "Summary of estate administration",
      required: ["All receipts and disbursements", "Asset distributions", "Tax returns", "Beneficiary receipts"],
      deadline: "Before estate closure",
      filed: "Probate court with petition to close"
    }
  ];

  const assetDocumentation = [
    {
      assetType: "Real Estate",
      documents: ["Property deeds", "Mortgage documents", "Property tax records", "Homeowner's insurance"],
      valuation: "Professional appraisal required",
      considerations: "May need immediate maintenance and security"
    },
    {
      assetType: "Financial Accounts",
      documents: ["Bank statements", "Investment account statements", "Retirement account documents", "Beneficiary designations"],
      valuation: "Date of death values from institutions",
      considerations: "Some accounts transfer automatically to beneficiaries"
    },
    {
      assetType: "Personal Property",
      documents: ["Inventory lists", "Receipts for valuable items", "Insurance policies", "Appraisal documents"],
      valuation: "Professional appraisal for valuable items",
      considerations: "Secure valuable items and consider storage needs"
    },
    {
      assetType: "Business Interests",
      documents: ["Partnership agreements", "Corporate documents", "Buy-sell agreements", "Business valuations"],
      valuation: "Business valuation professional",
      considerations: "May require immediate management decisions"
    }
  ];

  const commonChallenges = [
    {
      challenge: "Missing or Outdated Will",
      impact: "Estate may go through intestate succession",
      solutions: ["Conduct thorough search for will", "Check with attorneys and family", "Review safe deposit boxes", "File intestacy petition if no will found"],
      prevention: "Regular will updates and secure storage with multiple parties knowing location"
    },
    {
      challenge: "Disputed Documents",
      impact: "Delayed estate administration and potential litigation",
      solutions: ["Gather witness testimony", "Obtain handwriting analysis", "Review execution circumstances", "Consider mediation"],
      prevention: "Proper will execution with witnesses and notarization"
    },
    {
      challenge: "Incomplete Asset Documentation",
      impact: "Difficulty proving ownership and values",
      solutions: ["Contact financial institutions", "Search public records", "Interview family members", "Hire asset search professionals"],
      prevention: "Maintain comprehensive asset records and update regularly"
    },
    {
      challenge: "Document Access Issues",
      impact: "Delays in estate administration",
      solutions: ["Obtain court orders for access", "Work with co-owners", "Contact institutions directly", "Use legal process for access"],
      prevention: "Plan for document access with trusted family members"
    }
  ];

  const digitalAssets = [
    {
      category: "Digital Account Information",
      examples: ["Email accounts", "Social media profiles", "Cloud storage", "Subscription services"],
      documentation: ["Account lists", "Login credentials", "Digital estate plans", "Service provider contacts"],
      considerations: "Digital assets often have specific terms of service for posthumous access"
    },
    {
      category: "Cryptocurrency and Digital Investments",
      examples: ["Bitcoin and altcoin wallets", "Digital investment accounts", "NFT collections", "Online trading accounts"],
      documentation: ["Wallet addresses", "Private keys", "Exchange account information", "Digital asset inventories"],
      considerations: "Cryptocurrency can be permanently lost without proper key management"
    },
    {
      category: "Digital Business Assets",
      examples: ["Domain names", "Websites", "Digital intellectual property", "Online business accounts"],
      documentation: ["Domain registrations", "Website hosting information", "Digital contracts", "Revenue records"],
      considerations: "Digital business assets may have ongoing management requirements"
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
              <FileText className="w-12 h-12 text-[#FFD43B] mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Estate Documentation
              </h1>
            </div>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto leading-relaxed">
              Organize and manage all essential estate documents including wills, trust papers, death certificates, 
              and legal documentation needed for proper estate administration.
            </p>
          </div>
        </div>
      </section>

      {/* Document Categories */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Estate Documentation Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {documentCategories.map((category, index) => (
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
                  <h4 className="text-sm font-medium text-white mb-2">Key Documents:</h4>
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

      {/* Document Gathering Process */}
      <section className="py-16 bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Document Gathering Process
          </h2>
          <div className="space-y-8">
            {gatheringSteps.map((step, index) => (
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
            Document Organization Best Practices
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

      {/* Document Locations */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Where to Find Important Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {documentLocations.map((location, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{location.location}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    location.urgency.includes('High') 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/20'
                  }`}>
                    {location.urgency.split(' - ')[0]}
                  </span>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Likely Contents:</h4>
                  <ul className="space-y-1 mb-4">
                    {location.likelyContents.map((content, contentIndex) => (
                      <li key={contentIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <Search className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {content}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm font-medium">Access: {location.accessRequirements}</p>
                  </div>
                  <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                    <p className="text-[#FFD43B] text-sm">{location.urgency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Probate Documents */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Required Probate Documentation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {probateDocuments.map((doc, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{doc.document}</h3>
                <p className="text-[#A5A5A5] mb-4">{doc.purpose}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Required Documentation:</h4>
                  <ul className="space-y-1 mb-4">
                    {doc.required.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <CheckCircle className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm font-medium">Deadline: {doc.deadline}</p>
                  </div>
                  <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                    <p className="text-[#FFD43B] text-sm font-medium">Filed With: {doc.filed}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Asset Documentation */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Asset Documentation Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {assetDocumentation.map((asset, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{asset.assetType}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Required Documents:</h4>
                  <ul className="space-y-1 mb-4">
                    {asset.documents.map((doc, docIndex) => (
                      <li key={docIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <FileText className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-sm font-medium">Valuation: {asset.valuation}</p>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-sm">{asset.considerations}</p>
                  </div>
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
            Common Documentation Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {commonChallenges.map((challenge, index) => (
              <div key={index} className="bg-[#121212] border border-red-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-red-400 mb-3">{challenge.challenge}</h3>
                <p className="text-[#A5A5A5] mb-4">{challenge.impact}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Possible Solutions:</h4>
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

      {/* Digital Assets */}
      <section className="py-16 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Digital Asset Documentation
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {digitalAssets.map((asset, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{asset.category}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Examples:</h4>
                  <ul className="space-y-1 mb-4">
                    {asset.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <span className="text-[#FFD43B] mr-2">•</span>
                        {example}
                      </li>
                    ))}
                  </ul>
                  <h4 className="text-sm font-medium text-white mb-2">Documentation Needed:</h4>
                  <ul className="space-y-1 mb-4">
                    {asset.documentation.map((doc, docIndex) => (
                      <li key={docIndex} className="flex items-center text-[#A5A5A5] text-sm">
                        <FileText className="w-3 h-3 text-[#FFD43B] mr-2 flex-shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFD43B]/5 border border-[#FFD43B]/20 rounded-lg p-3">
                  <p className="text-[#FFD43B] text-sm">{asset.considerations}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-red-500/5 border border-red-500/20 rounded-xl p-6 text-center">
            <Award className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-medium mb-2">Critical Reminder</p>
            <p className="text-[#A5A5A5]">
              Digital assets can be permanently lost without proper documentation. Maintain current inventories 
              of all digital accounts, credentials, and assets as part of your estate planning.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize estate documentation?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Keep all essential wills, trust documents, and legal papers organized and accessible with FamilyVault.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-estate-docs"
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