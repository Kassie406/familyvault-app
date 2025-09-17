import { Shield, Lock, Award, FileCheck, Database, Server, Users, Eye, Download, ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";

export default function TrustOverview() {
  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      <Navbar />
      
      {/* Header */}
      <section className="bg-gradient-to-b from-[#121212] to-[#0E0E0E] pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-6">Trust Overview</h1>
            <p className="text-xl text-[#A5A5A5] leading-relaxed mb-8">
              Comprehensive security, compliance, and privacy documentation for FamilyCircle Secure
            </p>
            
            {/* Document Metadata */}
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6 mb-8">
              <div className="grid md:grid-cols-3 gap-4 text-sm text-[#A5A5A5]">
                <div>
                  <span className="text-[#FFD43B] font-medium">Document Version:</span> 2024.03
                </div>
                <div>
                  <span className="text-[#FFD43B] font-medium">Last Updated:</span> March 2025
                </div>
                <div>
                  <span className="text-[#FFD43B] font-medium">Classification:</span> Public
                </div>
              </div>
            </div>
            
            {/* Download Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                data-testid="button-download-pdf"
                className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-6 py-3 rounded-full hover:bg-[#E6C140] transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF Version
              </button>
              <a
                href="/security"
                data-testid="button-back-to-security"
                className="inline-flex items-center justify-center border border-[#FFD43B] text-[#FFD43B] font-semibold px-6 py-3 rounded-full hover:bg-[#FFD43B]/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Security
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="py-16 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Executive Summary</h2>
          
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8 mb-8">
            <p className="text-[#A5A5A5] leading-relaxed mb-6">
              FamilyCircle Secure is committed to maintaining the highest standards of security, privacy, and compliance 
              to protect our customers' most sensitive family information. This Trust Overview provides transparency 
              into our security practices, compliance certifications, and operational procedures.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Security Highlights</h3>
                <ul className="space-y-2 text-[#A5A5A5]">
                  <li>• AES-256 encryption for data at rest and in transit</li>
                  <li>• Multi-factor authentication required for all accounts</li>
                  <li>• Zero-knowledge architecture</li>
                  <li>• SOC 2 Type II certified</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Compliance Standards</h3>
                <ul className="space-y-2 text-[#A5A5A5]">
                  <li>• GDPR compliant for EU users</li>
                  <li>• HIPAA compliant for medical information</li>
                  <li>• CCPA certified for California residents</li>
                  <li>• ISO 27001 implementation ready</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Architecture */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Security Architecture</h2>
          
          {/* Data Protection */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Database className="w-8 h-8 text-[#FFD43B] mr-4" />
              <h3 className="text-2xl font-semibold text-white">Data Protection Framework</h3>
            </div>
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Encryption Standards</h4>
                  <div className="space-y-3">
                    <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg p-4">
                      <h5 className="text-[#FFD43B] font-medium mb-2">Data at Rest</h5>
                      <p className="text-[#A5A5A5] text-sm">AES-256 encryption with unique per-user keys stored in Hardware Security Modules (HSM)</p>
                    </div>
                    <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg p-4">
                      <h5 className="text-[#FFD43B] font-medium mb-2">Data in Transit</h5>
                      <p className="text-[#A5A5A5] text-sm">TLS 1.3 with Perfect Forward Secrecy and certificate pinning</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Data Classification</h4>
                  <div className="space-y-3">
                    <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg p-4">
                      <h5 className="text-[#FFD43B] font-medium mb-2">Sensitive Data</h5>
                      <p className="text-[#A5A5A5] text-sm">SSN, financial accounts, medical records - tokenized and encrypted</p>
                    </div>
                    <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg p-4">
                      <h5 className="text-[#FFD43B] font-medium mb-2">Personal Data</h5>
                      <p className="text-[#A5A5A5] text-sm">Names, addresses, contact information - encrypted at rest</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Access Controls */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Lock className="w-8 h-8 text-[#FFD43B] mr-4" />
              <h3 className="text-2xl font-semibold text-white">Access Control System</h3>
            </div>
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg p-4">
                  <Shield className="w-8 h-8 text-[#FFD43B] mb-3" />
                  <h4 className="text-white font-semibold mb-2">Multi-Factor Authentication</h4>
                  <p className="text-[#A5A5A5] text-sm">Required for all users with support for TOTP, SMS, biometrics, and hardware keys</p>
                </div>
                <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg p-4">
                  <Users className="w-8 h-8 text-[#FFD43B] mb-3" />
                  <h4 className="text-white font-semibold mb-2">Role-Based Access</h4>
                  <p className="text-[#A5A5A5] text-sm">Granular permissions with family member roles and time-limited access controls</p>
                </div>
                <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg p-4">
                  <Eye className="w-8 h-8 text-[#FFD43B] mb-3" />
                  <h4 className="text-white font-semibold mb-2">Zero-Knowledge</h4>
                  <p className="text-[#A5A5A5] text-sm">FamilyCircle Secure employees cannot access user data even with administrative privileges</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Certifications */}
      <section className="py-16 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Compliance Certifications</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* SOC 2 Type II */}
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8">
              <div className="flex items-center mb-6">
                <Award className="w-10 h-10 text-[#FFD43B] mr-4" />
                <div>
                  <h3 className="text-xl font-bold text-white">SOC 2 Type II</h3>
                  <p className="text-[#A5A5A5] text-sm">System and Organization Controls</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Trust Service Criteria:</h4>
                  <ul className="text-[#A5A5A5] text-sm space-y-1">
                    <li>• Security - Protection against unauthorized access</li>
                    <li>• Availability - System operational availability</li>
                    <li>• Processing Integrity - Complete and accurate processing</li>
                    <li>• Confidentiality - Designated confidential information protection</li>
                    <li>• Privacy - Personal information collection and use</li>
                  </ul>
                </div>
                <div className="bg-[#0E0E0E] border border-[#FFD43B] rounded-lg p-4">
                  <p className="text-[#FFD43B] font-medium text-sm">Latest Audit: March 2024 | Next Audit: March 2025</p>
                  <p className="text-[#A5A5A5] text-sm mt-1">Zero material weaknesses identified</p>
                </div>
              </div>
            </div>

            {/* GDPR Compliance */}
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8">
              <div className="flex items-center mb-6">
                <Shield className="w-10 h-10 text-[#FFD43B] mr-4" />
                <div>
                  <h3 className="text-xl font-bold text-white">EU GDPR Compliant</h3>
                  <p className="text-[#A5A5A5] text-sm">General Data Protection Regulation</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">User Rights Supported:</h4>
                  <ul className="text-[#A5A5A5] text-sm space-y-1">
                    <li>• Right to access personal data</li>
                    <li>• Right to data portability</li>
                    <li>• Right to rectification and erasure</li>
                    <li>• Right to restrict processing</li>
                    <li>• Right to object to processing</li>
                  </ul>
                </div>
                <div className="bg-[#0E0E0E] border border-[#FFD43B] rounded-lg p-4">
                  <p className="text-[#FFD43B] font-medium text-sm">Data Protection Impact Assessment completed</p>
                  <p className="text-[#A5A5A5] text-sm mt-1">EU Representative appointed</p>
                </div>
              </div>
            </div>

            {/* HIPAA Compliance */}
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8">
              <div className="flex items-center mb-6">
                <FileCheck className="w-10 h-10 text-[#FFD43B] mr-4" />
                <div>
                  <h3 className="text-xl font-bold text-white">HIPAA Compliant</h3>
                  <p className="text-[#A5A5A5] text-sm">Health Insurance Portability and Accountability Act</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Safeguards Implemented:</h4>
                  <ul className="text-[#A5A5A5] text-sm space-y-1">
                    <li>• Administrative safeguards</li>
                    <li>• Physical safeguards</li>
                    <li>• Technical safeguards</li>
                    <li>• Business Associate Agreements</li>
                  </ul>
                </div>
                <div className="bg-[#0E0E0E] border border-[#FFD43B] rounded-lg p-4">
                  <p className="text-[#FFD43B] font-medium text-sm">PHI encryption and access controls</p>
                  <p className="text-[#A5A5A5] text-sm mt-1">Risk assessment completed annually</p>
                </div>
              </div>
            </div>

            {/* ISO 27001 */}
            <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8">
              <div className="flex items-center mb-6">
                <Server className="w-10 h-10 text-[#FFD43B] mr-4" />
                <div>
                  <h3 className="text-xl font-bold text-white">ISO 27001 Ready</h3>
                  <p className="text-[#A5A5A5] text-sm">Information Security Management</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">ISMS Components:</h4>
                  <ul className="text-[#A5A5A5] text-sm space-y-1">
                    <li>• Information security policies</li>
                    <li>• Risk management framework</li>
                    <li>• Security controls implementation</li>
                    <li>• Continuous monitoring and improvement</li>
                  </ul>
                </div>
                <div className="bg-[#0E0E0E] border border-[#FFD43B] rounded-lg p-4">
                  <p className="text-[#FFD43B] font-medium text-sm">Documentation and procedures established</p>
                  <p className="text-[#A5A5A5] text-sm mt-1">Certification process initiated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Security */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Operational Security</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Employee Security Program</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-[#FFD43B] font-medium mb-2">Background Verification</h4>
                  <p className="text-[#A5A5A5] text-sm">Comprehensive background checks for all employees with access to customer data</p>
                </div>
                <div>
                  <h4 className="text-[#FFD43B] font-medium mb-2">Security Training</h4>
                  <p className="text-[#A5A5A5] text-sm">Annual security awareness training and quarterly phishing simulation exercises</p>
                </div>
                <div>
                  <h4 className="text-[#FFD43B] font-medium mb-2">Access Management</h4>
                  <p className="text-[#A5A5A5] text-sm">Principle of least privilege with role-based access control and quarterly reviews</p>
                </div>
              </div>
            </div>

            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Infrastructure Security</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-[#FFD43B] font-medium mb-2">Cloud Security</h4>
                  <p className="text-[#A5A5A5] text-sm">AWS infrastructure with SOC 2 compliance and multi-region redundancy</p>
                </div>
                <div>
                  <h4 className="text-[#FFD43B] font-medium mb-2">Monitoring</h4>
                  <p className="text-[#A5A5A5] text-sm">24/7 security operations center with real-time threat detection and response</p>
                </div>
                <div>
                  <h4 className="text-[#FFD43B] font-medium mb-2">Incident Response</h4>
                  <p className="text-[#A5A5A5] text-sm">Recovery time objective under 4 hours with automated failover procedures</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Third-Party Security */}
      <section className="py-16 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Third-Party Security Assessment</h2>
          
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-[#FFD43B]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Penetration Testing</h3>
                <p className="text-[#A5A5A5] text-sm">Quarterly assessments by certified ethical hackers</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-[#FFD43B]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Security Audits</h3>
                <p className="text-[#A5A5A5] text-sm">Annual independent security audits and compliance reviews</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#FFD43B]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Bug Bounty Program</h3>
                <p className="text-[#A5A5A5] text-sm">Responsible disclosure program with security researchers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Security Contact Information</h2>
          
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Security Team</h3>
                <div className="space-y-2 text-[#A5A5A5]">
                  <p>Email: security@familyvault.com</p>
                  <p>Response time: 24 hours</p>
                  <p>PGP Key: Available upon request</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Bug Bounty Program</h3>
                <div className="space-y-2 text-[#A5A5A5]">
                  <p>Email: bounty@familyvault.com</p>
                  <p>Scope: Production systems only</p>
                  <p>Rewards: $100 - $5,000</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              data-testid="button-download-trust-overview"
              className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-4 rounded-full hover:bg-[#E6C140] transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Complete Trust Overview (PDF)
            </button>
            <a
              href="mailto:security@familyvault.com"
              data-testid="button-contact-security-team"
              className="inline-flex items-center justify-center border border-[#FFD43B] text-[#FFD43B] font-semibold px-8 py-4 rounded-full hover:bg-[#FFD43B]/10 transition-colors"
            >
              Contact Security Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}