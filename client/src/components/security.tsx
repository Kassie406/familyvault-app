import { Lock, Shield, AlertTriangle, Zap, Key, User } from "lucide-react";

const complianceBadges = [
  "EU GDPR",
  "SOC 2 TYPE II", 
  "SOC 3",
  "HIPAA",
  "CCPA"
];

const securityFeatures = [
  {
    icon: Lock,
    title: "Multi-factor authentication",
    description: "For enhanced account security, FamilyVault requires two-factor authentication to protect against unauthorized access and phishing attacks."
  },
  {
    icon: Shield,
    title: "Tokenization", 
    description: "Tokenization removes sensitive data from the database and replaces it with a corresponding token, which keeps the sensitive information protected and separate from your account."
  },
  {
    icon: AlertTriangle,
    title: "Stolen-password alerts",
    description: "FamilyVault scans anonymized password data against dark web databases to detect breaches, then prompts you to change your account password."
  },
  {
    icon: Zap,
    title: "Threat detection",
    description: "FamilyVault employs user entity behavior analytics to monitor anomalies and unusual activities."
  },
  {
    icon: Key,
    title: "Data encryption",
    description: "FamilyVault data is encrypted in transit and at rest using 256-bit AES encryption keys."
  },
  {
    icon: User,
    title: "Biometric authentication",
    description: "FamilyVault employs facial recognition and fingerprint authentication on our mobile and desktop applications."
  }
];

export default function Security() {
  return (
    <section className="bg-[#111111] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Keep Your Information Safe
          </h2>
          <p className="text-xl text-[#CCCCCC] max-w-3xl mx-auto">
            Advanced security and compliance that ensures your family information remains private and protected
          </p>
        </div>

        {/* Compliance Badges */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-16 opacity-60">
          {complianceBadges.map((badge, index) => (
            <div 
              key={index}
              data-testid={`compliance-${index + 1}`}
              className="text-sm font-medium text-[#CCCCCC] px-4 py-2 bg-black border border-[#D4AF37] rounded-lg"
            >
              {badge}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                data-testid={`security-feature-${index + 1}`}
                className="gold-card rounded-2xl p-8 shadow-sm hover-lift"
              >
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-[#CCCCCC]">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button 
            data-testid="button-learn-more-security"
            className="cta-button px-8 py-3 rounded-lg font-semibold"
          >
            Learn more
          </button>
        </div>
      </div>
    </section>
  );
}
