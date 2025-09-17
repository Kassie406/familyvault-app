import { Star, Play, Quote, Heart, Users, Shield, FileText, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/navbar";
import sarahProfileImage from "@assets/generated_images/Sarah_emergency_readiness_reviewer_headshot_cb2345f9.png";
import marcusLisaProfileImage from "@assets/generated_images/Marcus_Lisa_couple_reviewer_headshot_8a830a92.png";
import jenniferProfileImage from "@assets/generated_images/Jennifer_peace_mind_reviewer_headshot_018be71f.png";
import davidProfileImage from "@assets/generated_images/David_organization_reviewer_headshot_5944238d.png";
import amandaProfileImage from "@assets/generated_images/Amanda_security_reviewer_headshot_89cf17a3.png";
import robertProfileImage from "@assets/generated_images/Robert_time_savings_reviewer_headshot_ee439bb3.png";

export default function Reviews() {
  const [activeTestimonial, setActiveTestimonial] = useState<number | null>(null);

  const videoTestimonials = [
    {
      id: 1,
      category: "Emergency Readiness",
      quote: "When our basement flooded, I was able to access our insurance documents instantly from my phone. FamilyCircle Secure saved us weeks of paperwork reconstruction and thousands in potential delays.",
      author: "Sarah M.",
      memberSince: "Member since 2023",
      profileImage: sarahProfileImage
    },
    {
      id: 2,
      category: "Family Coordination",
      quote: "With three kids in different schools and activities, keeping track of medical forms, permission slips, and schedules was chaos. FamilyCircle Secure brought order to our family madness.",
      author: "Marcus & Lisa T.",
      memberSince: "Member since 2024",
      profileImage: marcusLisaProfileImage
    },
    {
      id: 3,
      category: "Peace of Mind",
      quote: "After my father passed without any organized records, I promised my family wouldn't face the same struggle. FamilyCircle Secure ensures everything is documented and accessible.",
      author: "Jennifer L.",
      memberSince: "Member since 2022",
      profileImage: jenniferProfileImage
    },
    {
      id: 4,
      category: "Digital Organization",
      quote: "We had documents scattered across email, cloud storage, and filing cabinets. FamilyCircle Secure consolidated everything into one secure, searchable system that actually makes sense.",
      author: "David K.",
      memberSince: "Member since 2023",
      profileImage: davidProfileImage
    },
    {
      id: 5,
      category: "Security & Privacy",
      quote: "Unlike regular cloud storage, FamilyCircle Secure was built specifically for sensitive family information. The security features give me confidence that our data is truly protected.",
      author: "Dr. Amanda R.",
      memberSince: "Member since 2022",
      profileImage: amandaProfileImage
    },
    {
      id: 6,
      category: "Time Savings",
      quote: "Tax season used to take weeks of document hunting. Now everything is organized and ready. FamilyCircle Secure has given me my weekends back.",
      author: "Robert C.",
      memberSince: "Member since 2024",
      profileImage: robertProfileImage
    }
  ];

  const textTestimonials = [
    {
      name: "Michelle K.",
      rating: 5,
      review: "Outstanding customer service and incredibly intuitive design. FamilyCircle Secure has transformed how our family manages important documents. The peace of mind is invaluable.",
      date: "Dec 15, 2024",
      verified: true
    },
    {
      name: "James H.",
      rating: 5,
      review: "Finally found a solution that my whole family can use. Even my tech-phobic parents love how simple it is to access their medical records and insurance information.",
      date: "Nov 28, 2024",
      verified: true
    },
    {
      name: "Patricia W.",
      rating: 5,
      review: "The emergency contact feature is brilliant. When my husband was hospitalized, our daughter could instantly access his medical history and insurance details from anywhere.",
      date: "Nov 10, 2024",
      verified: true
    },
    {
      name: "Kevin & Tracy B.",
      rating: 5,
      review: "We've tried other document storage solutions, but FamilyCircle Secure is specifically designed for families. The templates and organization tools are exactly what we needed.",
      date: "Oct 22, 2024",
      verified: true
    },
    {
      name: "Dr. Susan M.",
      rating: 5,
      review: "As someone who values both convenience and security, FamilyCircle Secure delivers on both fronts. The encryption standards are medical-grade, and the interface is refreshingly simple.",
      date: "Oct 5, 2024",
      verified: true
    },
    {
      name: "Carlos R.",
      rating: 5,
      review: "Moving to a new state was stressful enough. Having all our important documents organized and accessible through FamilyCircle Secure made the transition so much smoother.",
      date: "Sep 18, 2024",
      verified: true
    }
  ];

  const stats = [
    { number: "15,000+", label: "Families Protected", icon: Users },
    { number: "250,000+", label: "Documents Secured", icon: FileText },
    { number: "99.9%", label: "Uptime Reliability", icon: CheckCircle },
    { number: "24/7", label: "Emergency Access", icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#121212] to-[#0E0E0E] pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Why Families Choose FamilyCircle Secure
          </h1>
          <p className="text-xl text-[#A5A5A5] mb-8 leading-relaxed max-w-3xl mx-auto">
            Discover how thousands of families use FamilyCircle Secure to organize, secure, and share their most important information. 
            Real stories from real families who've transformed their document management.
          </p>
          <button 
            data-testid="button-share-story"
            className="bg-[#FFD43B] hover:bg-[#E6C140] text-[#0E0E0E] font-semibold px-8 py-4 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:ring-offset-2 focus:ring-offset-[#0E0E0E] min-h-[44px]"
          >
            Share Your Family's Story
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-[#FFD43B]" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-[#A5A5A5] font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-20 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Family Success Stories
          </h2>
          <p className="text-xl text-[#A5A5A5] text-center mb-16 max-w-3xl mx-auto">
            Hear directly from families who've experienced the peace of mind that comes with having their important information organized and secure.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoTestimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-[#151515] border border-[#2A2A2A] rounded-xl overflow-hidden hover:border-[#FFD43B]/30 transition-all group"
              >
                <div className="relative">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={testimonial.profileImage} 
                      alt={`${testimonial.author} profile`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#FFD43B] text-[#0E0E0E] px-3 py-1 rounded-full text-sm font-medium">
                      {testimonial.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#FFD43B] fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-[#A5A5A5] mb-4 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{testimonial.author}</p>
                      <p className="text-sm text-[#A5A5A5]">{testimonial.memberSince}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Text Testimonials */}
      <section className="py-20 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              What Families Are Saying
            </h2>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto">
              Join thousands of satisfied families who have found peace of mind with FamilyCircle Secure's secure document management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {textTestimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-8 hover:border-[#FFD43B]/30 transition-all"
              >
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1 mr-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#FFD43B] fill-current" />
                    ))}
                  </div>
                  {testimonial.verified && (
                    <div className="flex items-center text-[#FFD43B]">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-[#FFD43B]/20 mb-2" />
                  <p className="text-[#A5A5A5] leading-relaxed">
                    {testimonial.review}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-[#A5A5A5]">{testimonial.date}</p>
                  </div>
                  <div className="w-10 h-10 bg-[#FFD43B]/10 border border-[#2A2A2A] rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-[#FFD43B]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Share Your Story CTA */}
      <section className="py-20 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Your story could inspire another family
          </h2>
          <p className="text-xl mb-8 text-[#A5A5A5] leading-relaxed">
            Has FamilyCircle Secure made your life easier, safer, or more organized? Share your experience and help other families 
            discover the peace of mind that comes with having their important information secure and accessible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              data-testid="button-share-experience"
              className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-4 rounded-full hover:bg-[#E6C140] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:ring-offset-2 focus:ring-offset-[#0E0E0E] min-h-[44px]"
            >
              Share Your Experience
            </button>
            <a
              href="/pricing"
              data-testid="button-start-free-trial"
              className="inline-flex items-center justify-center border border-[#FFD43B] text-[#FFD43B] font-semibold px-8 py-4 rounded-full hover:bg-[#FFD43B]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:ring-offset-2 focus:ring-offset-[#0E0E0E] min-h-[44px]"
            >
              Start Your Free Trial
            </a>
          </div>
        </div>
      </section>

      {/* Additional Reviews Section */}
      <section className="py-20 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-2xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                More Family Success Stories
              </h2>
              <p className="text-lg text-[#A5A5A5]">
                Every family has unique needs, and FamilyCircle Secure adapts to help them all stay organized and secure.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="border-l-4 border-[#FFD43B] pl-6">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1 mr-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[#FFD43B] fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-[#A5A5A5]">Elena R. • Dec 2024</span>
                  </div>
                  <p className="text-[#B9B9B9] leading-relaxed">
                    "As a military family, we move frequently. FamilyCircle Secure ensures all our important documents travel with us digitally, 
                    making relocations so much less stressful. No more lost paperwork during moves!"
                  </p>
                </div>

                <div className="border-l-4 border-[#FFD43B] pl-6">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1 mr-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[#FFD43B] fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-[#A5A5A5]">Michael & Janet D. • Nov 2024</span>
                  </div>
                  <p className="text-[#B9B9B9] leading-relaxed">
                    "We're caring for elderly parents while raising teenagers. FamilyCircle Secure helps us manage medical information, 
                    school records, and financial documents for multiple generations in one secure place."
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-[#FFD43B] pl-6">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1 mr-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[#FFD43B] fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-[#A5A5A5]">Thomas K. • Oct 2024</span>
                  </div>
                  <p className="text-[#B9B9B9] leading-relaxed">
                    "The secure sharing feature is incredible. When my wife was traveling and needed our insurance information, 
                    she could access it instantly. No more texting sensitive information or scrambling through files."
                  </p>
                </div>

                <div className="border-l-4 border-[#FFD43B] pl-6">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1 mr-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[#FFD43B] fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-[#A5A5A5]">Rachel M. • Sep 2024</span>
                  </div>
                  <p className="text-[#B9B9B9] leading-relaxed">
                    "The mobile app saved us during a family emergency. When my son was injured at camp, 
                    I could instantly provide his medical history and insurance details to the hospital staff from my phone."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to secure your family's future?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Join thousands of families who trust FamilyCircle Secure to protect and organize their most important information.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-reviews"
            className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-4 rounded-full hover:bg-[#E6C140] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:ring-offset-2 focus:ring-offset-[#0E0E0E] min-h-[44px]"
          >
            Start Your Free Trial Today
          </a>
        </div>
      </section>
    </div>
  );
}