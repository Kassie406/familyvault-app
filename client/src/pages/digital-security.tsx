import Navbar from "@/components/navbar";
import { Lock, Shield, Key, Smartphone, Eye, AlertTriangle, CheckCircle, Wifi } from "lucide-react";

export default function DigitalSecurity() {
  const securityCategories = [
    {
      title: "Password Management",
      icon: Key,
      items: [
        "Strong, unique passwords for all accounts",
        "Password manager setup and usage",
        "Two-factor authentication (2FA) enabled",
        "Regular password updates and audits",
        "Secure password sharing with family",
        "Recovery codes and backup methods"
      ]
    },
    {
      title: "Identity Protection",
      icon: Shield,
      items: [
        "Credit monitoring services",
        "Identity theft insurance",
        "Social Security number protection",
        "Personal information privacy settings",
        "Regular credit report reviews",
        "Fraud alert setup with credit bureaus"
      ]
    },
    {
      title: "Device Security",
      icon: Smartphone,
      items: [
        "Device lock screens and encryption",
        "Regular software updates",
        "Secure Wi-Fi usage practices",
        "VPN for public internet access",
        "Automatic backup configurations",
        "Remote wipe capabilities"
      ]
    },
    {
      title: "Online Privacy",
      icon: Eye,
      items: [
        "Social media privacy settings",
        "Email security and encryption",
        "Safe browsing and phishing awareness",
        "Secure communication apps",
        "Personal data cleanup",
        "Digital footprint monitoring"
      ]
    }
  ];

  const securityTips = [
    {
      title: "Use Strong, Unique Passwords",
      description: "Create complex passwords with a mix of letters, numbers, and symbols. Never reuse passwords across multiple accounts.",
      priority: "Critical"
    },
    {
      title: "Enable Two-Factor Authentication",
      description: "Add an extra layer of security with 2FA on all important accounts, especially email and financial services.",
      priority: "Critical"
    },
    {
      title: "Keep Software Updated",
      description: "Install security updates promptly on all devices and applications to protect against known vulnerabilities.",
      priority: "High"
    },
    {
      title: "Be Cautious with Public Wi-Fi",
      description: "Use a VPN when connecting to public networks and avoid accessing sensitive accounts on unsecured connections.",
      priority: "High"
    },
    {
      title: "Monitor Your Digital Footprint",
      description: "Regularly review privacy settings and monitor what personal information is publicly available online.",
      priority: "Medium"
    },
    {
      title: "Backup Important Data",
      description: "Maintain secure backups of important files and documents using encrypted cloud storage or external drives.",
      priority: "Medium"
    }
  ];

  const commonThreats = [
    {
      threat: "Phishing Emails",
      description: "Fraudulent emails designed to steal personal information or login credentials",
      prevention: "Verify sender identity, don't click suspicious links, check URLs carefully"
    },
    {
      threat: "Identity Theft",
      description: "Unauthorized use of personal information to commit fraud or other crimes",
      prevention: "Monitor credit reports, limit information sharing, use identity monitoring services"
    },
    {
      threat: "Malware Attacks",
      description: "Malicious software that can damage devices or steal sensitive information",
      prevention: "Use antivirus software, avoid suspicious downloads, keep software updated"
    },
    {
      threat: "Social Engineering",
      description: "Psychological manipulation to trick people into divulging confidential information",
      prevention: "Be skeptical of unsolicited contact, verify identities independently, never share sensitive info"
    },
    {
      threat: "Data Breaches",
      description: "Unauthorized access to company databases containing personal information",
      prevention: "Use unique passwords, monitor account activity, enable breach notifications"
    },
    {
      threat: "Public Wi-Fi Risks",
      description: "Unsecured networks that can expose personal data to cybercriminals",
      prevention: "Use VPN, avoid sensitive activities, verify network authenticity"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Digital Security Essentials
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Protect your family's digital life with comprehensive security practices. Learn how to safeguard 
            personal information, secure devices, and maintain privacy in our connected world.
          </p>
        </div>
      </section>

      {/* Security Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Core Digital Security Areas
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Focus on these essential security areas to protect your family's digital information and privacy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {securityCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0 mt-0.5" />
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

      {/* Security Tips */}
      <section className="py-20 bg-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Essential Security Practices</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Implement these proven security practices to protect your family's digital assets
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityTips.map((tip, index) => (
              <div key={index} className="bg-purple-500 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    tip.priority === 'Critical' ? 'bg-red-500 text-white' :
                    tip.priority === 'High' ? 'bg-orange-500 text-white' :
                    'bg-yellow-500 text-gray-800'
                  }`}>
                    {tip.priority}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-3">{tip.title}</h3>
                <p className="text-purple-100 leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Threats */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <AlertTriangle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Common Digital Threats</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Understand these common cyber threats and how to protect yourself and your family
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {commonThreats.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{item.threat}</h3>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                <div className="border-t pt-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Prevention:</p>
                  <p className="text-sm text-gray-700">{item.prevention}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Statistics */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">43%</div>
              <p className="text-gray-700">of cyber attacks target small businesses</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">15B</div>
              <p className="text-gray-700">records exposed in data breaches annually</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
              <p className="text-gray-700">of successful attacks are due to human error</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Secure Your Family's Digital Future
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Keep your digital security information organized and ensure your family knows how to stay safe online.
          </p>
          <a
            href="/signup"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Organize Security Information
          </a>
        </div>
      </section>
    </div>
  );
}