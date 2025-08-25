import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import soccerKidImage from "@assets/image_1756084550627.png";
import phoneDocumentImage from "@assets/image_1756085339999.png";
import wifiPhoneImage from "@assets/image_1756085497967.png";
import insuranceCardImage from "@assets/image_1756085656097.png";
import babysitterImage from "@assets/image_1756085729438.png";
import securityImage from "@assets/image_1756085840418.png";
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
  ChevronRight
} from "lucide-react";

export default function ChildInformation() {
  const features = [
    {
      icon: FileText,
      title: "Access School & Activity Records",
      description: "You're rushing to complete your child's school registration — only to realize you can't find their birth certificate.",
      detail: "Instantly pull up vaccination records, birth certificates, and enrollment documents."
    },
    {
      icon: Share2,
      title: "Share Emergency Information Easily",
      description: "The babysitter needs emergency contacts, allergy info, and the Wi-Fi password — and you're running late for a concert.",
      detail: "Send allergy and medical details, contact information, and more to caregivers instantly."
    },
    {
      icon: Lock,
      title: "Store Logins & Important Docs",
      description: "At a last-minute doctor's appointment, the receptionist asks for insurance details — but you don't have your card with you.",
      detail: "Keep insurance cards, school portal credentials, and other key information secure and accessible."
    },
    {
      icon: Users,
      title: "Leave Kids With Caregivers Confidently", 
      description: "You're away for the weekend, and the grandparents need access to your child's medical information in case of an emergency.",
      detail: "Ensure babysitters and grandparents have the information they need, from emergency contacts to medical details."
    }
  ];

  const bottomFeatures = [
    {
      icon: Shield,
      title: "Back Up Your Data Easily",
      description: "Automatic cloud backup keeps everything safe"
    },
    {
      icon: Smartphone, 
      title: "Use FamilyVault on the Go",
      description: "Access your information anywhere with our mobile app"
    },
    {
      icon: Phone,
      title: "Connect With an Expert",
      description: "Get personalized help organizing your family's documents"
    }
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: "Multi-factor authentication", 
      description: "Secure your account with two-step login protection"
    },
    {
      icon: Eye,
      title: "Threat detection",
      description: "24/7 monitoring proactively guards against threats" 
    },
    {
      icon: Key,
      title: "Tokenization",
      description: "Replaces sensitive data with secure tokens for protection"
    },
    {
      icon: Lock,
      title: "Data encryption", 
      description: "Your data is securely encrypted both stored and in transit"
    },
    {
      icon: Zap,
      title: "Stolen password alerts",
      description: "Get notified instantly if your password is compromised"
    },
    {
      icon: Baby,
      title: "Biometric authentication",
      description: "Safe, instant access with fingerprint or face ID"
    }
  ];

  const resources = [
    {
      type: "Guide",
      title: "The Ultimate Guide for Organizing Your Child's Information",
      description: "Keep your child's medical info, emergency contacts, and key records in one place. This downloadable guide makes it easy to stay prepared for school, caregivers, travel, and more.",
      image: "📘"
    }
  ];

  const checklists = [
    {
      title: "Checklist: Grandparents' Guide to Watching the Grandkid",
      type: "checklist"
    },
    {
      title: "What the Babysitter Needs to Know", 
      type: "checklist"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 bg-[#FFD700] rounded-lg flex items-center justify-center mb-6">
                <Baby className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                FamilyVault for Organizing Your Child's Information
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Stop searching for scattered details. Keep your child's important info secure, private, and accessible — so when you need it for school, sports, a babysitter, or camp, you'll be ready.
              </p>
              <a
                href="/signup"
                data-testid="button-get-started"
                className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
              >
                Get started free
              </a>
            </div>
            <div className="lg:pl-12">
              <div className="bg-[#FFD700]/10 rounded-2xl p-8 h-96 overflow-hidden">
                <img 
                  src={soccerKidImage} 
                  alt="Happy child in blue soccer jersey holding soccer ball"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Find Information Fast */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Find Your Child's Information — Fast
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            FamilyVault takes the "Where did I put that?" out of parenting by keeping medical info, emergency contacts, and other key documents organized in one secure place.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="bg-gray-100 rounded-2xl p-8 h-64 flex items-center justify-center">
                      {index === 0 ? (
                        <img 
                          src={phoneDocumentImage}
                          alt="Hands holding phone displaying birth certificate document"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : index === 1 ? (
                        <img 
                          src={wifiPhoneImage}
                          alt="Phone screen showing Wi-Fi password sharing interface"
                          className="w-full h-full object-contain"
                        />
                      ) : index === 2 ? (
                        <img 
                          src={insuranceCardImage}
                          alt="Hand holding medical insurance card with health policy document in background"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : index === 3 ? (
                        <img 
                          src={babysitterImage}
                          alt="Caregiver sitting with two young children, showing confident childcare"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="text-center">
                          <IconComponent className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
                          <p className="text-gray-600">Feature illustration</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="w-8 h-8 bg-[#FFD700] rounded-lg flex items-center justify-center mb-6">
                      <IconComponent className="w-4 h-4 text-black" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4 italic">
                      {feature.description}
                    </p>
                    <p className="text-gray-800 font-medium">
                      {feature.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet FamilyVault */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Meet FamilyVault — Your Life, Organized
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            From travel and finances to emergency planning, FamilyVault keeps your key information secure, organized, and within reach so you can focus on what matters.
          </p>
          <a
            href="/signup"
            data-testid="button-get-started-free"
            className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Get started free
          </a>
        </div>
      </section>

      {/* Bottom Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {bottomFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-gray-100 rounded-2xl p-8 h-48 flex items-center justify-center mb-6">
                    {index === 0 ? (
                      <img 
                        src={securityImage}
                        alt="Digital security visualization with lock symbol and circuit board"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <IconComponent className="w-12 h-12 text-[#FFD700]" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Your Data Is Always Protected
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your sensitive information stays private and secure with advanced security and compliance practices.
            </p>
            <div className="mt-8">
              <a
                href="/security"
                className="text-[#FFD700] hover:text-[#FFD700]/80 font-medium inline-flex items-center"
              >
                About our security
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <IconComponent className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compliance Badges */}
          <div className="mt-16 text-center">
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-xs font-semibold text-gray-500 px-3 py-1 border rounded">EU GDPR</div>
              <div className="text-xs font-semibold text-gray-500 px-3 py-1 border rounded">SOC 2 TYPE II</div>
              <div className="text-xs font-semibold text-gray-500 px-3 py-1 border rounded">SOC 3</div>
              <div className="text-xs font-semibold text-gray-500 px-3 py-1 border rounded">HIPAA</div>
              <div className="text-xs font-semibold text-gray-500 px-3 py-1 border rounded">CCPA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Essential Resources */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Essential Resources: Your Child's Info, All in One Place
            </h2>
            <p className="text-lg text-gray-600">
              Explore expert advice on the important information every parent should have on hand.
            </p>
          </div>

          {/* Featured Guide */}
          <div className="bg-gray-100 rounded-2xl p-8 lg:p-12 mb-16">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <div className="w-48 h-64 bg-[#FFD700]/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
                    <p className="text-gray-600">Guide Cover</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#FFD700] mb-2">FEATURED GUIDE</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  The Ultimate Guide for Organizing Your Child's Information
                </h3>
                <p className="text-gray-600 mb-6">
                  Keep your child's medical info, emergency contacts, and key records in one place. This downloadable guide makes it easy to stay prepared for school, caregivers, travel, and more.
                </p>
                <button
                  data-testid="button-download-guide"
                  className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Checklists */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-8">Checklists</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {checklists.map((checklist, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {checklist.title}
                      </h4>
                      <button
                        data-testid={`button-download-${index}`}
                        className="text-[#FFD700] hover:text-[#FFD700]/80 font-medium inline-flex items-center"
                      >
                        Download
                        <Download className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                    <CheckCircle className="w-8 h-8 text-[#FFD700]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}