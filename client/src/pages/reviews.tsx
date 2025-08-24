import { Star, Play, Quote, Heart, Users, Shield, FileText, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/navbar";

export default function Reviews() {
  const [activeTestimonial, setActiveTestimonial] = useState<number | null>(null);

  const videoTestimonials = [
    {
      id: 1,
      category: "Emergency Readiness",
      quote: "When our basement flooded, I was able to access our insurance documents instantly from my phone. FamilyVault saved us weeks of paperwork reconstruction and thousands in potential delays.",
      author: "Sarah M.",
      memberSince: "Member since 2023",
      thumbnail: "🏠",
      color: "bg-blue-500"
    },
    {
      id: 2,
      category: "Family Coordination",
      quote: "With three kids in different schools and activities, keeping track of medical forms, permission slips, and schedules was chaos. FamilyVault brought order to our family madness.",
      author: "Marcus & Lisa T.",
      memberSince: "Member since 2024",
      thumbnail: "👨‍👩‍👧‍👦",
      color: "bg-green-500"
    },
    {
      id: 3,
      category: "Peace of Mind",
      quote: "After my father passed without any organized records, I promised my family wouldn't face the same struggle. FamilyVault ensures everything is documented and accessible.",
      author: "Jennifer L.",
      memberSince: "Member since 2022",
      thumbnail: "💝",
      color: "bg-purple-500"
    },
    {
      id: 4,
      category: "Digital Organization",
      quote: "We had documents scattered across email, cloud storage, and filing cabinets. FamilyVault consolidated everything into one secure, searchable system that actually makes sense.",
      author: "David K.",
      memberSince: "Member since 2023",
      thumbnail: "📁",
      color: "bg-orange-500"
    },
    {
      id: 5,
      category: "Security & Privacy",
      quote: "Unlike regular cloud storage, FamilyVault was built specifically for sensitive family information. The security features give me confidence that our data is truly protected.",
      author: "Dr. Amanda R.",
      memberSince: "Member since 2022",
      thumbnail: "🔒",
      color: "bg-red-500"
    },
    {
      id: 6,
      category: "Time Savings",
      quote: "Tax season used to take weeks of document hunting. Now everything is organized and ready. FamilyVault has given me my weekends back.",
      author: "Robert C.",
      memberSince: "Member since 2024",
      thumbnail: "⏰",
      color: "bg-indigo-500"
    }
  ];

  const textTestimonials = [
    {
      name: "Michelle K.",
      rating: 5,
      review: "Outstanding customer service and incredibly intuitive design. FamilyVault has transformed how our family manages important documents. The peace of mind is invaluable.",
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
      review: "We've tried other document storage solutions, but FamilyVault is specifically designed for families. The templates and organization tools are exactly what we needed.",
      date: "Oct 22, 2024",
      verified: true
    },
    {
      name: "Dr. Susan M.",
      rating: 5,
      review: "As someone who values both convenience and security, FamilyVault delivers on both fronts. The encryption standards are medical-grade, and the interface is refreshingly simple.",
      date: "Oct 5, 2024",
      verified: true
    },
    {
      name: "Carlos R.",
      rating: 5,
      review: "Moving to a new state was stressful enough. Having all our important documents organized and accessible through FamilyVault made the transition so much smoother.",
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
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Why Families Choose FamilyVault
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Discover how thousands of families use FamilyVault to organize, secure, and share their most important information. 
            Real stories from real families who've transformed their document management.
          </p>
          <button 
            data-testid="button-share-story"
            className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            Share Your Family's Story
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Family Success Stories
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Hear directly from families who've experienced the peace of mind that comes with having their important information organized and secure.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoTestimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <div className={`${testimonial.color} h-48 flex items-center justify-center`}>
                    <div className="text-6xl">{testimonial.thumbnail}</div>
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <button 
                        onClick={() => setActiveTestimonial(testimonial.id)}
                        className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
                        data-testid={`play-testimonial-${testimonial.id}`}
                      >
                        <Play className="w-6 h-6 text-gray-800 ml-1" />
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {testimonial.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-4 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.memberSince}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Text Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Families Are Saying
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied families who have found peace of mind with FamilyVault's secure document management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {textTestimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1 mr-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  {testimonial.verified && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-primary/20 mb-2" />
                  <p className="text-gray-700 leading-relaxed">
                    {testimonial.review}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.date}</p>
                  </div>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Share Your Story CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Your story could inspire another family
          </h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Has FamilyVault made your life easier, safer, or more organized? Share your experience and help other families 
            discover the peace of mind that comes with having their important information secure and accessible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              data-testid="button-share-experience"
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Share Your Experience
            </button>
            <button 
              data-testid="button-start-free-trial"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Start Your Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* Additional Reviews Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                More Family Success Stories
              </h2>
              <p className="text-lg text-gray-600">
                Every family has unique needs, and FamilyVault adapts to help them all stay organized and secure.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-6">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1 mr-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">Elena R. • Dec 2024</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    "As a military family, we move frequently. FamilyVault ensures all our important documents travel with us digitally, 
                    making relocations so much less stressful. No more lost paperwork during moves!"
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1 mr-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">Michael & Janet D. • Nov 2024</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    "We're caring for elderly parents while raising teenagers. FamilyVault helps us manage medical information, 
                    school records, and financial documents for multiple generations in one secure place."
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-6">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1 mr-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">Thomas K. • Oct 2024</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    "The secure sharing feature is incredible. When my wife was traveling and needed our insurance information, 
                    she could access it instantly. No more texting sensitive information or scrambling through files."
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-6">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1 mr-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">Rachel M. • Sep 2024</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
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
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to secure your family's future?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of families who trust FamilyVault to protect and organize their most important information.
          </p>
          <button 
            data-testid="button-get-started-reviews"
            className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Start Your Free Trial Today
          </button>
        </div>
      </section>
    </div>
  );
}