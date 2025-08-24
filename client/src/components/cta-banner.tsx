export default function CTABanner() {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Family security scene showing digital protection and safety"
    },
    {
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Family safety scene demonstrating emergency preparedness with digital tools"
    },
    {
      src: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Modern home office organization showing family document management system"
    }
  ];

  return (
    <section className="bg-primary py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {images.map((image, index) => (
            <img 
              key={index}
              src={image.src}
              alt={image.alt}
              className="rounded-2xl w-full h-auto shadow-xl hover-lift" 
            />
          ))}
        </div>

        <p className="text-accent text-lg font-semibold mb-2">Pricing</p>
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
          3 pricing tiers, starting with free
        </h2>
        <a
          href="/pricing"
          data-testid="button-learn-more-pricing"
          className="bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-colors hover-lift inline-block"
        >
          Learn more
        </a>
      </div>
    </section>
  );
}
