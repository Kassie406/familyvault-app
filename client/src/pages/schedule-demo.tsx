import { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, Building, Globe, ChevronDown, CheckCircle } from 'lucide-react';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ScheduleDemo() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    firmWebsite: '',
    typeOfFirm: '',
    additionalInfo: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to backend
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] text-white">
        <Navbar />
        
        <section className="pt-32 pb-24">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-12">
              <div className="w-20 h-20 bg-[#FFD43B]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-10 h-10 text-[#FFD43B]" />
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-6">
                Demo Request Submitted!
              </h1>
              
              <p className="text-xl text-[#A5A5A5] mb-8 leading-relaxed">
                Thank you for your interest in FamilyCircle Secure. Our team will contact you within 24 hours to schedule your personalized demo.
              </p>
              
              <div className="space-y-4 text-left bg-[#0E0E0E] border border-[#2A2A2A] rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">What to expect in your demo:</h3>
                <ul className="space-y-3 text-[#A5A5A5]">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Personalized walkthrough of FamilyCircle Secure's features
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Discussion of your family's specific needs and use cases
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Q&A session with our family organization experts
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#FFD43B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Custom pricing and implementation recommendations
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/"
                  data-testid="button-return-home"
                  className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-3 rounded-full hover:bg-[#E6C140] transition-colors"
                >
                  Return to Home
                </a>
                <a
                  href="/pricing"
                  data-testid="button-view-pricing"
                  className="inline-flex items-center justify-center border border-[#FFD43B] text-[#FFD43B] font-semibold px-8 py-3 rounded-full hover:bg-[#FFD43B]/10 transition-colors"
                >
                  View Pricing
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#121212] to-[#0E0E0E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-full px-4 py-2 mb-6">
                <Calendar className="w-4 h-4 text-[#FFD43B] mr-2" />
                <span className="text-[#FFD43B] text-sm font-medium">Schedule a Demo</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Help Families Protect and Organize Vital Information
              </h1>
              
              <p className="text-xl text-[#A5A5A5] mb-8 leading-relaxed">
                FamilyCircle Secure helps families, advisors, and professionals deliver a secure, collaborative, and integrated digital experience for organizing their most important information.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-[#FFD43B] mr-3" />
                  <span className="text-[#CCCCCC]">30-minute personalized demonstration</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-[#FFD43B] mr-3" />
                  <span className="text-[#CCCCCC]">Custom implementation recommendations</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-[#FFD43B] mr-3" />
                  <span className="text-[#CCCCCC]">Tailored pricing for your family needs</span>
                </div>
              </div>
            </div>
            
            {/* Right Form */}
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Schedule a demo</h2>
                <p className="text-[#A5A5A5]">Fill out the form and we'll be in touch within 24 hours.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      First name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666666]" />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        data-testid="input-first-name"
                        className="w-full bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:border-[#FFD43B]"
                        placeholder="Enter your first name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      Last name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666666]" />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        data-testid="input-last-name"
                        className="w-full bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:border-[#FFD43B]"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#CCCCCC] mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666666]" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      data-testid="input-email"
                      className="w-full bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:border-[#FFD43B]"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#CCCCCC] mb-2">
                    Phone number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666666]" />
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      data-testid="input-phone"
                      className="w-full bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:border-[#FFD43B]"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-[#CCCCCC] mb-2">
                    Company name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666666]" />
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleInputChange}
                      data-testid="input-company"
                      className="w-full bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:border-[#FFD43B]"
                      placeholder="Enter your company or family name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="firmWebsite" className="block text-sm font-medium text-[#CCCCCC] mb-2">
                    Firm website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666666]" />
                    <input
                      type="url"
                      id="firmWebsite"
                      name="firmWebsite"
                      value={formData.firmWebsite}
                      onChange={handleInputChange}
                      data-testid="input-website"
                      className="w-full bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:border-[#FFD43B]"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="typeOfFirm" className="block text-sm font-medium text-[#CCCCCC] mb-2">
                    Type of firm
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666666]" />
                    <select
                      id="typeOfFirm"
                      name="typeOfFirm"
                      value={formData.typeOfFirm}
                      onChange={handleInputChange}
                      data-testid="select-firm-type"
                      className="w-full bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg pl-10 pr-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:border-[#FFD43B] appearance-none"
                    >
                      <option value="">Please Select</option>
                      <option value="family">Family/Individual</option>
                      <option value="wealth-advisor">Wealth Advisor</option>
                      <option value="estate-planning">Estate Planning Attorney</option>
                      <option value="family-office">Family Office</option>
                      <option value="accountant">Accountant</option>
                      <option value="insurance-broker">Insurance Broker</option>
                      <option value="financial-planner">Financial Planner</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666666] pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-[#CCCCCC] mb-2">
                    Additional information (optional)
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    rows={4}
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    data-testid="textarea-additional-info"
                    className="w-full bg-[#0E0E0E] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:border-[#FFD43B] resize-none"
                    placeholder="Tell us about your specific needs or questions..."
                  />
                </div>
                
                <button
                  type="submit"
                  data-testid="button-submit-demo-request"
                  className="w-full bg-[#FFD43B] text-[#0E0E0E] font-semibold py-4 rounded-lg hover:bg-[#E6C140] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:ring-offset-2 focus:ring-offset-[#121212]"
                >
                  Schedule demo
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Thousands of Families Trust FamilyCircle Secure
            </h2>
            <p className="text-xl text-[#A5A5A5] max-w-3xl mx-auto">
              Join the growing community of families and professionals who rely on FamilyCircle Secure to organize and secure their most important information.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Families</h3>
              <p className="text-[#A5A5A5] text-sm">Organize important documents and information in one secure place</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Wealth Advisors</h3>
              <p className="text-[#A5A5A5] text-sm">Help clients organize and protect their financial information</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-lg font-semibled text-white mb-2">Estate Planners</h3>
              <p className="text-[#A5A5A5] text-sm">Streamline document collection and estate planning processes</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Family Offices</h3>
              <p className="text-[#A5A5A5] text-sm">Collaborative platform for managing multiple family relationships</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}