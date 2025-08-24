import { Shield, Lock, User, Smartphone, Key, Server, Eye, Database, Users, FileCheck, Award, HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/navbar";

export default function Security() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
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
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Security</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            FamilyVault employs enterprise-grade security measures and cutting-edge infrastructure to safeguard your family's most important information.
            <br />Discover how we protect what matters most to you.
          </p>
        </div>
      </section>

      {/* Security Commitment */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Our security promise to your family
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {/* Protected */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Fortress-Level Protection</h3>
              <p className="text-gray-600 leading-relaxed">
                Your family's documents are safeguarded with military-grade security protocols. We utilize advanced encryption, 
                multi-layered authentication, and industry-leading security frameworks to create an impenetrable digital vault 
                for your most sensitive information.
              </p>
            </div>
            
            {/* Private */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Absolute Privacy</h3>
              <p className="text-gray-600 leading-relaxed">
                Your privacy is non-negotiable. We will never share, sell, or monetize your personal information. 
                Your family's data remains exclusively yours, protected by strict privacy policies and kept secure 
                whenever you need access.
              </p>
            </div>
            
            {/* Yours */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Complete Ownership</h3>
              <p className="text-gray-600 leading-relaxed">
                You maintain complete control over your family's information. You decide who has access, 
                what gets shared, and how your data is used. Your family's digital legacy remains entirely 
                in your hands, with full autonomy over every aspect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Security */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Advanced Application Security
          </h2>
          
          {/* Multi-factor Authentication */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <Smartphone className="w-8 h-8 text-primary mr-4" />
              <h3 className="text-2xl font-semibold text-gray-900">Enhanced Multi-Factor Authentication</h3>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <p className="text-gray-700 mb-6 leading-relaxed">
                Creating your FamilyVault account requires a unique email and a robust password with at least 8 characters, 
                including uppercase and lowercase letters, numbers, and special symbols.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Multi-factor authentication is mandatory—not optional—ensuring that only you can access your account. 
                When signing in from a new device, you'll provide both your password and a secure six-digit code sent to your phone, 
                creating multiple security layers that dramatically reduce vulnerability to cyber threats.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This dual-layer protection significantly strengthens your Family Document System® and provides robust 
                defense against phishing attempts and unauthorized access.
              </p>
            </div>
          </div>

          {/* Biometric Authentication */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <Eye className="w-8 h-8 text-primary mr-4" />
              <h3 className="text-2xl font-semibold text-gray-900">Biometric Security Integration</h3>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                FamilyVault incorporates cutting-edge biometric authentication through facial recognition and fingerprint scanning 
                on both mobile devices and desktop computers. This additional security layer combines convenience with advanced 
                protection, allowing family members to quickly and securely access their important documents.
              </p>
            </div>
          </div>

          {/* Physical Security Keys */}
          <div>
            <div className="flex items-center mb-6">
              <Key className="w-8 h-8 text-primary mr-4" />
              <h3 className="text-2xl font-semibold text-gray-900">Hardware Security Key Support</h3>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <p className="text-gray-700 mb-6 leading-relaxed">
                Physical security devices provide an additional authentication layer for online services, offering unparalleled protection 
                against account compromises.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Popular security keys like YubiKeys resemble USB drives and require physical presence for authentication, 
                making them highly effective against phishing attacks and unauthorized access attempts.
              </p>
              <p className="text-gray-700 leading-relaxed">
                FamilyVault is among the few family document platforms supporting hardware security keys. This premium feature 
                is available with our Gold subscription plan. Contact our support team to learn more about enhanced security options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Security */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Enterprise-Grade Data Protection
          </h2>

          {/* Data Encryption */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <Database className="w-8 h-8 text-primary mr-4" />
              <h3 className="text-2xl font-semibold text-gray-900">Military-Grade Data Encryption</h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-8">
              <p className="text-gray-700 mb-6 leading-relaxed">
                FamilyVault encrypts all data both in transit and at rest using AES 256-bit encryption—the same standard 
                required by government agencies for classified information. Your documents are protected with unique keys 
                derived from your account information and device passcode, ensuring only you can access your data.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Even in the unlikely event of a security breach, your information would remain completely unreadable without 
                the specific encryption keys. Breaking 256-bit encryption would require astronomical computational power—
                trillions of years even with the world's most advanced computers.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This level of protection exceeds industry standards and meets the highest government security requirements 
                for sensitive and classified data protection.
              </p>
            </div>
          </div>

          {/* Tokenization */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <Server className="w-8 h-8 text-primary mr-4" />
              <h3 className="text-2xl font-semibold text-gray-900">Advanced Tokenization Technology</h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-8">
              <p className="text-gray-700 leading-relaxed">
                FamilyVault employs state-of-the-art tokenization techniques to protect sensitive information. 
                This process removes actual sensitive data from our application databases and replaces it with secure tokens, 
                keeping your personal information completely isolated and protected from your main account structure.
              </p>
            </div>
          </div>

          {/* On-screen Protection */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <Eye className="w-8 h-8 text-primary mr-4" />
              <h3 className="text-2xl font-semibold text-gray-900">Screen Privacy Protection</h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-8">
              <p className="text-gray-700 mb-6 leading-relaxed">
                FamilyVault automatically obscures sensitive information like Social Security numbers and account details 
                in the user interface, preventing unauthorized viewing of confidential data on your device screen.
              </p>
              <p className="text-gray-700 leading-relaxed">
                For additional privacy in public spaces, we recommend using privacy screen protectors on your devices 
                to further protect your family's sensitive information from prying eyes.
              </p>
            </div>
          </div>

          {/* AI Privacy */}
          <div>
            <div className="flex items-center mb-6">
              <Database className="w-8 h-8 text-primary mr-4" />
              <h3 className="text-2xl font-semibold text-gray-900">Responsible AI Implementation</h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
                <p className="text-primary font-semibold text-lg">
                  FamilyVault never uses your personal data to train AI systems.
                </p>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Our AI integration follows a "zero-memory" approach—AI models process information without learning or storing 
                any details from your documents. The processes of document analysis and data retention are completely separate, 
                ensuring your privacy remains intact.
              </p>
              <p className="text-gray-700 leading-relaxed">
                When working with third-party AI services on our secure private cloud, FamilyVault maintains strict contractual 
                agreements to guarantee robust data privacy and security protections for all our families.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Operations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Comprehensive Security Operations
          </h2>

          {/* Partners */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-primary mr-4" />
              <h3 className="text-2xl font-semibold text-gray-900">Trusted Security Partnerships</h3>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <p className="text-gray-700 mb-6 leading-relaxed">
                FamilyVault collaborates exclusively with security providers who maintain the highest industry standards 
                for data protection and privacy. Our partner network includes only organizations that meet our strict 
                security requirements and undergo regular audits.
              </p>
              <p className="text-gray-700 leading-relaxed">
                When family data is processed through secure cloud infrastructure, it's never used for training algorithms 
                or shared with third-party services. Your information remains dedicated solely to your family's needs.
              </p>
            </div>
          </div>

          {/* Employee Security */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-primary mr-4" />
              <h3 className="text-2xl font-semibold text-gray-900">FamilyVault Team Security Standards</h3>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <p className="text-gray-700 mb-6 leading-relaxed">
                Every FamilyVault team member undergoes comprehensive background checks and security clearance before joining our team, 
                followed by bi-annual security and privacy training to ensure they understand our unwavering commitment to protecting 
                family information.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                All employee devices and applications are managed through centralized third-party security systems, 
                allowing our security team to instantly revoke access and remotely secure or wipe devices when necessary.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Security isn't just a policy at FamilyVault—it's ingrained in our company culture. Every development process 
                incorporates privacy-first principles, ensuring customer information remains protected at every stage.
              </p>
            </div>
          </div>

          {/* Emergency Verification */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <FileCheck className="w-8 h-8 text-primary mr-4" />
              <h3 className="text-2xl font-semibold text-gray-900">Emergency Contact Verification</h3>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                When you designate Emergency Contacts for your Family Document System®, we conduct thorough identity verification 
                to confirm their authenticity. This proactive verification ensures that during family emergencies, 
                authorized contacts can immediately access critical information without time-consuming validation processes.
              </p>
            </div>
          </div>

          {/* Bug Bounty */}
          <div>
            <div className="flex items-center mb-6">
              <Award className="w-8 h-8 text-primary mr-4" />
              <h3 className="text-2xl font-semibold text-gray-900">Security Research Program</h3>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <p className="text-gray-700 leading-relaxed">
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
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Industry-Leading Compliance Standards
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* GDPR */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">EU GDPR Compliant</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                FamilyVault meets the world's most stringent data protection regulations, ensuring comprehensive privacy 
                controls and rights for our global family members, even though GDPR compliance isn't required in the United States.
              </p>
            </div>

            {/* CCPA */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">CCPA Certified</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Full compliance with the California Consumer Privacy Act, providing families enhanced control over personal 
                information collection, usage, and sharing practices with comprehensive transparency.
              </p>
            </div>

            {/* SOC 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">SOC 2 Type 2</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Independently audited compliance demonstrating the highest level of information security controls and 
                operational effectiveness over extended periods, with annual third-party penetration testing.
              </p>
            </div>

            {/* SOC 3 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">SOC 3 Certified</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Public certification demonstrating our commitment to maintaining exceptional security and reliability standards, 
                fostering trust and ensuring sensitive family data is adequately protected at all times.
              </p>
            </div>

            {/* HIPAA */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-8">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">HIPAA Compliant</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Full compliance with Health Insurance Portability and Accountability Act standards, ensuring all medical 
                information and health-related family documents receive the highest level of protection and privacy.
              </p>
            </div>

            {/* ISO */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-8">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mb-6">
                <Server className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">ISO 27001 Ready</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Implementing international standards for information security management systems, ensuring systematic 
                approaches to managing sensitive family information with continuous security improvement processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors"
                  data-testid={`faq-question-${index}`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{item.question}</h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed" data-testid={`faq-answer-${index}`}>
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
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Secure your family's future today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of families who trust FamilyVault to protect their most important documents and information.
          </p>
          <button 
            data-testid="button-get-started-security"
            className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}