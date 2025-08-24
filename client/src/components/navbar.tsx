import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isForeverFilesOpen, setIsForeverFilesOpen] = useState(false);
  const [isForeverFilesMobileOpen, setIsForeverFilesMobileOpen] = useState(false);
  const [isMoreGoodieGuidesOpen, setIsMoreGoodieGuidesOpen] = useState(false);
  const [isMoreGoodieGuidesMobileOpen, setIsMoreGoodieGuidesMobileOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const foreverFilesCategories = [
    { name: "Child Information", icon: "👶", path: "/child-information" },
    { name: "Disaster Planning", icon: "⚠️", path: "/disaster-planning" },
    { name: "Elderly Parents", icon: "👴", path: "/elderly-parents" },
    { name: "Estate Planning", icon: "📋", path: "/estate-planning" },
    { name: "Getting Married", icon: "💍", path: "/getting-married" },
    { name: "Home Buying", icon: "🏠", path: "/home-buying" },
    { name: "International Travel", icon: "✈️", path: "/international-travel" },
    { name: "Starting a Family", icon: "👨‍👩‍👧", path: "/starting-a-family" },
    { name: "Moving", icon: "📦", path: "/moving" },
    { name: "When Someone Dies", icon: "🌿", path: "/when-someone-dies" },
    { name: "Digital Security", icon: "🔒", path: "/digital-security" },
    { name: "Neurodiversity", icon: "🧠", path: "/neurodiversity" }
  ];

  const moreGoodieGuidesCategories = [
    { name: "Blogs", icon: "📝" },
    { name: "Guides & Checklists", icon: "📋" },
    { name: "Help center", icon: "❓" }
  ];

  return (
    <nav className="sticky top-0 bg-black shadow-sm z-50 border-b border-[#C5A028]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-[#D4AF37] hover:opacity-80 transition-opacity">
              FamilyVault
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="/" className="text-[#CCCCCC] hover:text-[#D4AF37] font-medium transition-colors">
                Home
              </a>
              
              {/* Forever Files Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsForeverFilesOpen(true)}
                onMouseLeave={() => setIsForeverFilesOpen(false)}
              >
                <button className="text-[#CCCCCC] hover:text-[#D4AF37] font-medium transition-colors flex items-center">
                  Forever Files
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                
                {isForeverFilesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-96 bg-black rounded-xl shadow-2xl border border-[#C5A028] p-6 z-50">
                    <div className="grid grid-cols-2 gap-4">
                      {foreverFilesCategories.map((category, index) => (
                        <a
                          key={index}
                          href={category.path}
                          className="flex items-center p-3 rounded-lg hover:bg-[#111111] transition-colors group"
                        >
                          <span className="text-xl mr-3">{category.icon}</span>
                          <span className="text-sm font-medium text-[#CCCCCC] group-hover:text-[#D4AF37]">
                            {category.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <a href="/security" className="text-[#CCCCCC] hover:text-[#D4AF37] font-medium transition-colors">
                Security
              </a>
              <a href="/reviews" className="text-[#CCCCCC] hover:text-[#D4AF37] font-medium transition-colors">
                Reviews
              </a>
              <a href="/pricing" className="text-[#CCCCCC] hover:text-[#D4AF37] font-medium transition-colors">
                Pricing
              </a>
              
              {/* More Goodie Guides Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsMoreGoodieGuidesOpen(true)}
                onMouseLeave={() => setIsMoreGoodieGuidesOpen(false)}
              >
                <button className="text-[#CCCCCC] hover:text-[#D4AF37] font-medium transition-colors flex items-center">
                  More Goodie Guides
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                
                {isMoreGoodieGuidesOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-black rounded-xl shadow-2xl border border-[#C5A028] p-6 z-50">
                    <div className="space-y-4">
                      {moreGoodieGuidesCategories.map((category, index) => (
                        <a
                          key={index}
                          href="#"
                          className="flex items-center p-3 rounded-lg hover:bg-[#111111] transition-colors group"
                        >
                          <span className="text-xl mr-3">{category.icon}</span>
                          <span className="text-sm font-medium text-[#CCCCCC] group-hover:text-[#D4AF37]">
                            {category.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/login" className="text-[#CCCCCC] hover:text-[#D4AF37] font-medium transition-colors">
              Login
            </a>
            <a
              href="/signup"
              data-testid="button-get-started-nav"
              className="bg-[#D4AF37] hover:bg-[#B8860B] text-black px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Get Started Free
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              data-testid="button-mobile-menu"
              onClick={toggleMenu}
              className="text-[#CCCCCC] hover:text-[#D4AF37]"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <a href="/" className="block px-3 py-2 text-[#CCCCCC] hover:text-[#D4AF37] font-medium">
              Home
            </a>
            
            {/* Forever Files Mobile Dropdown */}
            <div>
              <button
                onClick={() => setIsForeverFilesMobileOpen(!isForeverFilesMobileOpen)}
                className="w-full text-left px-3 py-2 text-[#CCCCCC] hover:text-[#D4AF37] font-medium flex items-center justify-between"
              >
                Forever Files
                <ChevronDown className={`w-4 h-4 transition-transform ${isForeverFilesMobileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isForeverFilesMobileOpen && (
                <div className="ml-4 space-y-1 bg-[#111111] rounded-lg p-2">
                  {foreverFilesCategories.map((category, index) => (
                    <a
                      key={index}
                      href={category.path}
                      className="flex items-center px-3 py-2 text-sm text-[#CCCCCC] hover:text-[#D4AF37] rounded"
                    >
                      <span className="text-base mr-2">{category.icon}</span>
                      {category.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            <a href="/security" className="block px-3 py-2 text-[#CCCCCC] hover:text-[#D4AF37] font-medium">
              Security
            </a>
            <a href="/reviews" className="block px-3 py-2 text-[#CCCCCC] hover:text-[#D4AF37] font-medium">
              Reviews
            </a>
            <a href="/pricing" className="block px-3 py-2 text-[#CCCCCC] hover:text-[#D4AF37] font-medium">
              Pricing
            </a>
            
            {/* More Goodie Guides Mobile Dropdown */}
            <div>
              <button
                onClick={() => setIsMoreGoodieGuidesMobileOpen(!isMoreGoodieGuidesMobileOpen)}
                className="w-full text-left px-3 py-2 text-[#CCCCCC] hover:text-[#D4AF37] font-medium flex items-center justify-between"
              >
                More Goodie Guides
                <ChevronDown className={`w-4 h-4 transition-transform ${isMoreGoodieGuidesMobileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isMoreGoodieGuidesMobileOpen && (
                <div className="ml-4 space-y-1 bg-[#111111] rounded-lg p-2">
                  {moreGoodieGuidesCategories.map((category, index) => (
                    <a
                      key={index}
                      href="#"
                      className="flex items-center px-3 py-2 text-sm text-[#CCCCCC] hover:text-[#D4AF37] rounded"
                    >
                      <span className="text-base mr-2">{category.icon}</span>
                      {category.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <hr className="my-2" />
            <a href="/login" className="block px-3 py-2 text-[#CCCCCC] hover:text-[#D4AF37] font-medium">
              Login
            </a>
            <a
              href="/signup"
              data-testid="button-get-started-mobile"
              className="w-full mt-2 bg-[#D4AF37] hover:bg-[#B8860B] text-black px-4 py-2 rounded-lg font-medium text-center block"
            >
              Get Started Free
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
