import { Search, Book, MessageCircle, Mail, Phone, Clock, ArrowRight, HelpCircle, CheckCircle, Users, Shield, Settings, FileText, Headphones } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/navbar";

export default function HelpCenter() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const categories = ["All", "Getting Started", "Account & Billing", "Document Management", "Security & Privacy", "Family Sharing", "Troubleshooting"];
  
  const popularArticles = [
    {
      id: 1,
      title: "Getting Started with FamilyVault",
      description: "Complete walkthrough of setting up your account and uploading your first documents",
      category: "Getting Started",
      readTime: "5 min",
      helpful: 284,
      icon: "🚀"
    },
    {
      id: 2,
      title: "How to Invite Family Members",
      description: "Step-by-step guide to sharing access with family members and setting permissions",
      category: "Family Sharing",
      readTime: "3 min",
      helpful: 197,
      icon: "👥"
    },
    {
      id: 3,
      title: "Understanding Document Categories",
      description: "Learn how to organize your documents using FamilyVault's category system",
      category: "Document Management",
      readTime: "7 min",
      helpful: 156,
      icon: "📂"
    },
    {
      id: 4,
      title: "Setting Up Emergency Access",
      description: "Configure emergency contacts to access critical documents when needed",
      category: "Family Sharing",
      readTime: "4 min",
      helpful: 143,
      icon: "🆘"
    }
  ];

  const faqItems = [
    {
      question: "How do I upload documents to FamilyVault?",
      answer: "You can upload documents by clicking the 'Add Document' button in your dashboard, then either drag and drop files or browse to select them. We support PDF, JPG, PNG, and DOCX formats up to 25MB per file.",
      category: "Document Management"
    },
    {
      question: "Can I access my documents offline?",
      answer: "While FamilyVault is cloud-based for maximum security, you can download individual documents for offline access. We recommend keeping copies of critical documents in a secure local backup as well.",
      category: "Document Management"
    },
    {
      question: "How secure is my family's information?",
      answer: "We use bank-level encryption (AES-256) for all data, both in transit and at rest. Your documents are stored in SOC 2 certified data centers, and we never sell or share your personal information.",
      category: "Security & Privacy"
    },
    {
      question: "What happens if I forget my password?",
      answer: "Click 'Forgot Password' on the login page and we'll send a secure reset link to your registered email. For additional security, you may need to verify your identity through SMS or security questions.",
      category: "Getting Started"
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel anytime from your Account Settings. Your data remains accessible until your current billing period ends, after which you have 30 days to download everything before deletion.",
      category: "Account & Billing"
    },
    {
      question: "Can family members see all my documents?",
      answer: "No, you control exactly what each family member can access. You can share specific documents or entire categories, and set view-only or edit permissions for each person.",
      category: "Family Sharing"
    }
  ];

  const supportChannels = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      hours: "9 AM - 6 PM EST, Mon-Fri",
      icon: MessageCircle,
      action: "Start Chat",
      available: true
    },
    {
      title: "Email Support",
      description: "Send us detailed questions and we'll respond within 24 hours",
      hours: "24/7 - We'll get back to you",
      icon: Mail,
      action: "Send Email",
      available: true
    },
    {
      title: "Phone Support",
      description: "Speak directly with a support specialist",
      hours: "9 AM - 5 PM EST, Mon-Fri",
      icon: Phone,
      action: "Call Now",
      available: false
    },
    {
      title: "Video Call",
      description: "Screen sharing for complex technical issues",
      hours: "By appointment only",
      icon: Headphones,
      action: "Schedule Call",
      available: true
    }
  ];

  const filteredFaqs = selectedCategory === "All" 
    ? faqItems 
    : faqItems.filter(faq => faq.category === selectedCategory);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#121212] to-[#0E0E0E] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Help Center</h1>
          <p className="text-xl text-[#A5A5A5] leading-relaxed mb-8">
            Find answers, get support, and learn how to make the most of FamilyVault for your family.
          </p>
          
          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#A5A5A5]" />
            <input
              type="text"
              placeholder="Search for help articles, guides, and FAQs..."
              className="w-full pl-12 pr-4 py-4 bg-[#121212] border border-[#2A2A2A] rounded-full text-white placeholder-[#A5A5A5] focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:border-transparent text-lg"
              data-testid="search-help"
            />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Need Help With Something Specific?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6 hover:border-[#FFD43B]/30 transition-all cursor-pointer group" data-testid="quick-action-getting-started">
              <div className="w-12 h-12 bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#FFD43B]/20 transition-colors">
                <Book className="w-6 h-6 text-[#FFD43B]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#FFD43B] transition-colors">Getting Started</h3>
              <p className="text-[#A5A5A5] text-sm">Setup guides and first steps</p>
            </div>
            
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6 hover:border-[#FFD43B]/30 transition-all cursor-pointer group" data-testid="quick-action-account">
              <div className="w-12 h-12 bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#FFD43B]/20 transition-colors">
                <Settings className="w-6 h-6 text-[#FFD43B]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#FFD43B] transition-colors">Account & Billing</h3>
              <p className="text-[#A5A5A5] text-sm">Manage your subscription</p>
            </div>
            
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6 hover:border-[#FFD43B]/30 transition-all cursor-pointer group" data-testid="quick-action-documents">
              <div className="w-12 h-12 bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#FFD43B]/20 transition-colors">
                <FileText className="w-6 h-6 text-[#FFD43B]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#FFD43B] transition-colors">Document Management</h3>
              <p className="text-[#A5A5A5] text-sm">Upload, organize, and share</p>
            </div>
            
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6 hover:border-[#FFD43B]/30 transition-all cursor-pointer group" data-testid="quick-action-security">
              <div className="w-12 h-12 bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#FFD43B]/20 transition-colors">
                <Shield className="w-6 h-6 text-[#FFD43B]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#FFD43B] transition-colors">Security & Privacy</h3>
              <p className="text-[#A5A5A5] text-sm">Understand our protections</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12">Popular Help Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {popularArticles.map((article) => (
              <div 
                key={article.id} 
                className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-6 hover:border-[#FFD43B]/30 transition-all group cursor-pointer"
                data-testid={`popular-article-${article.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{article.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/20 px-2 py-1 rounded-full text-xs font-medium">
                        {article.category}
                      </span>
                      <div className="flex items-center text-[#A5A5A5] text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {article.readTime}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#FFD43B] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-[#A5A5A5] text-sm mb-3 leading-relaxed">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-[#A5A5A5] text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        {article.helpful} found this helpful
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#FFD43B] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-[#A5A5A5]">Quick answers to common questions</p>
          </div>
          
          {/* FAQ Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-[#FFD43B] text-[#0E0E0E]"
                      : "bg-[#121212] border border-[#2A2A2A] text-[#A5A5A5] hover:border-[#FFD43B]/30 hover:text-white"
                  }`}
                  data-testid={`faq-filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((item, index) => (
              <div key={index} className="bg-[#121212] border border-[#2A2A2A] rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#151515] rounded-lg transition-colors"
                  data-testid={`faq-question-${index}`}
                >
                  <h3 className="text-lg font-semibold text-white pr-4">{item.question}</h3>
                  <HelpCircle 
                    className={`w-5 h-5 text-[#FFD43B] transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 border-t border-[#2A2A2A]">
                    <p className="text-[#A5A5A5] leading-relaxed pt-4" data-testid={`faq-answer-${index}`}>
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Still Need Help?</h2>
            <p className="text-lg text-[#A5A5A5]">Our support team is here to help you succeed</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => {
              const IconComponent = channel.icon;
              return (
                <div 
                  key={index} 
                  className="bg-[#151515] border border-[#2A2A2A] rounded-xl p-6 text-center hover:border-[#FFD43B]/30 transition-all"
                  data-testid={`support-channel-${index}`}
                >
                  <div className="w-16 h-16 bg-[#FFD43B]/10 border border-[#FFD43B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-[#FFD43B]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{channel.title}</h3>
                  <p className="text-[#A5A5A5] text-sm mb-3 leading-relaxed">{channel.description}</p>
                  <p className="text-xs text-[#A5A5A5] mb-4">{channel.hours}</p>
                  <button 
                    className={`w-full py-2 px-4 rounded-full text-sm font-medium transition-all ${
                      channel.available
                        ? "bg-[#FFD43B] text-[#0E0E0E] hover:bg-[#E6C140]"
                        : "bg-[#2A2A2A] text-[#A5A5A5] cursor-not-allowed"
                    }`}
                    disabled={!channel.available}
                    data-testid={`support-action-${index}`}
                  >
                    {channel.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Join thousands of families who trust FamilyVault to organize and secure their important information.
          </p>
          <button 
            data-testid="button-get-started-help"
            className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-4 rounded-full hover:bg-[#E6C140] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:ring-offset-2 focus:ring-offset-[#0E0E0E] min-h-[44px]"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}