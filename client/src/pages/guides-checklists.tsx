import { FileText, CheckSquare, Download, Star, Users, Clock, ArrowRight, Filter, Search } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/navbar";

export default function GuidesChecklists() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const categories = ["All", "Life Events", "Emergency Planning", "Document Organization", "Family Security", "Estate Planning"];
  
  const guides = [
    {
      id: 1,
      title: "Complete Home Buying Checklist",
      description: "A comprehensive step-by-step checklist covering every stage of the home buying process, from pre-approval to closing day.",
      type: "Checklist",
      category: "Life Events",
      downloadCount: "2.3k",
      rating: 4.9,
      pages: 8,
      lastUpdated: "March 2025",
      featured: true,
      items: 45,
      icon: "🏠"
    },
    {
      id: 2,
      title: "Emergency Preparedness Guide for Families",
      description: "Essential planning guide for creating a comprehensive family emergency plan, including document backup strategies.",
      type: "Guide",
      category: "Emergency Planning",
      downloadCount: "3.1k",
      rating: 4.8,
      pages: 16,
      lastUpdated: "March 2025",
      featured: true,
      items: 28,
      icon: "🆘"
    },
    {
      id: 3,
      title: "Estate Planning Document Checklist",
      description: "Complete checklist of essential estate planning documents every family should have, with explanations of each document's purpose.",
      type: "Checklist",
      category: "Estate Planning",
      downloadCount: "1.8k",
      rating: 4.9,
      pages: 6,
      lastUpdated: "February 2025",
      featured: false,
      items: 22,
      icon: "⚖️"
    },
    {
      id: 4,
      title: "Digital Document Organization System",
      description: "Step-by-step guide to creating an efficient digital filing system for all your family's important documents.",
      type: "Guide",
      category: "Document Organization",
      downloadCount: "2.7k",
      rating: 4.7,
      pages: 12,
      lastUpdated: "February 2025",
      featured: false,
      items: 35,
      icon: "📁"
    },
    {
      id: 5,
      title: "New Baby Preparation Checklist",
      description: "Everything you need to know and prepare for when welcoming a new baby into your family, from legal documents to medical records.",
      type: "Checklist",
      category: "Life Events",
      downloadCount: "1.9k",
      rating: 4.8,
      pages: 10,
      lastUpdated: "February 2025",
      featured: false,
      items: 38,
      icon: "👶"
    },
    {
      id: 6,
      title: "Family Security & Privacy Protection Guide",
      description: "Comprehensive guide to protecting your family's personal information and maintaining privacy in the digital age.",
      type: "Guide",
      category: "Family Security",
      downloadCount: "2.1k",
      rating: 4.6,
      pages: 14,
      lastUpdated: "January 2025",
      featured: false,
      items: 31,
      icon: "🔐"
    },
    {
      id: 7,
      title: "International Travel Documentation Checklist",
      description: "Complete checklist ensuring you have all necessary documents and preparations for international family travel.",
      type: "Checklist",
      category: "Life Events",
      downloadCount: "1.4k",
      rating: 4.7,
      pages: 7,
      lastUpdated: "January 2025",
      featured: false,
      items: 26,
      icon: "✈️"
    },
    {
      id: 8,
      title: "Moving & Relocation Planning Guide",
      description: "Detailed guide for planning a family move, including document transfer, address changes, and settling-in tasks.",
      type: "Guide",
      category: "Life Events",
      downloadCount: "1.6k",
      rating: 4.8,
      pages: 11,
      lastUpdated: "December 2024",
      featured: false,
      items: 42,
      icon: "📦"
    }
  ];

  const filteredGuides = selectedCategory === "All" 
    ? guides 
    : guides.filter(guide => guide.category === selectedCategory);

  const featuredGuides = guides.filter(guide => guide.featured);
  const regularGuides = filteredGuides.filter(guide => !guide.featured);

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#121212] to-[#0E0E0E] pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-6">Guides & Checklists</h1>
            <p className="text-xl text-[#A5A5A5] leading-relaxed max-w-3xl mx-auto">
              Practical, downloadable resources to help you navigate life's important moments with confidence and organization.
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#A5A5A5]" />
                <input
                  type="text"
                  placeholder="Search guides and checklists..."
                  className="w-full pl-10 pr-4 py-3 bg-[#121212] border border-[#2A2A2A] rounded-lg text-white placeholder-[#A5A5A5] focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:border-transparent"
                  data-testid="search-guides"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#A5A5A5]" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-3 bg-[#121212] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:border-transparent"
                  data-testid="filter-category"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      {selectedCategory === "All" && (
        <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-12">Featured Resources</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredGuides.map((guide) => (
                <div 
                  key={guide.id} 
                  className="bg-[#121212] border border-[#2A2A2A] rounded-xl overflow-hidden hover:border-[#FFD43B]/30 transition-all group cursor-pointer"
                  data-testid={`featured-guide-${guide.id}`}
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-[#FFD43B]/20 to-[#FFD43B]/5 flex items-center justify-center border-b border-[#2A2A2A]">
                    <span className="text-8xl opacity-80">{guide.icon}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-[#FFD43B] text-[#0E0E0E] px-3 py-1 rounded-full text-sm font-medium">
                        {guide.type}
                      </span>
                      <span className="bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/20 px-3 py-1 rounded-full text-sm font-medium">
                        {guide.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#FFD43B] transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-[#A5A5A5] mb-4 leading-relaxed">
                      {guide.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-[#A5A5A5]">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-[#FFD43B] fill-current mr-1" />
                          {guide.rating}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {guide.downloadCount} downloads
                        </div>
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {guide.pages} pages
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#A5A5A5]">
                        {guide.items} items • Updated {guide.lastUpdated}
                      </span>
                      <button className="flex items-center text-[#FFD43B] hover:text-[#E6C140] transition-colors">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Guides */}
      <section className="py-16 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12">
            {selectedCategory === "All" ? "All Resources" : `${selectedCategory} Resources`}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(selectedCategory === "All" ? regularGuides : filteredGuides).map((guide) => (
              <div 
                key={guide.id} 
                className="bg-[#151515] border border-[#2A2A2A] rounded-xl overflow-hidden hover:border-[#FFD43B]/30 transition-all group cursor-pointer"
                data-testid={`guide-${guide.id}`}
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-[#FFD43B]/10 to-[#FFD43B]/5 flex items-center justify-center border-b border-[#2A2A2A]">
                  <span className="text-6xl opacity-80">{guide.icon}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/20 px-2 py-1 rounded-full text-xs font-medium">
                      {guide.type}
                    </span>
                    <span className="text-xs text-[#A5A5A5]">{guide.category}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#FFD43B] transition-colors line-clamp-2">
                    {guide.title}
                  </h3>
                  <p className="text-[#A5A5A5] mb-3 text-sm leading-relaxed line-clamp-2">
                    {guide.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#A5A5A5] mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-[#FFD43B] fill-current mr-1" />
                        {guide.rating}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {guide.downloadCount}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      {guide.pages} pages
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#A5A5A5]">
                      {guide.items} items
                    </span>
                    <button className="flex items-center text-[#FFD43B] hover:text-[#E6C140] transition-colors text-sm">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Create Custom Guide CTA */}
      <section className="py-20 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <CheckSquare className="w-8 h-8 text-[#FFD43B] mr-3" />
            <h2 className="text-3xl font-bold text-white">Need a Custom Guide?</h2>
          </div>
          <p className="text-xl text-[#A5A5A5] mb-8 leading-relaxed">
            Can't find exactly what you need? Let us know what guide or checklist would be helpful for your family situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              data-testid="button-request-guide"
              className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-6 py-3 rounded-full hover:bg-[#E6C140] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:ring-offset-2 focus:ring-offset-[#0E0E0E] min-h-[44px]"
            >
              Request a Custom Guide
            </button>
            <button 
              data-testid="button-browse-templates"
              className="inline-flex items-center justify-center border border-[#FFD43B] text-[#FFD43B] font-semibold px-6 py-3 rounded-full hover:bg-[#FFD43B]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:ring-offset-2 focus:ring-offset-[#0E0E0E] min-h-[44px]"
            >
              Browse Templates
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Turn these guides into your organized reality
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Use FamilyVault to store and organize all the documents mentioned in these guides securely.
          </p>
          <a
            href="/pricing"
            data-testid="button-get-started-guides"
            className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-4 rounded-full hover:bg-[#E6C140] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:ring-offset-2 focus:ring-offset-[#0E0E0E] min-h-[44px]"
          >
            Start Your Free Trial
          </a>
        </div>
      </section>
    </div>
  );
}