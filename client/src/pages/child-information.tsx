import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import soccerKidImage from "@assets/image_1756084550627.png";
import phoneDocumentImage from "@assets/image_1756085339999.png";
import emergencyChecklistImage from "@assets/image_1756091492533.png";
import insuranceCardImage from "@assets/image_1756085656097.png";
import babysitterImage from "@assets/image_1756085729438.png";
import securityImage from "@assets/image_1756085840418.png";
import mobileAppImage from "@assets/image_1756085913047.png";
import expertsImage from "@assets/image_1756086008968.png";
import guideBookImage from "@assets/image_1756086136192.png";
import { 
  FileText, 
  Share2, 
  Lock, 
  Users, 
  Baby,
  Smartphone,
  Shield,
  CheckCircle,
  Star,
  Zap,
  Eye,
  Key,
  Download,
  BookOpen,
  Phone,
  ChevronRight,
  Heart,
  Calendar,
  Activity,
  AlertCircle,
  Pill
} from "lucide-react";

export default function ChildInformation() {
  const childInfoCards = [
    {
      icon: Heart,
      title: "Medical & Allergies",
      description: "Track medications, allergies, and medical history in one secure place.",
      action: "Add medical info"
    },
    {
      icon: FileText,
      title: "School & Aftercare",
      description: "Store enrollment documents, emergency contacts, and school information.",
      action: "Add school details"
    },
    {
      icon: Activity,
      title: "Sports & Activities",
      description: "Keep track of sports forms, activity schedules, and coach contacts.",
      action: "Add activities"
    },
    {
      icon: Shield,
      title: "Emergency Contacts",
      description: "Quick access to pediatrician, family, and emergency contact information.",
      action: "Add contacts"
    },
    {
      icon: Calendar,
      title: "Immunizations",
      description: "Digital vaccination records and upcoming immunization reminders.",
      action: "Add immunizations"
    },
    {
      icon: Users,
      title: "Caregiver Access",
      description: "Safely share essential information with babysitters and family.",
      action: "Manage sharing"
    }
  ];

  const features = [
    {
      icon: FileText,
      title: "Access School & Activity Records",
      description: "You're rushing to complete your child's school registration — only to realize you can't find their birth certificate.",
      detail: "Instantly pull up vaccination records, birth certificates, and enrollment documents.",
      image: phoneDocumentImage,
      imageAlt: "Hands holding phone displaying birth certificate document"
    },
    {
      icon: Share2,
      title: "Share Emergency Information Easily", 
      description: "The babysitter needs emergency contacts, allergy info, and the Wi-Fi password — and you're running late for a concert.",
      detail: "Send allergy and medical details, contact information, and more to caregivers instantly.",
      image: emergencyChecklistImage,
      imageAlt: "Emergency preparedness checklist document showing disaster planning information"
    },
    {
      icon: Lock,
      title: "Store Logins & Important Docs",
      description: "At a last-minute doctor's appointment, the receptionist asks for insurance details — but you don't have your card with you.",
      detail: "Keep insurance cards, school portal credentials, and other key information secure and accessible.",
      image: insuranceCardImage,
      imageAlt: "Hand holding medical insurance card with health policy document in background"
    },
    {
      icon: Users,
      title: "Leave Kids With Caregivers Confidently",
      description: "You're away for the weekend, and the grandparents need access to your child's medical information in case of an emergency.",
      detail: "Ensure babysitters and grandparents have the information they need, from emergency contacts to medical details.",
      image: babysitterImage,
      imageAlt: "Caregiver sitting with two young children, showing confident childcare"
    }
  ];

  const checklistItems = [
    "Secure sharing with caregivers",
    "Document reminders", 
    "On-the-go access",
    "Medical summary ready"
  ];

  const testimonials = [
    { 
      name: "Sarah M.", 
      title: "Daughter & Caregiver", 
      rating: 5, 
      quote: "FamilyVault helped me organize all of Mom's medical information in one secure place.",
      image: null
    },
    { 
      name: "David L.", 
      title: "Son & Financial POA", 
      rating: 5, 
      quote: "Managing Dad's finances became so much easier with everything organized digitally.",
      image: null
    },
    { 
      name: "Maria C.", 
      title: "Healthcare Advocate", 
      rating: 5, 
      quote: "Having quick access to medical directives during emergencies was invaluable.",
      image: null
    }
  ];

  const bottomFeatures = [
    {
      icon: Shield,
      title: "Back Up Your Data Easily",
      description: "Automatic cloud backup keeps everything safe",
      image: securityImage,
      imageAlt: "Digital security visualization with lock symbol and circuit board"
    },
    {
      icon: Smartphone,
      title: "Use FamilyVault on the Go", 
      description: "Access your information anywhere with our mobile app",
      image: mobileAppImage,
      imageAlt: "Mobile app interface showing browse screen with family documents and categories"
    },
    {
      icon: Phone,
      title: "Connect With an Expert",
      description: "Get personalized help organizing your family's documents",
      image: expertsImage,
      imageAlt: "Chalkboard with Ask the Experts text surrounded by light bulb illustrations"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F3F4F6]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16" style={{paddingBottom: '50px'}}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 text-[#D4AF37] font-medium bg-[rgba(212,175,55,0.08)] px-3 py-1 rounded-full border border-[rgba(212,175,55,0.25)]">
                👶 Child Information
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#F3F4F6] tracking-tight">
                FamilyVault for Organizing Your Child's Information
              </h1>
              <p className="text-[#D1D5DB] max-w-[65ch] text-lg">
                Keep your child's important info secure, private, and accessible — ready for school, sports, a babysitter, or camp.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="/signup"
                  data-testid="button-get-started-free"
                  className="bg-[#D4AF37] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#C7A233] transition-colors min-h-[44px] flex items-center"
                >
                  Get started free
                </a>
                <a 
                  href="/features"
                  data-testid="link-see-features"
                  className="text-[#D1D5DB] hover:text-[#F3F4F6] underline underline-offset-4 min-h-[44px] flex items-center"
                >
                  See what's included →
                </a>
              </div>
            </div>
            <div className="overflow-hidden border border-[rgba(212,175,55,0.35)] bg-[#141414] h-72 md:h-[22rem]">
              <img 
                src={soccerKidImage} 
                alt="Child in soccer jersey with soccer ball" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Child Information Cards */}
      <section className="bg-[#141414]" style={{paddingTop: '50px', paddingBottom: '80px'}}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4" style={{color: '#D4AF37', fontWeight: '700'}}>
              Everything Your Child Needs, Organized
            </h2>
            <p className="text-[#D1D5DB] text-lg max-w-2xl mx-auto">
              From medical records to school forms, keep all your child's important information secure and easily accessible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {childInfoCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div 
                  key={index}
                  className="bg-[#141414] rounded-xl p-6 border border-[rgba(212,175,55,0.2)] transition-all duration-300 cursor-pointer"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '1px solid #D4AF37';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(212, 175, 55, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(212,175,55,0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="w-12 h-12 bg-[rgba(212,175,55,0.1)] rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#F3F4F6] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-[#D1D5DB] mb-4">
                    {card.description}
                  </p>
                  <a 
                    href="#"
                    data-testid={`link-${card.action.replace(/\s+/g, '-').toLowerCase()}`}
                    className="text-[#D4AF37] hover:text-[#C7A233] font-medium inline-flex items-center min-h-[44px]"
                  >
                    {card.action} →
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Checklist Feature Strip */}
      <section className="py-12 bg-[#0B0B0B]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {checklistItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
                <span className="text-[#D1D5DB] font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="rounded-xl overflow-hidden border border-[rgba(212,175,55,0.25)] bg-[#141414] h-80">
                      <img 
                        src={feature.image}
                        alt={feature.imageAlt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="w-12 h-12 bg-[rgba(212,175,55,0.1)] rounded-lg flex items-center justify-center mb-6">
                      <IconComponent className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#F3F4F6] mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-[#9CA3AF] mb-4 italic text-lg">
                      {feature.description}
                    </p>
                    <p className="text-[#D1D5DB] font-medium text-lg">
                      {feature.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F3F4F6] mb-4">
              What Our Members Say About FamilyVault
            </h2>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#1a1a1a] border border-[#FFD700]/20 rounded-xl p-6 shadow-md min-w-[300px] snap-start text-center flex-shrink-0">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#FFD700] fill-current" />
                  ))}
                </div>
                <p className="text-[#D1D5DB] italic mb-6 text-lg">"{testimonial.quote}"</p>
                {testimonial.image ? (
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-[#FFD700] overflow-hidden">
                    <img 
                      src={testimonial.image} 
                      alt={`${testimonial.name} profile photo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#D4AF37] rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-[#FFD700]">
                    <span className="text-black text-xl font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                )}
                <div className="font-semibold text-lg text-[#F3F4F6]">{testimonial.name}</div>
                <div className="text-sm text-[#FFD700] font-medium">{testimonial.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet FamilyVault */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl mb-6" style={{color: '#D4AF37', fontWeight: '700'}}>
            Meet FamilyVault — Your Life, Organized
          </h2>
          <p className="text-[#D1D5DB] text-lg mb-8 max-w-3xl mx-auto">
            From travel and finances to emergency planning, FamilyVault keeps your key information secure, organized, and within reach so you can focus on what matters.
          </p>
          <a
            href="/signup"
            data-testid="button-get-started-cta"
            className="bg-[#D4AF37] hover:bg-[#C7A233] text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block min-h-[44px]"
          >
            Get started free
          </a>
        </div>
      </section>

      {/* Bottom Features */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {bottomFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="rounded-xl overflow-hidden border border-[rgba(212,175,55,0.25)] bg-[#141414] h-48 flex items-center justify-center mb-6">
                    <img 
                      src={feature.image}
                      alt={feature.imageAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-[#F3F4F6] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#D1D5DB]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-6" style={{color: '#D4AF37', fontWeight: '700'}}>
              Your Data Is Always Protected
            </h2>
            <p className="text-[#D1D5DB] text-lg max-w-3xl mx-auto">
              Your sensitive information stays private and secure with advanced security and compliance practices.
            </p>
            <div className="mt-8">
              <a
                href="/security"
                className="text-[#D4AF37] hover:text-[#C7A233] font-medium inline-flex items-center min-h-[44px]"
              >
                About our security
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Multi-factor authentication", description: "Secure your account with two-step login protection" },
              { icon: Eye, title: "Threat detection", description: "24/7 monitoring proactively guards against threats" },
              { icon: Key, title: "Tokenization", description: "Replaces sensitive data with secure tokens for protection" },
              { icon: Lock, title: "Data encryption", description: "Your data is securely encrypted both stored and in transit" },
              { icon: Zap, title: "Stolen password alerts", description: "Get notified instantly if your password is compromised" },
              { icon: Baby, title: "Biometric authentication", description: "Safe, instant access with fingerprint or face ID" }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start">
                  <div className="w-10 h-10 bg-[rgba(212,175,55,0.1)] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#F3F4F6] mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#D1D5DB]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compliance Badges */}
          <div className="mt-16 text-center">
            <div className="flex justify-center items-center space-x-6 opacity-60">
              {["EU GDPR", "SOC 2 TYPE II", "SOC 3", "HIPAA", "CCPA"].map((badge, index) => (
                <div key={index} className="text-xs font-semibold text-[#9CA3AF] px-3 py-1 border border-[rgba(212,175,55,0.2)] rounded">
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Essential Resources */}
      <section className="py-20 bg-[#0B0B0B]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4" style={{color: '#D4AF37', fontWeight: '700'}}>
              Essential Resources: Your Child's Info, All in One Place
            </h2>
            <p className="text-[#D1D5DB] text-lg">
              Explore expert advice on the important information every parent should have on hand.
            </p>
          </div>

          {/* Featured Guide */}
          <div className="bg-[#141414] rounded-2xl p-8 lg:p-12 mb-16 border border-[rgba(212,175,55,0.2)]">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <div className="w-48 h-64 rounded-xl overflow-hidden border border-[rgba(212,175,55,0.25)]">
                  <img 
                    src={guideBookImage}
                    alt="Wooden letterpress blocks spelling GUIDE BOOK"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#D4AF37] mb-2">FEATURED GUIDE</div>
                <h3 className="text-2xl font-bold text-[#F3F4F6] mb-4">
                  The Ultimate Guide for Organizing Your Child's Information
                </h3>
                <p className="text-[#D1D5DB] mb-6">
                  Keep your child's medical info, emergency contacts, and key records in one place. This downloadable guide makes it easy to stay prepared for school, caregivers, travel, and more.
                </p>
                <button
                  data-testid="button-download-guide"
                  className="font-semibold transition-colors min-h-[44px] rounded-lg"
                  style={{
                    background: '#D4AF37',
                    color: '#000',
                    padding: '12px 24px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#B8962E';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#D4AF37';
                    e.currentTarget.style.color = '#000';
                  }}
                >
                  ⬇ Download
                </button>
              </div>
            </div>
          </div>

          {/* Articles Horizontal Scroll */}
          <div className="flex overflow-x-auto gap-6 pb-4">
            {[
              {
                title: "Helping Elderly Parents: The Complete Guide",
                description: "Essential steps for navigating the complexities of elder care",
                icon: BookOpen
              },
              {
                title: "Should Elderly Parents Sign Over Their House? Pros and Cons",
                description: "Important legal and financial considerations for property transfers",
                icon: Heart
              }
            ].map((article, index) => {
              const IconComponent = article.icon;
              return (
                <div key={index} className="bg-[#141414] rounded-lg p-6 border border-[rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.35)] transition-colors min-w-[320px] flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#F3F4F6] mb-2">
                    {article.title}
                  </h3>
                  <p className="text-[#D1D5DB] mb-4">
                    {article.description}
                  </p>
                  <a 
                    href="#"
                    data-testid={`link-read-article-${index + 1}`}
                    className="text-[#D4AF37] hover:text-[#C7A233] font-medium inline-flex items-center min-h-[44px]"
                  >
                    Read article →
                  </a>
                </div>
              );
            })}
          </div>

          {/* Checklists */}
          <div className="mt-16">
            <h3 className="text-xl mb-8" style={{color: '#D4AF37', fontWeight: '700'}}>Checklists</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Checklist: Grandparents' Guide to Watching the Grandkid",
                "What the Babysitter Needs to Know"
              ].map((checklist, index) => (
                <div key={index} className="bg-[#141414] rounded-lg p-6 border border-[rgba(212,175,55,0.2)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-[#F3F4F6] mb-2">
                        {checklist}
                      </h4>
                      <button
                        data-testid={`button-download-${index}`}
                        className="font-medium inline-flex items-center min-h-[44px] rounded transition-colors"
                        style={{
                          background: '#D4AF37',
                          color: '#000',
                          padding: '8px 14px',
                          borderRadius: '6px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#B8962E';
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#D4AF37';
                          e.currentTarget.style.color = '#000';
                        }}
                      >
                        ⬇ Download
                        <Download className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                    <CheckCircle className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bar */}
      <section className="py-16 bg-gradient-to-r from-transparent to-[rgba(212,175,55,0.08)] border-t border-[rgba(212,175,55,0.25)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl mb-4" style={{color: '#D4AF37', fontWeight: '700'}}>
            Have everything ready for school, sports, or camp in minutes.
          </h2>
          <p className="text-[#D1D5DB] mb-8 text-lg">
            Start organizing your child's information today with FamilyVault.
          </p>
          <a
            href="/signup"
            data-testid="button-final-cta"
            className="font-semibold text-lg transition-colors inline-block min-h-[44px] rounded-lg"
            style={{
              background: '#D4AF37',
              color: '#000',
              padding: '14px 28px',
              fontSize: '18px',
              border: '2px solid #D4AF37',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#D4AF37';
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#D4AF37';
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Get started free
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}