import { Shield, Lock, User, Smartphone, Key, Server, Eye, Database, Users, FileCheck, Award, HelpCircle, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/navbar";

export default function Security() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openPromise, setOpenPromise] = useState<number | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const togglePromise = (index: number) => {
    setOpenPromise(openPromise === index ? null : index);
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const faqItems = [
    {
      question: "Will FamilyVault ever sell my personal data?",
      answer: "Absolutely not. FamilyVault will never sell, trade, or monetize your personal information. Our business model is built on subscription fees from families who value secure document management, not on data sales."
    },
    {
      question: "What happens to my family's documents if I cancel my subscription?",
      answer: "If you decide to cancel, you can download all your documents and data before your subscription ends. Simply go to Settings → Export Data. If you choose to permanently delete your account, all information is completely and irreversibly removed from our systems."
    },
    {
      question: "Can I access my documents if I'm offline?",
      answer: "While FamilyVault is primarily cloud-based for maximum security and accessibility, you can download copies of your documents for offline access. We recommend keeping downloaded files in a secure location on your devices."
    },
    {
      question: "How does FamilyVault handle family emergency situations?",
      answer: "We verify emergency contacts through a thorough identity verification process when you add them. This ensures that in critical situations, authorized family members can quickly access necessary documents without delays."
    },
    {
      question: "Can FamilyVault employees view my personal documents?",
      answer: "No. We use advanced tokenization and encryption techniques that make your sensitive information completely invisible to our team. Even during system maintenance, your personal data remains encrypted and inaccessible to our employees."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#121212] to-[#0E0E0E] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Security</h1>
          <p className="text-xl text-[#A5A5A5] leading-relaxed mb-8">
            Enterprise-grade security measures and cutting-edge infrastructure to safeguard your family's most important information.
          </p>
          
          {/* Trust Metadata */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[#A5A5A5] mb-8">
            <span>Last updated: March 2025</span>
            <span className="w-1 h-1 bg-[#A5A5A5] rounded-full"></span>
            <span>SOC 2 Type II</span>
            <span className="w-1 h-1 bg-[#A5A5A5] rounded-full"></span>
            <span>ISO 27001 Ready</span>
            <span className="w-1 h-1 bg-[#A5A5A5] rounded-full"></span>
            <a href="#" className="text-[#FFD43B] hover:text-[#E6C140] transition-colors">System Status ↗</a>
          </div>
          
          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              data-testid="button-trust-overview"
              className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-6 py-3 rounded-full hover:bg-[#E6C140] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:ring-offset-2 focus:ring-offset-[#0E0E0E] min-h-[44px]"
            >
              Read our Trust Overview (PDF)
            </a>
            <a
              href="mailto:security@familyvault.com"
              data-testid="button-contact-security"
              className="inline-flex items-center justify-center border border-[#FFD43B] text-[#FFD43B] font-semibold px-6 py-3 rounded-full hover:bg-[#FFD43B]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:ring-offset-2 focus:ring-offset-[#0E0E0E] min-h-[44px]"
            >
              Contact Security
            </a>
          </div>
        </div>
      </section>

      {/* Security Commitment */}
      <section className="py-20 bg-[#0E0E0E] border-t border-[#2A2A2A]" id="security-promise">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Our security promise to your family
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Defense-grade Protection */}
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Lock className="w-6 h-6 text-[#FFD43B] mr-3" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold text-white">Defense-grade protection</h3>
              </div>
              <p className="text-[#A5A5A5] mb-4 leading-relaxed">
                We encrypt data in transit and at rest with AES-256 and TLS. All access is protected by mandatory multi-factor authentication.
              </p>
              <button
                onClick={() => togglePromise(0)}
                className="flex items-center text-[#FFD43B] hover:text-[#E6C140] transition-colors text-sm font-medium"
                data-testid="button-expand-protection"
              >
                Learn more
                <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${openPromise === 0 ? 'rotate-90' : ''}`} />
              </button>
              {openPromise === 0 && (
                <ul className="mt-4 space-y-2 text-sm text-[#A5A5A5]">
                  <li>• Military-grade AES-256 encryption for all data</li>
                  <li>• TLS 1.3 for secure data transmission</li>
                  <li>• Zero-knowledge architecture protects your privacy</li>
                  <li>• Regular third-party security audits and penetration testing</li>
                </ul>
              )}
            </div>
            
            {/* You control your data */}
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
              <div className="flex items-center mb-4">
                <User className="w-6 h-6 text-[#FFD43B] mr-3" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold text-white">You control your data</h3>
              </div>
              <p className="text-[#A5A5A5] mb-4 leading-relaxed">
                You choose who sees what, for how long. Export anytime. We never sell or train AI on your data.
              </p>
              <button
                onClick={() => togglePromise(1)}
                className="flex items-center text-[#FFD43B] hover:text-[#E6C140] transition-colors text-sm font-medium"
                data-testid="button-expand-control"
              >
                Learn more
                <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${openPromise === 1 ? 'rotate-90' : ''}`} />
              </button>
              {openPromise === 1 && (
                <ul className="mt-4 space-y-2 text-sm text-[#A5A5A5]">
                  <li>• Granular permission controls for family members</li>
                  <li>• One-click data export in multiple formats</li>
                  <li>• Your data is never sold, shared, or monetized</li>
                  <li>• Clear data retention and deletion policies</li>
                </ul>
              )}
            </div>
            
            {/* Transparent Operations */}
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-[#FFD43B] mr-3" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold text-white">Transparent operations</h3>
              </div>
              <p className="text-[#A5A5A5] mb-4 leading-relaxed">
                Open security practices, regular audits, and clear policies you can trust and verify.
              </p>
              <button
                onClick={() => togglePromise(2)}
                className="flex items-center text-[#FFD43B] hover:text-[#E6C140] transition-colors text-sm font-medium"
                data-testid="button-expand-transparency"
              >
                Learn more
                <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${openPromise === 2 ? 'rotate-90' : ''}`} />
              </button>
              {openPromise === 2 && (
                <ul className="mt-4 space-y-2 text-sm text-[#A5A5A5]">
                  <li>• Public security documentation and policies</li>
                  <li>• Annual SOC 2 Type II compliance reports</li>
                  <li>• Incident response plan with clear communication</li>
                  <li>• Bug bounty program with security researchers</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Technical Security Details */}
      <section className="py-20 bg-[#121212] border-t border-[#2A2A2A]" id="technical-security">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Technical Security Details
          </h2>
          
          <div className="space-y-4">
            {/* Account Security */}
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl">
              <button
                onClick={() => toggleAccordion('account-security')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#1A1A1A] rounded-xl transition-colors"
                data-testid="accordion-account-security"
                id="account-security"
              >
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 text-[#FFD43B] mr-3" />
                  <h3 className="text-lg font-semibold text-white">Account Security</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-[#A5A5A5] transition-transform ${openAccordion === 'account-security' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'account-security' && (
                <div className="px-6 pb-6">
                  <ul className="space-y-3 text-[#A5A5A5]">
                    <li>• <strong className="text-white">MFA mandatory:</strong> Multi-factor authentication required for all accounts</li>
                    <li>• <strong className="text-white">Strong passwords:</strong> Minimum 8 characters with mixed case, numbers, symbols</li>
                    <li>• <strong className="text-white">Device trust:</strong> New device verification via SMS or authenticator app</li>
                    <li>• <strong className="text-white">Session management:</strong> Automatic logout and secure session tokens</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Data Protection */}
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl">
              <button
                onClick={() => toggleAccordion('data-protection')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#1A1A1A] rounded-xl transition-colors"
                data-testid="accordion-data-protection"
                id="data-protection"
              >
                <div className="flex items-center">
                  <Database className="w-5 h-5 text-[#FFD43B] mr-3" />
                  <h3 className="text-lg font-semibold text-white">Data Protection</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-[#A5A5A5] transition-transform ${openAccordion === 'data-protection' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'data-protection' && (
                <div className="px-6 pb-6">
                  <ul className="space-y-3 text-[#A5A5A5]">
                    <li>• <strong className="text-white">AES-256 at rest:</strong> Military-grade encryption for stored data</li>
                    <li>• <strong className="text-white">TLS 1.3+ in transit:</strong> Latest encryption for data transmission</li>
                    <li>• <strong className="text-white">Tokenization:</strong> Sensitive data replaced with secure tokens</li>
                    <li>• <strong className="text-white">Key management:</strong> Hardware security modules for encryption keys</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Platform Security */}
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl">
              <button
                onClick={() => toggleAccordion('platform-security')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#1A1A1A] rounded-xl transition-colors"
                data-testid="accordion-platform-security"
                id="platform-security"
              >
                <div className="flex items-center">
                  <Eye className="w-5 h-5 text-[#FFD43B] mr-3" />
                  <h3 className="text-lg font-semibold text-white">Platform Security</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-[#A5A5A5] transition-transform ${openAccordion === 'platform-security' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'platform-security' && (
                <div className="px-6 pb-6">
                  <ul className="space-y-3 text-[#A5A5A5]">
                    <li>• <strong className="text-white">Biometrics:</strong> Facial recognition and fingerprint authentication</li>
                    <li>• <strong className="text-white">Hardware keys:</strong> YubiKey and FIDO2 security key support</li>
                    <li>• <strong className="text-white">Screen privacy:</strong> Automatic masking of sensitive information</li>
                    <li>• <strong className="text-white">Zero-knowledge:</strong> We cannot access your decrypted data</li>
                  </ul>
                </div>
              )}
            </div>

            {/* AI & Privacy */}
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl">
              <button
                onClick={() => toggleAccordion('ai-privacy')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#1A1A1A] rounded-xl transition-colors"
                data-testid="accordion-ai-privacy"
                id="ai-privacy"
              >
                <div className="flex items-center">
                  <Server className="w-5 h-5 text-[#FFD43B] mr-3" />
                  <h3 className="text-lg font-semibold text-white">AI & Privacy</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-[#A5A5A5] transition-transform ${openAccordion === 'ai-privacy' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'ai-privacy' && (
                <div className="px-6 pb-6">
                  <div className="bg-[#0E0E0E] border border-[#FFD43B] rounded-lg p-4 mb-4">
                    <p className="text-[#FFD43B] font-medium">We do not train AI on your data.</p>
                  </div>
                  <ul className="space-y-3 text-[#A5A5A5]">
                    <li>• <strong className="text-white">Zero-memory design:</strong> AI processes data without storing or learning</li>
                    <li>• <strong className="text-white">Private cloud:</strong> Third-party AI runs on our secure infrastructure</li>
                    <li>• <strong className="text-white">Strict contracts:</strong> Data processing agreements with all AI vendors</li>
                    <li>• <strong className="text-white">No model training:</strong> Your documents never improve external AI systems</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Operations */}
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl">
              <button
                onClick={() => toggleAccordion('operations')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#1A1A1A] rounded-xl transition-colors"
                data-testid="accordion-operations"
                id="operations"
              >
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-[#FFD43B] mr-3" />
                  <h3 className="text-lg font-semibold text-white">Operations</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-[#A5A5A5] transition-transform ${openAccordion === 'operations' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'operations' && (
                <div className="px-6 pb-6">
                  <ul className="space-y-3 text-[#A5A5A5]">
                    <li>• <strong className="text-white">Background checks:</strong> All employees undergo security clearance</li>
                    <li>• <strong className="text-white">Least privilege:</strong> Role-based access with minimal permissions</li>
                    <li>• <strong className="text-white">Regular audits:</strong> Annual SOC 2 and penetration testing</li>
                    <li>• <strong className="text-white">Device management:</strong> Centralized security for all company devices</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Incident Response */}
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl">
              <button
                onClick={() => toggleAccordion('incident-response')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#1A1A1A] rounded-xl transition-colors"
                data-testid="accordion-incident-response"
                id="incident-response"
              >
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-[#FFD43B] mr-3" />
                  <h3 className="text-lg font-semibold text-white">Incident Response</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-[#A5A5A5] transition-transform ${openAccordion === 'incident-response' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'incident-response' && (
                <div className="px-6 pb-6">
                  <ul className="space-y-3 text-[#A5A5A5]">
                    <li>• <strong className="text-white">24/7 monitoring:</strong> Real-time threat detection and response</li>
                    <li>• <strong className="text-white">RTO &lt; 4 hours:</strong> Recovery time objectives for critical systems</li>
                    <li>• <strong className="text-white">Status page:</strong> Real-time updates during any incidents</li>
                    <li>• <strong className="text-white">Communication plan:</strong> Immediate notification of affected users</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Learn More CTA */}
          <div className="text-center mt-16">
            <a 
              href="/security-documentation"
              data-testid="button-learn-more-security"
              className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-4 rounded-full hover:bg-[#E6C140] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:ring-offset-2 focus:ring-offset-[#0E0E0E] min-h-[44px]"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>

      {/* Data Security */}
      <section className="py-20 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Enterprise-Grade Data Protection
          </h2>

          {/* Data Encryption */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <Database className="w-8 h-8 text-[#FFD43B] mr-4" />
              <h3 className="text-2xl font-semibold text-white">Military-Grade Data Encryption</h3>
            </div>
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <p className="text-[#A5A5A5] mb-6 leading-relaxed">
                FamilyVault encrypts all data both in transit and at rest using AES 256-bit encryption—the same standard 
                required by government agencies for classified information. Your documents are protected with unique keys 
                derived from your account information and device passcode, ensuring only you can access your data.
              </p>
              <p className="text-[#A5A5A5] mb-6 leading-relaxed">
                Even in the unlikely event of a security breach, your information would remain completely unreadable without 
                the specific encryption keys. Breaking 256-bit encryption would require astronomical computational power—
                trillions of years even with the world's most advanced computers.
              </p>
              <p className="text-[#A5A5A5] leading-relaxed">
                This level of protection exceeds industry standards and meets the highest government security requirements 
                for sensitive and classified data protection.
              </p>
            </div>
          </div>

          {/* Tokenization */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <Server className="w-8 h-8 text-[#FFD43B] mr-4" />
              <h3 className="text-2xl font-semibold text-white">Advanced Tokenization Technology</h3>
            </div>
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <p className="text-[#A5A5A5] leading-relaxed">
                FamilyVault employs state-of-the-art tokenization techniques to protect sensitive information. 
                This process removes actual sensitive data from our application databases and replaces it with secure tokens, 
                keeping your personal information completely isolated and protected from your main account structure.
              </p>
            </div>
          </div>

          {/* On-screen Protection */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <Eye className="w-8 h-8 text-[#FFD43B] mr-4" />
              <h3 className="text-2xl font-semibold text-white">Screen Privacy Protection</h3>
            </div>
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <p className="text-[#A5A5A5] mb-6 leading-relaxed">
                FamilyVault automatically obscures sensitive information like Social Security numbers and account details 
                in the user interface, preventing unauthorized viewing of confidential data on your device screen.
              </p>
              <p className="text-[#A5A5A5] leading-relaxed">
                For additional privacy in public spaces, we recommend using privacy screen protectors on your devices 
                to further protect your family's sensitive information from prying eyes.
              </p>
            </div>
          </div>

          {/* AI Privacy */}
          <div>
            <div className="flex items-center mb-6">
              <Database className="w-8 h-8 text-[#FFD43B] mr-4" />
              <h3 className="text-2xl font-semibold text-white">Responsible AI Implementation</h3>
            </div>
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <div className="bg-[#0E0E0E] border border-[#FFD43B] rounded-lg p-6 mb-6">
                <p className="text-[#FFD43B] font-semibold text-lg">
                  FamilyVault never uses your personal data to train AI systems.
                </p>
              </div>
              <p className="text-[#A5A5A5] mb-6 leading-relaxed">
                Our AI integration follows a "zero-memory" approach—AI models process information without learning or storing 
                any details from your documents. The processes of document analysis and data retention are completely separate, 
                ensuring your privacy remains intact.
              </p>
              <p className="text-[#A5A5A5] leading-relaxed">
                When working with third-party AI services on our secure private cloud, FamilyVault maintains strict contractual 
                agreements to guarantee robust data privacy and security protections for all our families.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Operations */}
      <section className="py-20 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Comprehensive Security Operations
          </h2>

          {/* Partners */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-[#FFD43B] mr-4" />
              <h3 className="text-2xl font-semibold text-white">Trusted Security Partnerships</h3>
            </div>
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8">
              <p className="text-[#A5A5A5] mb-6 leading-relaxed">
                FamilyVault collaborates exclusively with security providers who maintain the highest industry standards 
                for data protection and privacy. Our partner network includes only organizations that meet our strict 
                security requirements and undergo regular audits.
              </p>
              <p className="text-[#A5A5A5] leading-relaxed">
                When family data is processed through secure cloud infrastructure, it's never used for training algorithms 
                or shared with third-party services. Your information remains dedicated solely to your family's needs.
              </p>
            </div>
          </div>

          {/* Employee Security */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-[#FFD43B] mr-4" />
              <h3 className="text-2xl font-semibold text-white">FamilyVault Team Security Standards</h3>
            </div>
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8">
              <p className="text-[#A5A5A5] mb-6 leading-relaxed">
                Every FamilyVault team member undergoes comprehensive background checks and security clearance before joining our team, 
                followed by bi-annual security and privacy training to ensure they understand our unwavering commitment to protecting 
                family information.
              </p>
              <p className="text-[#A5A5A5] mb-6 leading-relaxed">
                All employee devices and applications are managed through centralized third-party security systems, 
                allowing our security team to instantly revoke access and remotely secure or wipe devices when necessary.
              </p>
              <p className="text-[#A5A5A5] leading-relaxed">
                Security isn't just a policy at FamilyVault—it's ingrained in our company culture. Every development process 
                incorporates privacy-first principles, ensuring customer information remains protected at every stage.
              </p>
            </div>
          </div>

          {/* Emergency Verification */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <FileCheck className="w-8 h-8 text-[#FFD43B] mr-4" />
              <h3 className="text-2xl font-semibold text-white">Emergency Contact Verification</h3>
            </div>
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8">
              <p className="text-[#A5A5A5] leading-relaxed">
                When you designate Emergency Contacts for your Family Document System®, we conduct thorough identity verification 
                to confirm their authenticity. This proactive verification ensures that during family emergencies, 
                authorized contacts can immediately access critical information without time-consuming validation processes.
              </p>
            </div>
          </div>

          {/* Bug Bounty */}
          <div>
            <div className="flex items-center mb-6">
              <Award className="w-8 h-8 text-[#FFD43B] mr-4" />
              <h3 className="text-2xl font-semibold text-white">Security Research Program</h3>
            </div>
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8">
              <p className="text-[#A5A5A5] leading-relaxed">
                FamilyVault operates a comprehensive security research program to identify and address potential vulnerabilities 
                before they can be exploited. We welcome contributions from security researchers and ethical hackers who help 
                strengthen our platform's defenses. Our dedicated Security Team investigates all reports and responds promptly 
                to ensure continuous improvement of our security measures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Certifications */}
      <section className="py-20 bg-[#0E0E0E] border-t border-[#2A2A2A]" id="compliance">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Industry-Leading Compliance Standards
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* SOC 2 */}
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#2A2A2A] rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">SOC 2 Type 2</h3>
              <p className="text-[#A5A5A5] text-sm leading-relaxed mb-3">
                Security, Availability. Independently audited compliance with annual third-party penetration testing.
              </p>
              <a href="#" className="text-[#FFD43B] hover:text-[#E6C140] text-xs" data-testid="link-soc2-report">View report summary ↗</a>
            </div>

            {/* GDPR */}
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#2A2A2A] rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">EU GDPR Compliant</h3>
              <p className="text-[#A5A5A5] text-sm leading-relaxed mb-3">
                Comprehensive privacy controls and rights for global users, exceeding US requirements.
              </p>
              <a href="#" className="text-[#FFD43B] hover:text-[#E6C140] text-xs" data-testid="link-gdpr-report">View compliance letter ↗</a>
            </div>

            {/* HIPAA */}
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#2A2A2A] rounded-full flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">HIPAA Compliant</h3>
              <p className="text-[#A5A5A5] text-sm leading-relaxed mb-3">
                Medical information and health documents receive highest protection standards.
              </p>
              <a href="#" className="text-[#FFD43B] hover:text-[#E6C140] text-xs" data-testid="link-hipaa-report">Available under NDA ↗</a>
            </div>

            {/* CCPA */}
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#2A2A2A] rounded-full flex items-center justify-center mb-6">
                <FileCheck className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">CCPA Certified</h3>
              <p className="text-[#A5A5A5] text-sm leading-relaxed mb-3">
                California Consumer Privacy Act compliance with enhanced transparency.
              </p>
              <a href="#" className="text-[#FFD43B] hover:text-[#E6C140] text-xs" data-testid="link-ccpa-report">View compliance letter ↗</a>
            </div>

            {/* ISO */}
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#2A2A2A] rounded-full flex items-center justify-center mb-6">
                <Server className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">ISO 27001 Ready</h3>
              <p className="text-[#A5A5A5] text-sm leading-relaxed mb-3">
                International standards for information security management systems.
              </p>
              <a href="#" className="text-[#FFD43B] hover:text-[#E6C140] text-xs" data-testid="link-iso-report">Implementation guide ↗</a>
            </div>

            {/* SOC 3 */}
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#2A2A2A] rounded-full flex items-center justify-center mb-6">
                <Database className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">SOC 3 Certified</h3>
              <p className="text-[#A5A5A5] text-sm leading-relaxed mb-3">
                Public certification demonstrating exceptional security standards.
              </p>
              <a href="#" className="text-[#FFD43B] hover:text-[#E6C140] text-xs" data-testid="link-soc3-report">View public report ↗</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-[#151515] border border-[#2A2A2A] rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#1A1A1A] rounded-lg transition-colors"
                  data-testid={`faq-question-${index}`}
                >
                  <h3 className="text-lg font-semibold text-white pr-4">{item.question}</h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-[#A5A5A5] transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-[#A5A5A5] leading-relaxed" data-testid={`faq-answer-${index}`}>
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Secure your family's future today
          </h2>
          <p className="text-xl mb-8 text-[#A5A5A5]">
            Join thousands of families who trust FamilyVault to protect their most important documents and information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup"
              data-testid="button-get-started-security"
              className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-4 rounded-full hover:bg-[#E6C140] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:ring-offset-2 focus:ring-offset-[#0E0E0E] min-h-[44px]"
            >
              Start Your Free Trial
            </a>
            <a 
              href="/pricing"
              data-testid="button-view-pricing-security"
              className="inline-flex items-center justify-center border border-[#FFD43B] text-[#FFD43B] font-semibold px-8 py-4 rounded-full hover:bg-[#FFD43B]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:ring-offset-2 focus:ring-offset-[#0E0E0E] min-h-[44px]"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}