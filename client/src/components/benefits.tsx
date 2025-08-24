import { Play } from "lucide-react";

const benefits = [
  {
    title: "Support for your family in case something happens to you",
    description: "98% of FamilyVault members are the primary \"operational\" manager in the family."
  },
  {
    title: "Stress relief from managing multiple systems",
    description: "71% of members juggled 3+ paper and digital management systems before joining FamilyVault."
  },
  {
    title: "Smooth estate transitions for families with aging parents",
    description: "23% of members worry about managing their parents' caregiving and estates as they get older."
  }
];

export default function Benefits() {
  return (
    <section className="bg-[#111111] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Video */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Home office organization scene with filing systems and digital tools" 
              className="rounded-2xl shadow-2xl w-full h-auto" 
            />
            <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center">
              <button 
                data-testid="button-play-video"
                className="cta-button rounded-full p-6"
              >
                <Play className="w-12 h-12 text-black ml-1" />
              </button>
            </div>
            <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg px-3 py-1">
              <span className="text-sm font-medium text-white">See how it works</span>
            </div>
          </div>

          {/* Right Column - Benefits */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
              Life is Easier with FamilyVault
            </h2>
            
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  data-testid={`benefit-${index + 1}`}
                  className="gold-card rounded-xl p-6 shadow-sm hover-lift"
                >
                  <h3 className="font-bold text-white text-lg mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-[#CCCCCC]">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
