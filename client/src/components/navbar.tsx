import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
                The Nest
              </a>
              <a href="#" className="text-gray-600 hover:text-primary font-medium transition-colors">
                Keep Safe
              </a>
              <a href="#" className="text-gray-600 hover:text-primary font-medium transition-colors">
                Family Fortune
              </a>
              <a href="#" className="text-gray-600 hover:text-primary font-medium transition-colors">
                Vital Care
              </a>
              <a href="#" className="text-gray-600 hover:text-primary font-medium transition-colors">
                Forever Files
              </a>
              <a href="#" className="text-gray-600 hover:text-primary font-medium transition-colors">
                Memory Lane
              </a>
              <a href="#" className="text-gray-600 hover:text-primary font-medium transition-colors">
                Guardianship
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
              The Nest
            </a>
            <a href="#" className="block px-3 py-2 text-gray-600 hover:text-primary font-medium">
              Keep Safe
            </a>
            <a href="#" className="block px-3 py-2 text-gray-600 hover:text-primary font-medium">
              Family Fortune
            </a>
            <a href="#" className="block px-3 py-2 text-gray-600 hover:text-primary font-medium">
              Vital Care
            </a>
            <a href="#" className="block px-3 py-2 text-gray-600 hover:text-primary font-medium">
              Forever Files
            </a>
            <a href="#" className="block px-3 py-2 text-gray-600 hover:text-primary font-medium">
              Memory Lane
            </a>
            <a href="#" className="block px-3 py-2 text-gray-600 hover:text-primary font-medium">
              Guardianship
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
