import { Check } from "lucide-react";

const leftFeatures = [
  "Passports",
  "Marriage licenses",
  "Driver's licenses",
  "Wills and trusts",
  "Tax records",
  "Powers of attorney"
];

const rightFeatures = [
  "Birth certificates",
  "Medical records",
  "Bank account info",
  "Death certificates",
  "Passwords",
  "And more..."
];

export default function FeatureChecklist() {
  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Secure Everything That Matters
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Left Column Checklist */}
          <div className="space-y-4">
            {leftFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="w-6 h-6 text-green-500" />
                <span className="text-lg text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Center Image */}
          <div className="flex justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500" 
                alt="Family document organization collage showing important papers and certificates" 
                className="rounded-xl w-full h-auto" 
              />
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500 font-medium">Document Collage</p>
              </div>
            </div>
          </div>

          {/* Right Column Checklist */}
          <div className="space-y-4">
            {rightFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="w-6 h-6 text-green-500" />
                <span className="text-lg text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
