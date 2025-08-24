const features = [
  {
    title: "Get organized in minutes, not hours",
    description: "Autopilot analyzes your documents instantly, offering key insights and searchable summaries that help you stay organized effortlessly",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    alt: "AI document analysis showing organized family paperwork with digital insights"
  },
  {
    title: "Share information your way",
    description: "Define your network of family members and trusted advisors, ensuring everyone has the right level of fine-grained access",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    alt: "Digital family access control showing secure sharing interface"
  },
  {
    title: "Back up your data easily",
    description: "Export or print documents from FamilyVault whenever you need",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    alt: "Cloud backup system showing document export and printing options"
  },
  {
    title: "Use FamilyVault on the go",
    description: "Access and share important information from anywhere",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    alt: "Mobile device showing FamilyVault app with document access interface"
  },
  {
    title: "Reminders save money, time",
    description: "Avoid late fees, other extra charges, and costs to your credit",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    alt: "Digital calendar and reminder system for family financial management"
  }
];

export default function Features() {
  return (
    <section className="bg-black py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Rule at the Business of Life
          </h2>
        </div>

        <div className="space-y-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              data-testid={`feature-${index + 1}`}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-[#CCCCCC] mb-6">
                  {feature.description}
                </p>
              </div>
              <div className={`bg-black border border-[#D4AF37] rounded-2xl p-8 flex items-center justify-center ${
                index % 2 === 1 ? 'lg:order-1' : ''
              }`}>
                <img 
                  src={feature.image}
                  alt={feature.alt}
                  className="rounded-xl w-full h-auto"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
