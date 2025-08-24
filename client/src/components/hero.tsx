import { Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-black relative overflow-hidden py-16 lg:py-24">
      {/* Gold gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-yellow-500/20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6 text-center">
              Protect Your Family's Legacy
              <span className="block border-b-2 border-yellow-500 pb-2 inline-block">in One Vault</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed text-center">
              All your family's important details, preserved and always within reach.
            </p>
            <div className="flex justify-center mb-8">
              <a
                href="/signup"
                data-testid="button-get-started-hero"
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors hover-lift text-center"
              >
                Get Started Free
              </a>
            </div>
            <p className="text-sm text-gray-400 mb-8 text-center">
              <em>No credit card required. Upgrade anytime with a 30-day money-back guarantee.</em>
            </p>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-300">Trustpilot</span>
              </div>
              <div className="text-sm text-gray-300">Featured in Fast Company</div>
            </div>
          </div>

          {/* Right Column - Laptop Mockup */}
          <div className="relative">
            {/* Laptop Frame */}
            <div className="relative bg-gray-800 rounded-t-2xl p-2 shadow-2xl">
              {/* Screen */}
              <div className="bg-gray-900 rounded-lg overflow-hidden relative">
                {/* Browser bar */}
                <div className="bg-gray-700 px-4 py-2 flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 bg-gray-600 rounded px-3 py-1 text-xs text-gray-300">
                    familyvault.com
                  </div>
                </div>
                
                {/* Dashboard mockup */}
                <div className="p-6 min-h-80 bg-gradient-to-br from-gray-900 to-gray-800">
                  {/* Header with gold accent */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white font-bold text-lg">Family Dashboard</h2>
                    <div className="w-8 h-8 bg-yellow-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Cards with gold highlights */}
                  <div className="space-y-4">
                    <div className="bg-gray-800 border-l-4 border-yellow-500 rounded p-4 shadow-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-pulse"></div>
                        <span className="text-gray-300 text-sm">Important Documents</span>
                      </div>
                    </div>
                    <div className="bg-gray-800 border-l-4 border-yellow-500 rounded p-4 shadow-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-pulse"></div>
                        <span className="text-gray-300 text-sm">Emergency Contacts</span>
                      </div>
                    </div>
                    <div className="bg-gray-800 border-l-4 border-yellow-500 rounded p-4 shadow-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-pulse"></div>
                        <span className="text-gray-300 text-sm">Medical Information</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Glowing gold accent at bottom */}
                  <div className="absolute bottom-4 right-4">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full opacity-20 animate-ping"></div>
                    <div className="absolute top-3 left-3 w-6 h-6 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Laptop base */}
            <div className="bg-gray-700 h-4 rounded-b-2xl mx-2"></div>
            
            {/* Gold glow effect */}
            <div className="absolute inset-0 bg-yellow-500/10 blur-xl rounded-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
