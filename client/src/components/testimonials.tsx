const testimonials = [
  { name: "Catherine A.", location: "CO., Member since '24", initials: "CA", gradient: "from-blue-400 to-purple-500" },
  { name: "Marty J.", location: "Nebraska, Member since '24", initials: "MJ", gradient: "from-green-400 to-blue-500" },
  { name: "Andrea D.", location: "FL., Member since '24", initials: "AD", gradient: "from-pink-400 to-red-500" },
  { name: "Daniel J.", location: "ON., Member since '24", initials: "DJ", gradient: "from-yellow-400 to-orange-500" },
  { name: "Lucy W.", location: "CA., Member since '24", initials: "LW", gradient: "from-indigo-400 to-purple-500" },
  { name: "Mandy T.", location: "PA., Member since '24", initials: "MT", gradient: "from-teal-400 to-blue-500" }
];

export default function Testimonials() {
  return (
    <section className="bg-black py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            What Our Members Say About FamilyVault
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              data-testid={`testimonial-${index + 1}`}
              className="gold-card rounded-2xl p-6 text-center hover-lift"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${testimonial.gradient} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">{testimonial.initials}</span>
              </div>
              <h4 className="font-semibold text-[#D4AF37]">{testimonial.name}</h4>
              <p className="text-sm text-[#CCCCCC]">{testimonial.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
