import { Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Organize all of life's details, quickly and effortlessly
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              FamilyVault safeguards your family's important information in one place, ensuring you're prepared for anything that may come your way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href="/signup"
                data-testid="button-get-started-hero"
                className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors hover-lift text-center"
              >
                Get Started Free
              </a>
              <button 
                data-testid="button-see-how-it-works"
                className="border-2 border-gray-300 hover:border-primary text-gray-700 hover:text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-colors hover-lift"
              >
                See How It Works
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-8">
              <em>No credit card required. Upgrade anytime with a 30-day money-back guarantee.</em>
            </p>
            
            {/* Trust Indicators */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">Trustpilot</span>
              </div>
              <div className="text-sm text-gray-600">Featured in Fast Company</div>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Professional family planning workspace with organized documents and laptop" 
              className="rounded-2xl shadow-2xl w-full h-auto" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
