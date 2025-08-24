import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isForeverFilesOpen, setIsForeverFilesOpen] = useState(false);
  const [isForeverFilesMobileOpen, setIsForeverFilesMobileOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const foreverFilesCategories = [
    { name: "Child Information", icon: "👶" },
    { name: "Disaster Planning", icon: "⚠️" },
    { name: "Elderly Parents", icon: "👴" },
    { name: "Estate Planning", icon: "📋" },
    { name: "Getting Married", icon: "💍" },
    { name: "Home Buying", icon: "🏠" },
    { name: "International Travel", icon: "✈️" },
    { name: "Starting a Family", icon: "👨‍👩‍👧" },
    { name: "Moving", icon: "📦" },
    { name: "When Someone Dies", icon: "🌿" },
    { name: "Digital Security", icon: "🔒" },
    { name: "Neurodiversity", icon: "🧠" }
  ];

  return (
    <nav className="sticky top-0 bg-white shadow-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-primary">FamilyVault</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="text-gray-600 hover:text-primary font-medium transition-colors">
                Home
              </a>
              
              {/* Forever Files Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsForeverFilesOpen(true)}
                onMouseLeave={() => setIsForeverFilesOpen(false)}
              >
                <button className="text-gray-600 hover:text-primary font-medium transition-colors flex items-center">
                  Forever Files
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                
                {isForeverFilesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 p-6 z-50">
                    <div className="grid grid-cols-2 gap-4">
                      {foreverFilesCategories.map((category, index) => (
                        <a
                          key={index}
                          href="#"
                          className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <span className="text-xl mr-3">{category.icon}</span>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary">
                            {category.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <a href="/security" className="text-gray-600 hover:text-primary font-medium transition-colors">
                Security
              </a>
              <a href="#" className="text-gray-600 hover:text-primary font-medium transition-colors">
                Reviews
              </a>
              <a href="#" className="text-gray-600 hover:text-primary font-medium transition-colors">
                Pricing
              </a>
              <a href="#" className="text-gray-600 hover:text-primary font-medium transition-colors">
                More Goodie Guides
              </a>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-gray-600 hover:text-primary font-medium transition-colors">
              Login
            </a>
            <button 
              data-testid="button-get-started-nav"
              className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              data-testid="button-mobile-menu"
              onClick={toggleMenu}
              className="text-gray-600 hover:text-primary"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <a href="#" className="block px-3 py-2 text-gray-600 hover:text-primary font-medium">
              Home
            </a>
            
            {/* Forever Files Mobile Dropdown */}
            <div>
              <button
                onClick={() => setIsForeverFilesMobileOpen(!isForeverFilesMobileOpen)}
                className="w-full text-left px-3 py-2 text-gray-600 hover:text-primary font-medium flex items-center justify-between"
              >
                Forever Files
                <ChevronDown className={`w-4 h-4 transition-transform ${isForeverFilesMobileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isForeverFilesMobileOpen && (
                <div className="ml-4 space-y-1 bg-gray-50 rounded-lg p-2">
                  {foreverFilesCategories.map((category, index) => (
                    <a
                      key={index}
                      href="#"
                      className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-primary rounded"
                    >
                      <span className="text-base mr-2">{category.icon}</span>
                      {category.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            <a href="/security" className="block px-3 py-2 text-gray-600 hover:text-primary font-medium">
              Security
            </a>
            <a href="#" className="block px-3 py-2 text-gray-600 hover:text-primary font-medium">
              Reviews
            </a>
            <a href="#" className="block px-3 py-2 text-gray-600 hover:text-primary font-medium">
              Pricing
            </a>
            <a href="#" className="block px-3 py-2 text-gray-600 hover:text-primary font-medium">
              More Goodie Guides
            </a>
            <hr className="my-2" />
            <a href="#" className="block px-3 py-2 text-gray-600 hover:text-primary font-medium">
              Login
            </a>
            <button 
              data-testid="button-get-started-mobile"
              className="w-full mt-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg font-medium"
            >
              Get Started Free
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
