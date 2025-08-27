import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    name: "Free",
    subtitle: "For families looking to get started",
    price: "$0",
    period: "Forever",
    popular: false,
    features: [
      "Advanced security & privacy",
      "12 items",
      "Autopilot™ (trial)", 
      "Unlimited collaborators"
    ],
    buttonText: "Get started",
    buttonLink: "/signup"
  },
  {
    name: "Silver", 
    subtitle: "Upload unlimited items and unlock additional resources",
    price: "$10",
    period: "Per month. Paid annually.",
    popular: true,
    features: [
      "Everything in Free plus:",
      "Unlimited items",
      "Unlimited Autopilot™",
      "YubiKey support",
      "FamilyVault Marketplace™ discounts",
      "And more…"
    ],
    buttonText: "Get started",
    buttonLink: "/signup"
  },
  {
    name: "Gold",
    subtitle: "Total peace of mind for your family & your family business", 
    price: "$20",
    period: "Per month. Paid annually.",
    popular: false,
    features: [
      "Everything in Silver plus:",
      "Business information organization (LLCs, C-Corp, S-Corp, K1s, etc.)",
      "Reminders for important filing and compliance dates",
      "Access business documents from anywhere",
      "Prioritized customer support via email, chat, and SMS",
      "And more…"
    ],
    buttonText: "Get started",
    buttonLink: "/signup"
  },
  {
    name: "For advisors",
    subtitle: "Keep client information organized and secure",
    price: "Custom Pricing",
    period: "",
    popular: false,
    features: [
      "Everything in Gold plus:",
      "Advisor portal",
      "Volume-based pricing",
      "Co-branding",
      "FamilyVault Certified Expert™ training",
      "Dedicated account manager",
      "And more…"
    ],
    buttonText: "Schedule a demo",
    buttonLink: "/schedule-demo"
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      
      {/* Header */}
      <section className="bg-gradient-to-b from-[#0a0a0a] to-[#FFD700]/10 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            For every family, at every stage of life,
          </h1>
          <p className="text-2xl lg:text-3xl text-white">
            FamilyVault has a plan for you.
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="bg-gradient-to-b from-[#FFD700]/10 to-[#0a0a0a] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`gold-card rounded-2xl p-8 text-center hover-lift relative ${
                  plan.popular ? 'ring-2 ring-[var(--secondary-accent)]' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[var(--secondary-accent)] text-black px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-[var(--primary-gold)] mb-2">{plan.name}</h3>
                <p className="text-[#CCCCCC] mb-6">{plan.subtitle}</p>
                
                <div className="mb-6">
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{plan.price}</div>
                  {plan.period && <p className="text-[#CCCCCC]">{plan.period}</p>}
                </div>
                
                <a
                  href={plan.buttonLink}
                  data-testid={`button-${plan.name.toLowerCase()}-plan`}
                  className="bg-[#FFD700] hover:bg-[#FFD700]/90 hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] text-black w-full inline-block px-6 py-3 rounded-lg font-semibold mb-6 transition-all duration-300"
                >
                  {plan.buttonText}
                </a>
                
                <ul className="space-y-3 text-left">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-[var(--primary-gold)] mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-[#CCCCCC]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-[#CCCCCC] mb-2">30-day money-back guarantee</p>
            <p className="text-[#CCCCCC]">
              We're proud to support{' '}
              <a href="mailto:support@familyvault.com" className="text-[var(--primary-gold)] hover:text-[var(--secondary-accent)]">
                community heroes with a 50% discount.
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Complete Compare Plans Table */}
      <section className="bg-gradient-to-b from-[#0a0a0a] to-[#121212] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-16">
            Compare plans
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--dark-accent)]">
                  <th className="text-left py-4 text-white font-semibold"></th>
                  <th className="text-center py-4 text-[var(--primary-gold)] font-semibold">Free</th>
                  <th className="text-center py-4 text-[var(--primary-gold)] font-semibold">Silver</th>
                  <th className="text-center py-4 text-[var(--primary-gold)] font-semibold">Gold</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--dark-accent)]">
                  <td className="py-4"></td>
                  <td className="text-center py-4">
                    <a href="/signup" className="bg-[#FFD700] hover:bg-[#FFD700]/90 hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] text-black px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300">Get started</a>
                  </td>
                  <td className="text-center py-4">
                    <a href="/signup" className="bg-[#FFD700] hover:bg-[#FFD700]/90 hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] text-black px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300">Get started</a>
                  </td>
                  <td className="text-center py-4">
                    <a href="/signup" className="bg-[#FFD700] hover:bg-[#FFD700]/90 hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] text-black px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300">Get started</a>
                  </td>
                </tr>
                
                {/* Features Section */}
                <tr>
                  <td colSpan={4} className="py-6">
                    <h3 className="text-xl font-bold text-[var(--primary-gold)]">Features</h3>
                  </td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Items</td>
                  <td className="text-center py-3 text-[#CCCCCC]">12</td>
                  <td className="text-center py-3 text-[#CCCCCC]">Unlimited</td>
                  <td className="text-center py-3 text-[#CCCCCC]">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Autopilot</td>
                  <td className="text-center py-3 text-[#CCCCCC]">10 documents</td>
                  <td className="text-center py-3 text-[#CCCCCC]">Unlimited</td>
                  <td className="text-center py-3 text-[#CCCCCC]">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Advanced security & privacy</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Inbox</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">SecureLink™ sharing</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Search</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Reminders</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Recommendation engine</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Mobile app</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Browser extension</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Email to Inbox</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Automatic layout</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Household data graph</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">The FamilyVault Marketplace™</td>
                  <td className="text-center py-3 text-red-500">✗</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">YubiKey support</td>
                  <td className="text-center py-3 text-red-500">✗</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Collaborators</td>
                  <td className="text-center py-3 text-[#CCCCCC]">Unlimited</td>
                  <td className="text-center py-3 text-[#CCCCCC]">Unlimited</td>
                  <td className="text-center py-3 text-[#CCCCCC]">Unlimited</td>
                </tr>
                
                {/* Support Section */}
                <tr>
                  <td colSpan={4} className="py-6">
                    <h3 className="text-xl font-bold text-[var(--primary-gold)]">Support</h3>
                  </td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Help center articles</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Access to FamilyVault Certified Experts™</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Email & chat support</td>
                  <td className="text-center py-3 text-red-500">✗</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                
                {/* Categories Section */}
                <tr>
                  <td colSpan={4} className="py-6">
                    <h3 className="text-xl font-bold text-[var(--primary-gold)]">Categories</h3>
                  </td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Business</td>
                  <td className="text-center py-3 text-red-500">✗</td>
                  <td className="text-center py-3 text-red-500">✗</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Family IDs</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Finance</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Property</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Passwords</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Insurance</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Taxes</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Legal</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Family resources</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                <tr className="border-b border-gray-800 odd:bg-[#2b2b1f]/20 even:bg-[#0a0a0a]">
                  <td className="py-3 text-[#CCCCCC]">Contacts</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                  <td className="text-center py-3 text-blue-500">✓</td>
                </tr>
                
                {/* Bottom CTA Row */}
                <tr className="border-t-2 border-[var(--dark-accent)]">
                  <td className="py-4"></td>
                  <td className="text-center py-4">
                    <a href="/signup" className="bg-[#FFD700] hover:bg-[#FFD700]/90 hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] text-black px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300">Get started</a>
                  </td>
                  <td className="text-center py-4">
                    <a href="/signup" className="bg-[#FFD700] hover:bg-[#FFD700]/90 hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] text-black px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300">Get started</a>
                  </td>
                  <td className="text-center py-4">
                    <a href="/signup" className="bg-[#FFD700] hover:bg-[#FFD700]/90 hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] text-black px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300">Get started</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* What's Included in Every Plan */}
      <section className="bg-gradient-to-b from-[#121212] to-[#0a0a0a] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              What's included in every plan
            </h2>
            <p className="text-xl text-[#CCCCCC]">
              Tailored tools for secure, effortless organization — yes, even with the free plan.
            </p>
          </div>

          {/* Security Features */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-[var(--primary-gold)] mb-8 text-center">Security</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 border-2 border-[#FFD700] rounded-lg flex items-center justify-center mx-auto mb-4 bg-transparent">
                  <span className="text-[#FFD700] text-xl">🔐</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Multi-factor authentication</h4>
                <p className="text-[#CCCCCC] text-sm">FamilyVault's multi-factor authentication protects against unauthorized access.</p>
              </div>
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl">🔒</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Tokenization</h4>
                <p className="text-[#CCCCCC] text-sm">Sensitive data is replaced with a secure code, keeping it protected and separate.</p>
              </div>
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl">👁️</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Threat detection</h4>
                <p className="text-[#CCCCCC] text-sm">FamilyVault uses behavior analytics to detect anomalies and unusual activities.</p>
              </div>
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 border-2 border-[#FFD700] rounded-lg flex items-center justify-center mx-auto mb-4 bg-transparent">
                  <span className="text-[#FFD700] text-xl">🔐</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Data encryption</h4>
                <p className="text-[#CCCCCC] text-sm">FamilyVault data is encrypted in transit and at rest using 256-bit AES encryption keys.</p>
              </div>
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl">👆</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Biometric authentication</h4>
                <p className="text-[#CCCCCC] text-sm">Facial recognition and fingerprint authentication are available on all platforms.</p>
              </div>
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl">🏢</span>
                </div>
                <h4 className="font-semibold text-white mb-3">24/7 on-site security</h4>
                <p className="text-[#CCCCCC] text-sm">Data centers have around the clock security, strict access controls, and ID requirements.</p>
              </div>
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl">🛡️</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Disaster ready</h4>
                <p className="text-[#CCCCCC] text-sm">Encrypted data is backed up across servers to prevent loss from fires or outages.</p>
              </div>
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl">🚨</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Stolen-password alerts</h4>
                <p className="text-[#CCCCCC] text-sm">FamilyVault scans passwords for breaches and prompts you to update compromised ones.</p>
              </div>
            </div>
          </div>

          {/* Organization Features */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-[var(--primary-gold)] mb-8 text-center">Organization</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 border-2 border-[#FFD700] rounded-lg flex items-center justify-center mx-auto mb-4 bg-transparent">
                  <span className="text-[#FFD700] text-xl">📖</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Personalized guides</h4>
                <p className="text-[#CCCCCC] text-sm">Get started quickly with helpful in-app tools designed to keep you organized.</p>
              </div>
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-xl">👥</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Collaboration</h4>
                <p className="text-[#CCCCCC] text-sm">Share access with loved ones and professionals to stay informed and work together.</p>
              </div>
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-xl">📄</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Documents</h4>
                <p className="text-[#CCCCCC] text-sm">Easily organize documents by category and item for quick access and sharing.</p>
              </div>
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-xl">📱</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Desktop and mobile</h4>
                <p className="text-[#CCCCCC] text-sm">Access FamilyVault on desktop or via our iOS and Android apps — wherever you happen to be.</p>
              </div>
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-xl">⏰</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Reminders and to-do's</h4>
                <p className="text-[#CCCCCC] text-sm">Stay on top of tasks with reminders and to-do's to keep your family organized.</p>
              </div>
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-xl">🔗</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Secure sharing</h4>
                <p className="text-[#CCCCCC] text-sm">Share documents safely with secure links that protect your family's information.</p>
              </div>
            </div>
          </div>

          {/* Automation Features */}
          <div>
            <h3 className="text-2xl font-bold text-[var(--primary-gold)] mb-8 text-center">Automation</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 border-2 border-[#FFD700] rounded-lg flex items-center justify-center mx-auto mb-4 bg-transparent">
                  <span className="text-[#FFD700] text-xl">📊</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Document analysis</h4>
                <p className="text-[#CCCCCC] text-sm">Autopilot analyzes hundreds of document types — powered by AI.</p>
              </div>
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-xl">🔍</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Detail extraction</h4>
                <p className="text-[#CCCCCC] text-sm">Key information from your documents is extracted to ensure you have everything.</p>
              </div>
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-xl">✏️</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Data autofilling</h4>
                <p className="text-[#CCCCCC] text-sm">Easily complete your account with details collected from documents.</p>
              </div>
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-xl">📁</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Filing recommendations</h4>
                <p className="text-[#CCCCCC] text-sm">Quickly organize your life with suggested destinations for your files.</p>
              </div>
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-xl">📝</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Document summaries</h4>
                <p className="text-[#CCCCCC] text-sm">Get searchable, shareable summaries to understand your documents and images fast.</p>
              </div>
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-xl">🏷️</span>
                </div>
                <h4 className="font-semibold text-white mb-3">File name suggestions</h4>
                <p className="text-[#CCCCCC] text-sm">Turn messy file names into clear, searchable titles for quick and easy retrieval.</p>
              </div>
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-xl">💎</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Data enrichment</h4>
                <p className="text-[#CCCCCC] text-sm">Enhance your records with added details like insurer info, bank data, and much more.</p>
              </div>
              <div className="gold-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-xl">🤖</span>
                </div>
                <h4 className="font-semibold text-white mb-3">Smart categorization</h4>
                <p className="text-[#CCCCCC] text-sm">FamilyVault automatically organizes your documents using intelligent categorization.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Here's how we keep things organized */}
      <section className="bg-gradient-to-b from-[#0a0a0a] to-[#121212] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-16">
            Here's how we keep things organized
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            {/* Category */}
            <div className="text-center">
              <div className="bg-[#121212] border border-[#FFD700]/30 rounded-xl p-8 shadow-lg mb-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-[#CCCCCC]">Finance</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-[#CCCCCC]">Property</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-[#CCCCCC]">Insurance</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-[#CCCCCC]">Taxes</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-2">Category</h3>
              <p className="text-[#CCCCCC]">FamilyVault's digital vault is divided into sections like Finance, Family IDs, or Insurance.</p>
            </div>

            {/* Item */}
            <div className="text-center">
              <div className="bg-[#121212] border border-[#FFD700]/30 rounded-xl p-8 shadow-lg mb-6">
                <div className="bg-[#1a1a1a] border border-[#FFD700]/20 rounded-lg p-4">
                  <div className="text-sm text-white mb-2">David's New York Life Insurance</div>
                  <div className="text-xs text-[#CCCCCC]">Jane Reynolds</div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-2">Item</h3>
              <p className="text-[#CCCCCC]">This is an entry in a category, like a person, an insurance policy, or a financial account. Silver and Gold plans allow unlimited items.</p>
            </div>

            {/* Details */}
            <div className="text-center">
              <div className="bg-[#121212] border border-[#FFD700]/30 rounded-xl p-8 shadow-lg mb-6">
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-[#CCCCCC] text-sm">Policy Name:</span>
                    <span className="text-white text-sm font-medium">Cottage Life Insurance</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#CCCCCC] text-sm">Policy Number:</span>
                    <span className="text-white text-sm font-medium">347-485-1754-918484</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#CCCCCC] text-sm">Issue Date:</span>
                    <span className="text-white text-sm font-medium">09/15/2022</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#CCCCCC] text-sm">Next Date:</span>
                    <span className="text-white text-sm font-medium">03-09-2024</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-2">Details</h3>
              <p className="text-[#CCCCCC]">These are specific elements within an item, like a policy number, with no limit to how many you can store.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Families Love FamilyVault */}
      <section className="bg-gradient-to-b from-[#121212] to-[#0a0a0a] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-16">
            Families Love FamilyVault
          </h2>
          
          <div className="flex justify-center space-x-4 overflow-hidden">
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <div className="w-full h-full bg-[#121212] border border-[#FFD700]/30 flex items-center justify-center">
                <span className="text-[#FFD700] text-sm">Family Photo</span>
              </div>
            </div>
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <div className="w-full h-full bg-[#121212] border border-[#FFD700]/30 flex items-center justify-center">
                <span className="text-[#FFD700] text-sm">Family Photo</span>
              </div>
            </div>
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <div className="w-full h-full bg-[#121212] border border-[#FFD700]/30 flex items-center justify-center">
                <span className="text-[#FFD700] text-sm">Family Photo</span>
              </div>
            </div>
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <div className="w-full h-full bg-[#121212] border border-[#FFD700]/30 flex items-center justify-center">
                <span className="text-[#FFD700] text-sm">Family Photo</span>
              </div>
            </div>
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <div className="w-full h-full bg-[#121212] border border-[#FFD700]/30 flex items-center justify-center">
                <span className="text-[#FFD700] text-sm">Family Photo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-gradient-to-b from-[#0a0a0a] to-[#121212] py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-16">
            Frequently asked questions
          </h2>
          
          <div className="space-y-6">
            <details className="group">
              <summary className="flex justify-between items-center w-full p-6 bg-[#121212] border border-[#FFD700]/20 rounded-lg cursor-pointer hover:bg-[#1a1a1a] transition-colors">
                <span className="text-lg font-medium text-white">How long has FamilyVault been in business?</span>
                <span className="ml-6 flex-shrink-0 text-[#FFD700]">+</span>
              </summary>
              <div className="mt-4 p-6 bg-[#0a0a0a] border-l-4 border-[#FFD700] rounded-lg">
                <p className="text-[#CCCCCC]">
                  FamilyVault has helped thousands of families stay organized and secure since 2020, 
                  ensuring they're prepared for all of life's important moments.
                </p>
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center w-full p-6 bg-[#121212] border border-[#FFD700]/20 rounded-lg cursor-pointer hover:bg-[#1a1a1a] transition-colors">
                <span className="text-lg font-medium text-white">What happens to my information if I stop subscribing to FamilyVault?</span>
                <span className="ml-6 flex-shrink-0 text-[#FFD700]">+</span>
              </summary>
              <div className="mt-4 p-6 bg-[#0a0a0a] border-l-4 border-[#FFD700] rounded-lg">
                <p className="text-[#CCCCCC]">
                  You will be able to securely export your information, keeping your documents safe and accessible.
                </p>
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center w-full p-6 bg-[#121212] border border-[#FFD700]/20 rounded-lg cursor-pointer hover:bg-[#1a1a1a] transition-colors">
                <span className="text-lg font-medium text-white">How does FamilyVault's digital vault compare to other solutions?</span>
                <span className="ml-6 flex-shrink-0 text-[#FFD700]">+</span>
              </summary>
              <div className="mt-4 p-6 bg-[#0a0a0a] border-l-4 border-[#FFD700] rounded-lg">
                <div className="text-[#CCCCCC] space-y-4">
                  <p>
                    We've seen families build DIY solutions to keep track of their important family information using 
                    the analog and digital tools at hand, from a stack of paper on their desk to Excel spreadsheets and more.
                  </p>
                  <p>
                    We tried using these systems and found that all the off-the-shelf solutions fell short in the same areas:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Start with a blank page, which can be debilitating for many.</li>
                    <li>Didn't offer guidance in getting everything set up.</li>
                    <li>Didn't offer automation, meaning you have to do everything manually.</li>
                    <li>Didn't help you keep everything current.</li>
                    <li>Are dumb containers and didn't know anything about your information and couldn't offer value around that information.</li>
                    <li>Had insufficient security or only offered advanced security for an additional fee.</li>
                    <li>Didn't offer service to help folks who need it.</li>
                    <li>Didn't handle the temporal nature of sharing estate information.</li>
                  </ol>
                  <p>
                    The Family Operating System® solves all of these and more. Start your own Family Operating System® today.
                  </p>
                </div>
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center w-full p-6 bg-[#121212] border border-[#FFD700]/20 rounded-lg cursor-pointer hover:bg-[#1a1a1a] transition-colors">
                <span className="text-lg font-medium text-white">Is FamilyVault secure?</span>
                <span className="ml-6 flex-shrink-0 text-[#FFD700]">+</span>
              </summary>
              <div className="mt-4 p-6 bg-[#0a0a0a] border-l-4 border-[#FFD700] rounded-lg">
                <p className="text-[#CCCCCC]">
                  FamilyVault deploys world-class security measures – data encryption, multi-factor authentication, 
                  tokenization, threat detection, stolen-password alerts, and biometric authentication – to ensure your 
                  family's information remains private and protected. In fact, your information is safer with FamilyVault 
                  than in a filing cabinet at home, where documents may be vulnerable to loss, damage, or theft.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}