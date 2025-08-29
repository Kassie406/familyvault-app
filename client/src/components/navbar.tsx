import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import logoUrl from "../assets/familycircle-logo.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isForeverFilesMobileOpen, setIsForeverFilesMobileOpen] = useState(false);
  const [isMoreGoodieGuidesMobileOpen, setIsMoreGoodieGuidesMobileOpen] = useState(false);

  useEffect(() => {
    // Multi-dropdown functionality for all nav dropdowns
    const items = document.querySelectorAll('.nav-item.has-dropdown');
    const CLOSE_DELAY = 150;
    const cleanupFunctions: (() => void)[] = [];

    items.forEach((dd) => {
      const trigger = dd.querySelector('.nav-trigger') as HTMLElement;
      const panel = dd.querySelector('.dropdown') as HTMLElement;
      if (!trigger || !panel) return;

      let closeTimer: NodeJS.Timeout | null = null;

      const open = () => {
        dd.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        if (closeTimer) clearTimeout(closeTimer);
      };

      const scheduleClose = () => {
        if (closeTimer) clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
          dd.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        }, CLOSE_DELAY);
      };

      const handleKeydown = (e: Event) => {
        const keyEvent = e as KeyboardEvent;
        if (keyEvent.key === 'Escape') {
          dd.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.focus();
        }
      };

      const handleClick = () => {
        const openNow = dd.classList.toggle('open');
        trigger.setAttribute('aria-expanded', openNow ? 'true' : 'false');
        if (!openNow) trigger.blur();
      };

      // Open on pointer enter + focus; keep open while inside
      trigger.addEventListener('mouseenter', open);
      panel.addEventListener('mouseenter', open);
      trigger.addEventListener('focus', open, true);

      // Schedule close when leaving both
      trigger.addEventListener('mouseleave', scheduleClose);
      panel.addEventListener('mouseleave', scheduleClose);
      trigger.addEventListener('blur', scheduleClose, true);

      // Close on Escape
      dd.addEventListener('keydown', handleKeydown);

      // Click toggles on mobile
      trigger.addEventListener('click', handleClick);

      // Store cleanup function
      cleanupFunctions.push(() => {
        if (closeTimer) clearTimeout(closeTimer);
        trigger.removeEventListener('mouseenter', open);
        panel.removeEventListener('mouseenter', open);
        trigger.removeEventListener('focus', open, true);
        trigger.removeEventListener('mouseleave', scheduleClose);
        panel.removeEventListener('mouseleave', scheduleClose);
        trigger.removeEventListener('blur', scheduleClose, true);
        dd.removeEventListener('keydown', handleKeydown);
        trigger.removeEventListener('click', handleClick);
      });
    });

    // Return cleanup function
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, []);

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
    { name: "Blogs", icon: "📝", path: "/blogs" },
    { name: "Guides & Checklists", icon: "📋", path: "/guides-checklists" },
    { name: "Help center", icon: "❓", path: "/help-center" }
  ];

  return (
    <nav className="sticky top-0 bg-black shadow-sm z-50 border-b border-[#C5A028]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img 
                src={logoUrl} 
                alt="FamilyCircle Secure" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-[#D4AF37] hidden sm:block">
                FamilyCircle Secure
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="/" className="text-[#CCCCCC] hover:text-[var(--secondary-accent)] font-medium transition-colors">
                Home
              </a>
              
              {/* Forever Files Dropdown */}
              <div className="nav-item has-dropdown" id="forever-files">
                <button 
                  className="nav-trigger" 
                  aria-expanded="false" 
                  aria-controls="ff-menu"
                >
                  Forever Files
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>

                <div className="dropdown" id="ff-menu" role="menu" aria-labelledby="forever-files">
                  <div className="grid-2">
                    {foreverFilesCategories.map((category, index) => (
                      <a
                        key={index}
                        href={category.path}
                        className="item"
                        role="menuitem"
                      >
                        <span className="text-xl">{category.icon}</span>
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              
              <a href="/security" className="text-[#CCCCCC] hover:text-[var(--secondary-accent)] font-medium transition-colors">
                Security
              </a>
              <a href="/reviews" className="text-[#CCCCCC] hover:text-[var(--secondary-accent)] font-medium transition-colors">
                Reviews
              </a>
              <a href="/pricing" className="text-[#CCCCCC] hover:text-[var(--secondary-accent)] font-medium transition-colors">
                Pricing
              </a>
              
              {/* More Goodie Guides Dropdown */}
              <div className="nav-item has-dropdown" id="more-guides">
                <button 
                  className="nav-trigger" 
                  aria-expanded="false" 
                  aria-controls="more-guides-menu"
                >
                  More Goodie Guides
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>

                <div className="dropdown" id="more-guides-menu" role="menu" aria-labelledby="more-guides" style={{right: 0, left: 'auto'}}>
                  <div className="space-y-2">
                    {moreGoodieGuidesCategories.map((category, index) => (
                      <a
                        key={index}
                        href={category.path}
                        className="item"
                        role="menuitem"
                      >
                        <span className="text-xl">{category.icon}</span>
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/login" className="text-[#CCCCCC] hover:text-[var(--secondary-accent)] font-medium transition-colors">
              Login
            </a>
            <a
              href="/pricing"
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
              className="text-[#CCCCCC] hover:text-[var(--secondary-accent)]"
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
            <a href="/" className="block px-3 py-2 text-[#CCCCCC] hover:text-[var(--secondary-accent)] font-medium">
              Home
            </a>
            
            {/* Forever Files Mobile Dropdown */}
            <div>
              <button
                onClick={() => setIsForeverFilesMobileOpen(!isForeverFilesMobileOpen)}
                className="w-full text-left px-3 py-2 text-[#CCCCCC] hover:text-[var(--secondary-accent)] font-medium flex items-center justify-between"
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
                      className="flex items-center px-3 py-2 text-sm text-[#CCCCCC] hover:text-[var(--secondary-accent)] rounded"
                    >
                      <span className="text-base mr-2">{category.icon}</span>
                      {category.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            <a href="/security" className="block px-3 py-2 text-[#CCCCCC] hover:text-[var(--secondary-accent)] font-medium">
              Security
            </a>
            <a href="/reviews" className="block px-3 py-2 text-[#CCCCCC] hover:text-[var(--secondary-accent)] font-medium">
              Reviews
            </a>
            <a href="/pricing" className="block px-3 py-2 text-[#CCCCCC] hover:text-[var(--secondary-accent)] font-medium">
              Pricing
            </a>
            
            {/* More Goodie Guides Mobile Dropdown */}
            <div>
              <button
                onClick={() => setIsMoreGoodieGuidesMobileOpen(!isMoreGoodieGuidesMobileOpen)}
                className="w-full text-left px-3 py-2 text-[#CCCCCC] hover:text-[var(--secondary-accent)] font-medium flex items-center justify-between"
              >
                More Goodie Guides
                <ChevronDown className={`w-4 h-4 transition-transform ${isMoreGoodieGuidesMobileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isMoreGoodieGuidesMobileOpen && (
                <div className="ml-4 space-y-1 bg-[#111111] rounded-lg p-2">
                  {moreGoodieGuidesCategories.map((category, index) => (
                    <a
                      key={index}
                      href={category.path}
                      className="flex items-center px-3 py-2 text-sm text-[#CCCCCC] hover:text-[var(--secondary-accent)] rounded"
                    >
                      <span className="text-base mr-2">{category.icon}</span>
                      {category.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <hr className="my-2" />
            <a href="/login" className="block px-3 py-2 text-[#CCCCCC] hover:text-[var(--secondary-accent)] font-medium">
              Login
            </a>
            <a
              href="/pricing"
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
