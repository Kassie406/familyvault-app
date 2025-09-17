import { Shield, Lock, Server, Database, Award, FileCheck, Eye, Users, Key, Smartphone, CheckCircle, ExternalLink } from "lucide-react";
import Navbar from "@/components/navbar";

export default function SecurityDocumentation() {
  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#121212] to-[#0E0E0E] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-6">Security Documentation</h1>
            <p className="text-xl text-[#A5A5A5] leading-relaxed">
              Complete technical documentation of FamilyCircle Secure's security architecture, 
              compliance certifications, and data protection measures.
            </p>
          </div>
          
          {/* Quick Navigation */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <a href="#technical-architecture" className="bg-[#121212] border border-[#2A2A2A] rounded-lg p-4 hover:bg-[#1A1A1A] transition-colors">
              <h3 className="text-[#FFD43B] font-semibold mb-2">Technical Architecture</h3>
              <p className="text-sm text-[#A5A5A5]">Encryption, tokenization, and infrastructure security</p>
            </a>
            <a href="#compliance" className="bg-[#121212] border border-[#2A2A2A] rounded-lg p-4 hover:bg-[#1A1A1A] transition-colors">
              <h3 className="text-[#FFD43B] font-semibold mb-2">Compliance & Audits</h3>
              <p className="text-sm text-[#A5A5A5]">SOC 2, GDPR, HIPAA, and certification reports</p>
            </a>
            <a href="#operational-security" className="bg-[#121212] border border-[#2A2A2A] rounded-lg p-4 hover:bg-[#1A1A1A] transition-colors">
              <h3 className="text-[#FFD43B] font-semibold mb-2">Operational Security</h3>
              <p className="text-sm text-[#A5A5A5]">Employee access, monitoring, and incident response</p>
            </a>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section id="technical-architecture" className="py-20 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Technical Security Architecture</h2>
          
          {/* Encryption at Rest */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Database className="w-8 h-8 text-[#FFD43B] mr-4" />
              <h3 className="text-2xl font-semibold text-white">Data Encryption at Rest</h3>
            </div>
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">AES-256 Encryption</h4>
                  <ul className="space-y-2 text-[#A5A5A5] mb-6">
                    <li>• Military-grade 256-bit Advanced Encryption Standard</li>
                    <li>• Unique encryption keys per user account</li>
                    <li>• Key derivation from account credentials and device passcode</li>
                    <li>• Hardware Security Module (HSM) key storage</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Database Security</h4>
                  <ul className="space-y-2 text-[#A5A5A5] mb-6">
                    <li>• Encrypted database volumes with separate encryption keys</li>
                    <li>• Database-level encryption independent of disk encryption</li>
                    <li>• Automated key rotation every 90 days</li>
                    <li>• Zero-knowledge architecture - we cannot decrypt your data</li>
                  </ul>
                </div>
              </div>
              <div className="bg-[#0E0E0E] border border-[#FFD43B] rounded-lg p-4 mt-6">
                <p className="text-[#FFD43B] font-medium">
                  Breaking AES-256 encryption would require 2^256 attempts - more computational power than exists on Earth.
                </p>
              </div>
            </div>
          </div>

          {/* Encryption in Transit */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-[#FFD43B] mr-4" />
              <h3 className="text-2xl font-semibold text-white">Data Encryption in Transit</h3>
            </div>
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">TLS 1.3 Implementation</h4>
                  <ul className="space-y-2 text-[#A5A5A5]">
                    <li>• Latest Transport Layer Security protocol</li>
                    <li>• Perfect Forward Secrecy (PFS)</li>
                    <li>• HSTS (HTTP Strict Transport Security) enforced</li>
                    <li>• Certificate pinning for mobile applications</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">End-to-End Protection</h4>
                  <ul className="space-y-2 text-[#A5A5A5]">
                    <li>• Client-side encryption before transmission</li>
                    <li>• No plaintext data over network connections</li>
                    <li>• Encrypted API communications</li>
                    <li>• Secure WebSocket connections for real-time features</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Tokenization */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Key className="w-8 h-8 text-[#FFD43B] mr-4" />
              <h3 className="text-2xl font-semibold text-white">Data Tokenization</h3>
            </div>
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8">
              <p className="text-[#A5A5A5] mb-6 leading-relaxed">
                Sensitive data elements are replaced with non-sensitive tokens that have no exploitable meaning or value. 
                The actual sensitive data is stored in a separate, highly secure token vault.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Social Security Numbers</h4>
                  <p className="text-[#A5A5A5] text-sm">Replaced with random tokens, actual numbers stored separately</p>
                </div>
                <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Financial Account Numbers</h4>
                  <p className="text-[#A5A5A5] text-sm">Tokenized with format-preserving encryption</p>
                </div>
                <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Medical Information</h4>
                  <p className="text-[#A5A5A5] text-sm">HIPAA-compliant tokenization for health data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication & Access Control */}
      <section className="py-20 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Authentication & Access Control</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Multi-Factor Authentication */}
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <div className="flex items-center mb-6">
                <Smartphone className="w-8 h-8 text-[#FFD43B] mr-4" />
                <h3 className="text-xl font-semibold text-white">Multi-Factor Authentication</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#FFD43B] mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Mandatory MFA</h4>
                    <p className="text-[#A5A5A5] text-sm">Required for all accounts, no exceptions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#FFD43B] mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Hardware Security Keys</h4>
                    <p className="text-[#A5A5A5] text-sm">FIDO2/WebAuthn support for YubiKey and similar devices</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#FFD43B] mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Biometric Authentication</h4>
                    <p className="text-[#A5A5A5] text-sm">Facial recognition and fingerprint authentication on supported devices</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#FFD43B] mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">TOTP & SMS</h4>
                    <p className="text-[#A5A5A5] text-sm">Time-based one-time passwords and SMS backup options</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Access Control */}
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <div className="flex items-center mb-6">
                <Users className="w-8 h-8 text-[#FFD43B] mr-4" />
                <h3 className="text-xl font-semibold text-white">Granular Access Control</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#FFD43B] mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Role-Based Permissions</h4>
                    <p className="text-[#A5A5A5] text-sm">Granular control over who can view, edit, or share documents</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#FFD43B] mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Time-Limited Access</h4>
                    <p className="text-[#A5A5A5] text-sm">Set expiration dates for shared document access</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#FFD43B] mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Emergency Access</h4>
                    <p className="text-[#A5A5A5] text-sm">Verified emergency contacts with identity verification</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#FFD43B] mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Audit Logging</h4>
                    <p className="text-[#A5A5A5] text-sm">Complete audit trail of all access and modifications</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Certifications */}
      <section id="compliance" className="py-20 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Compliance & Certifications</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* SOC 2 Type II */}
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#2A2A2A] rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">SOC 2 Type II</h3>
              <p className="text-[#A5A5A5] text-sm leading-relaxed mb-4">
                Annual independent audit of security controls covering Security, Availability, 
                Processing Integrity, Confidentiality, and Privacy.
              </p>
              <div className="space-y-2 text-xs text-[#A5A5A5] mb-4">
                <p>• Latest audit: March 2024</p>
                <p>• Next audit: March 2025</p>
                <p>• Zero material weaknesses identified</p>
              </div>
              <a href="#" className="text-[#FFD43B] hover:text-[#E6C140] text-xs flex items-center">
                View Report Summary <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>

            {/* GDPR */}
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#2A2A2A] rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">EU GDPR Compliant</h3>
              <p className="text-[#A5A5A5] text-sm leading-relaxed mb-4">
                Comprehensive privacy controls meeting European Union General Data Protection Regulation requirements.
              </p>
              <div className="space-y-2 text-xs text-[#A5A5A5] mb-4">
                <p>• Right to access and portability</p>
                <p>• Right to rectification and erasure</p>
                <p>• Data Protection Impact Assessments</p>
              </div>
              <a href="#" className="text-[#FFD43B] hover:text-[#E6C140] text-xs flex items-center">
                View Compliance Letter <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>

            {/* HIPAA */}
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#2A2A2A] rounded-full flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">HIPAA Compliant</h3>
              <p className="text-[#A5A5A5] text-sm leading-relaxed mb-4">
                Health Insurance Portability and Accountability Act compliance for medical information protection.
              </p>
              <div className="space-y-2 text-xs text-[#A5A5A5] mb-4">
                <p>• Administrative safeguards</p>
                <p>• Physical safeguards</p>
                <p>• Technical safeguards</p>
              </div>
              <a href="#" className="text-[#FFD43B] hover:text-[#E6C140] text-xs flex items-center">
                Available under NDA <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>

            {/* CCPA */}
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#2A2A2A] rounded-full flex items-center justify-center mb-6">
                <FileCheck className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">CCPA Certified</h3>
              <p className="text-[#A5A5A5] text-sm leading-relaxed mb-4">
                California Consumer Privacy Act compliance with enhanced user rights and transparency.
              </p>
              <div className="space-y-2 text-xs text-[#A5A5A5] mb-4">
                <p>• Right to know about data collection</p>
                <p>• Right to delete personal information</p>
                <p>• Right to opt-out of data sales</p>
              </div>
              <a href="#" className="text-[#FFD43B] hover:text-[#E6C140] text-xs flex items-center">
                View Compliance Letter <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>

            {/* ISO 27001 */}
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#2A2A2A] rounded-full flex items-center justify-center mb-6">
                <Server className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">ISO 27001 Ready</h3>
              <p className="text-[#A5A5A5] text-sm leading-relaxed mb-4">
                International standard for information security management systems implementation.
              </p>
              <div className="space-y-2 text-xs text-[#A5A5A5] mb-4">
                <p>• Information security policies</p>
                <p>• Risk assessment procedures</p>
                <p>• Continuous improvement process</p>
              </div>
              <a href="#" className="text-[#FFD43B] hover:text-[#E6C140] text-xs flex items-center">
                Implementation Guide <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>

            {/* SOC 3 */}
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#2A2A2A] rounded-full flex items-center justify-center mb-6">
                <Database className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">SOC 3 Certified</h3>
              <p className="text-[#A5A5A5] text-sm leading-relaxed mb-4">
                Public report demonstrating security controls effectiveness for general distribution.
              </p>
              <div className="space-y-2 text-xs text-[#A5A5A5] mb-4">
                <p>• Publicly available report</p>
                <p>• Third-party validated</p>
                <p>• Annual certification renewal</p>
              </div>
              <a href="#" className="text-[#FFD43B] hover:text-[#E6C140] text-xs flex items-center">
                View Public Report <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Security */}
      <section id="operational-security" className="py-20 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Operational Security</h2>
          
          {/* Employee Security */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-[#FFD43B] mr-4" />
              <h3 className="text-2xl font-semibold text-white">Employee Security Program</h3>
            </div>
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Background Checks & Training</h4>
                  <ul className="space-y-2 text-[#A5A5A5]">
                    <li>• Comprehensive background verification for all employees</li>
                    <li>• Security clearance requirements for data access roles</li>
                    <li>• Annual security awareness training and certification</li>
                    <li>• Regular phishing simulation and incident response drills</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Access Management</h4>
                  <ul className="space-y-2 text-[#A5A5A5]">
                    <li>• Principle of least privilege access enforcement</li>
                    <li>• Role-based access control with quarterly reviews</li>
                    <li>• Centralized device management and monitoring</li>
                    <li>• Immediate access revocation for departing employees</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure Security */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Server className="w-8 h-8 text-[#FFD43B] mr-4" />
              <h3 className="text-2xl font-semibold text-white">Infrastructure Security</h3>
            </div>
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Cloud Security</h4>
                  <ul className="space-y-2 text-[#A5A5A5]">
                    <li>• AWS SOC 2 Type II compliant infrastructure</li>
                    <li>• Multi-region data replication and backup</li>
                    <li>• Network segmentation and micro-segmentation</li>
                    <li>• DDoS protection and traffic monitoring</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Monitoring & Response</h4>
                  <ul className="space-y-2 text-[#A5A5A5]">
                    <li>• 24/7 security operations center (SOC) monitoring</li>
                    <li>• Real-time threat detection and alerting</li>
                    <li>• Automated incident response procedures</li>
                    <li>• Recovery time objective (RTO) under 4 hours</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Security Research Program */}
          <div>
            <div className="flex items-center mb-6">
              <Award className="w-8 h-8 text-[#FFD43B] mr-4" />
              <h3 className="text-2xl font-semibold text-white">Security Research Program</h3>
            </div>
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <p className="text-[#A5A5A5] leading-relaxed mb-6">
                FamilyCircle Secure operates a comprehensive security research program to proactively identify 
                and address potential vulnerabilities. We collaborate with ethical hackers and security 
                researchers worldwide to strengthen our platform's defenses.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Bug Bounty Program</h4>
                  <p className="text-[#A5A5A5] text-sm">Rewards for responsibly disclosed security vulnerabilities</p>
                </div>
                <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Penetration Testing</h4>
                  <p className="text-[#A5A5A5] text-sm">Quarterly third-party security assessments</p>
                </div>
                <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Responsible Disclosure</h4>
                  <p className="text-[#A5A5A5] text-sm">Clear process for reporting security issues</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-20 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Additional Security Resources
          </h2>
          <p className="text-xl mb-8 text-[#A5A5A5]">
            Download comprehensive security documentation and compliance reports.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a 
              href="#"
              data-testid="download-security-whitepaper"
              className="inline-flex items-center justify-center bg-[#121212] border border-[#2A2A2A] text-white font-medium px-6 py-4 rounded-lg hover:bg-[#1A1A1A] transition-colors"
            >
              <FileCheck className="w-5 h-5 mr-2" />
              Security Whitepaper (PDF)
            </a>
            <a 
              href="#"
              data-testid="download-privacy-policy"
              className="inline-flex items-center justify-center bg-[#121212] border border-[#2A2A2A] text-white font-medium px-6 py-4 rounded-lg hover:bg-[#1A1A1A] transition-colors"
            >
              <Shield className="w-5 h-5 mr-2" />
              Privacy Policy (PDF)
            </a>
            <a 
              href="#"
              data-testid="download-compliance-summary"
              className="inline-flex items-center justify-center bg-[#121212] border border-[#2A2A2A] text-white font-medium px-6 py-4 rounded-lg hover:bg-[#1A1A1A] transition-colors"
            >
              <Award className="w-5 h-5 mr-2" />
              Compliance Summary (PDF)
            </a>
          </div>
          
          <div className="mt-12">
            <a 
              href="/security"
              data-testid="button-back-to-security"
              className="inline-flex items-center justify-center border border-[#FFD43B] text-[#FFD43B] font-semibold px-8 py-4 rounded-full hover:bg-[#FFD43B]/10 transition-colors"
            >
              ← Back to Security Overview
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}