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
    buttonLink: "/contact"
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Header */}
      <section className="bg-black py-16 lg:py-24">
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
      <section className="bg-[#0d0d0d] py-16 lg:py-24">
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
                  className="cta-button w-full inline-block px-6 py-3 rounded-lg font-semibold mb-6"
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

      <Footer />
    </div>
  );
}