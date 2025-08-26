import { Check } from "lucide-react";

const pricingPlans = [
  {
    name: "Free",
    subtitle: "For families starting to organize for neurodivergence",
    price: "$0",
    popular: false,
    features: [
      "Advanced security",
      "12 items",
      "50GB",
      "Autopilot™ by FamilyVault (beta)",
      "Tailored onboarding",
      "Unlimited collaborators"
    ],
    buttonText: "Get started",
    buttonLink: "/signup"
  },
  {
    name: "Silver", 
    subtitle: "Build a comprehensive organization plan",
    price: "$10",
    popular: true,
    features: [
      "Everything in Free plus:",
      "Unlimited items",
      "Autopilot™ by FamilyVault",
      "Liability support",
      "Priority customer expert",
      "The FamilyVault Marketplace"
    ],
    buttonText: "Get started",
    buttonLink: "/signup"
  },
  {
    name: "Gold",
    subtitle: "Organize your entire business and financial future", 
    price: "$20",
    popular: false,
    features: [
      "Everything in Silver plus:",
      "Business information",
      "Organization (LLC, S Corp, S Corp, INC, etc.)",
      "Entity relationship mapping",
      "Friendly expert support",
      "And more..."
    ],
    buttonText: "Get started",
    buttonLink: "/signup"
  }
];

export default function CTABanner() {

  return (
    <section className="bg-[#0E0E0E] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[#D4AF37] text-lg font-semibold mb-2">Pricing</p>
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12">
          3 pricing tiers, starting with free
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`gold-card rounded-2xl p-8 text-center hover-lift relative flex flex-col h-full ${
                plan.popular ? 'ring-2 ring-[#D4AF37]' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#D4AF37] text-black px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-[#D4AF37] mb-2">{plan.name}</h3>
                <p className="text-[#CCCCCC] mb-6">{plan.subtitle}</p>
                
                <div className="mb-6">
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{plan.price}</div>
                </div>
              </div>
              
              <div className="mt-auto">
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
                      <Check className="w-5 h-5 text-[#D4AF37] mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-[#CCCCCC]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-[#CCCCCC] text-sm mb-4">
            30-day money-back guarantee | We support first responders with a hero discount.
          </p>
        </div>
      </div>
    </section>
  );
}
