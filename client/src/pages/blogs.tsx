import { Calendar, User, ArrowRight, BookOpen, Filter, Search, Tags, Clock } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/navbar";

export default function Blogs() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const categories = ["All", "Document Management", "Family Security", "Estate Planning", "Emergency Preparedness", "Digital Organization"];
  
  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Documents Every Family Should Have Organized",
      excerpt: "Learn which critical documents should be part of your family's secure filing system and why having them organized can save precious time during emergencies.",
      author: "Sarah Chen",
      date: "March 15, 2025",
      readTime: "8 min read",
      category: "Document Management",
      featured: true,
      image: "📋"
    },
    {
      id: 2,
      title: "Creating a Digital Emergency Kit for Your Family",
      excerpt: "Step-by-step guide to building a comprehensive digital emergency preparedness plan that ensures your family can access critical information when it matters most.",
      author: "Michael Rodriguez",
      date: "March 12, 2025",
      readTime: "12 min read",
      category: "Emergency Preparedness",
      featured: true,
      image: "🆘"
    },
    {
      id: 3,
      title: "Estate Planning 101: Protecting Your Family's Future",
      excerpt: "Understanding the basics of estate planning and how proper document organization plays a crucial role in securing your family's financial future.",
      author: "Dr. Jennifer Walsh",
      date: "March 8, 2025",
      readTime: "10 min read",
      category: "Estate Planning",
      featured: false,
      image: "⚖️"
    },
    {
      id: 4,
      title: "Securing Your Family's Digital Life: Password Management & More",
      excerpt: "Best practices for protecting your family's digital assets, from password management to secure file sharing and digital inheritance planning.",
      author: "Alex Thompson",
      date: "March 5, 2025",
      readTime: "15 min read",
      category: "Family Security",
      featured: false,
      image: "🔐"
    },
    {
      id: 5,
      title: "The Parent's Guide to Organizing School and Medical Records",
      excerpt: "Practical strategies for keeping track of your children's educational and health documentation throughout their developmental years.",
      author: "Lisa Park",
      date: "March 1, 2025",
      readTime: "7 min read",
      category: "Document Management",
      featured: false,
      image: "🏥"
    },
    {
      id: 6,
      title: "Going Paperless: Digital Organization for Modern Families",
      excerpt: "How to transition from physical filing systems to secure digital organization while maintaining accessibility and security.",
      author: "David Kim",
      date: "February 28, 2025",
      readTime: "9 min read",
      category: "Digital Organization",
      featured: false,
      image: "💻"
    }
  ];

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#121212] to-[#0E0E0E] pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-6">FamilyVault Blog</h1>
            <p className="text-xl text-[#A5A5A5] leading-relaxed max-w-3xl mx-auto">
              Expert insights, practical tips, and guidance to help you organize, secure, and manage your family's most important information.
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#A5A5A5]" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-3 bg-[#121212] border border-[#2A2A2A] rounded-lg text-white placeholder-[#A5A5A5] focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:border-transparent"
                  data-testid="search-articles"
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

      {/* Featured Articles */}
      {selectedCategory === "All" && (
        <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-12">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article 
                  key={post.id} 
                  className="bg-[#121212] border border-[#2A2A2A] rounded-xl overflow-hidden hover:border-[#FFD43B]/30 transition-all group cursor-pointer"
                  data-testid={`featured-article-${post.id}`}
                >
                  <div className="aspect-video bg-gradient-to-br from-[#FFD43B]/20 to-[#FFD43B]/5 flex items-center justify-center border-b border-[#2A2A2A]">
                    <span className="text-6xl opacity-80">{post.image}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-[#FFD43B] text-[#0E0E0E] px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                      <div className="flex items-center text-[#A5A5A5] text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#FFD43B] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-[#A5A5A5] mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-[#A5A5A5]">
                        <User className="w-4 h-4 mr-2" />
                        <span>{post.author}</span>
                        <span className="mx-2">•</span>
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{post.date}</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#FFD43B] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Articles */}
      <section className="py-16 bg-[#121212] border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12">
            {selectedCategory === "All" ? "Latest Articles" : `${selectedCategory} Articles`}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(selectedCategory === "All" ? regularPosts : filteredPosts).map((post) => (
              <article 
                key={post.id} 
                className="bg-[#151515] border border-[#2A2A2A] rounded-xl overflow-hidden hover:border-[#FFD43B]/30 transition-all group cursor-pointer"
                data-testid={`article-${post.id}`}
              >
                <div className="aspect-video bg-gradient-to-br from-[#FFD43B]/10 to-[#FFD43B]/5 flex items-center justify-center border-b border-[#2A2A2A]">
                  <span className="text-4xl opacity-80">{post.image}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/20 px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center text-[#A5A5A5] text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-[#FFD43B] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[#A5A5A5] mb-4 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#A5A5A5]">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-b from-[#FFD43B]/5 to-transparent border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-[#FFD43B] mr-3" />
            <h2 className="text-3xl font-bold text-white">Stay Informed</h2>
          </div>
          <p className="text-xl text-[#A5A5A5] mb-8 leading-relaxed">
            Get the latest insights and tips delivered to your inbox. No spam, just valuable content for modern families.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-[#121212] border border-[#2A2A2A] rounded-full text-white placeholder-[#A5A5A5] focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:border-transparent"
              data-testid="newsletter-email"
            />
            <button 
              data-testid="newsletter-subscribe"
              className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-6 py-3 rounded-full hover:bg-[#E6C140] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:ring-offset-2 focus:ring-offset-[#0E0E0E] min-h-[44px]"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0E0E0E] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to organize your family's information?
          </h2>
          <p className="text-lg text-[#A5A5A5] mb-8">
            Start implementing these insights with FamilyVault's secure document management platform.
          </p>
          <button 
            data-testid="button-get-started-blogs"
            className="inline-flex items-center justify-center bg-[#FFD43B] text-[#0E0E0E] font-semibold px-8 py-4 rounded-full hover:bg-[#E6C140] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD43B] focus:ring-offset-2 focus:ring-offset-[#0E0E0E] min-h-[44px]"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}