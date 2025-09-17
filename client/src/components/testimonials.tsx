import catherinePhoto from "@assets/generated_images/Catherine_profile_photo_d7af5b8b.png";
import martyPhoto from "@assets/generated_images/Marty_profile_photo_c8d00fe7.png";
import andreaPhoto from "@assets/generated_images/Andrea_profile_photo_91f6e4fc.png";
import danielPhoto from "@assets/generated_images/Daniel_profile_photo_8c04c7af.png";
import lucyPhoto from "@assets/generated_images/Lucy_profile_photo_57bcaeff.png";
import mandyPhoto from "@assets/generated_images/Mandy_profile_photo_4a10994a.png";

const testimonials = [
  { name: "Catherine A.", location: "CO., Member since '24", photo: catherinePhoto },
  { name: "Marty J.", location: "Nebraska, Member since '24", photo: martyPhoto },
  { name: "Andrea D.", location: "FL., Member since '24", photo: andreaPhoto },
  { name: "Daniel J.", location: "ON., Member since '24", photo: danielPhoto },
  { name: "Lucy W.", location: "CA., Member since '24", photo: lucyPhoto },
  { name: "Mandy T.", location: "PA., Member since '24", photo: mandyPhoto }
];

export default function Testimonials() {
  return (
    <section className="bg-black py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            What Our Members Say About FamilyCircle Secure
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              data-testid={`testimonial-${index + 1}`}
              className="gold-card rounded-2xl p-6 text-center hover-lift"
            >
              <img 
                src={testimonial.photo} 
                alt={`${testimonial.name} profile photo`}
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
              />
              <h4 className="font-semibold text-[#D4AF37]">{testimonial.name}</h4>
              <p className="text-sm text-[#CCCCCC]">{testimonial.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
