import familyOrganizingImage from "@assets/generated_images/Family_organizing_documents_together_f055f61d.png";

const benefits = [
  {
    title: "Support for your family in case something happens to you",
    description: "98% of FamilyCircle Secure members are the primary \"operational\" manager in the family."
  },
  {
    title: "Stress relief from managing multiple systems",
    description: "71% of members juggled 3+ paper and digital management systems before joining FamilyCircle Secure."
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
              src={familyOrganizingImage} 
              alt="Family working together to organize important documents and family information" 
              className="rounded-2xl shadow-2xl w-full h-auto" 
            />

          </div>

          {/* Right Column - Benefits */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
              Life is Easier with FamilyCircle Secure
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
