import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ButtonAnimatedGradient from "../ui/Signin";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMobileMenuClick = (item = null) => {
    if (item) {
      setClickedItem(item);
      // Reset click animation after a short delay
      setTimeout(() => setClickedItem(null), 200);
    }
    setIsMenuOpen(false);
  };

  // Function to get link classes based on active state
  const getLinkClasses = (path) => {
    const baseClasses = "text-gray-700 hover:text-blue-600 transition-all duration-300 relative";
    const activeClasses = location.pathname === path 
      ? "text-blue-600 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[3px] after:bg-blue-600 after:rounded-full" 
      : "";
    return `${baseClasses} ${activeClasses}`;
  };

  // Enhanced mobile link classes with click animations (updated for white background)
  const getMobileLinkClasses = (path, itemName) => {
    const baseClasses = "relative block text-xl font-medium px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105";
    const isActive = location.pathname === path;
    const isClicked = clickedItem === itemName;
    
    let statusClasses = "";
    if (isActive) {
      statusClasses = "text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg";
    } else if (isClicked) {
      statusClasses = "text-white bg-gradient-to-r from-green-400 to-blue-500 scale-95";
    } else {
      statusClasses = "text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-500 hover:shadow-md";
    }
    
    return `${baseClasses} ${statusClasses}`;
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-lg z-50 border-b border-gray-200/20">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 hover:scale-105">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-950 rounded-md shadow-md" />
          <span className="font-bold text-xl text-gray-800">AssetPlus</span>
        </Link>

        {/* Right side container for navigation and button */}
        <div className="hidden md:flex items-center gap-8">
          {/* Desktop Navigation */}
          <nav className="flex gap-8 text-lg">
            <Link 
              to="/" 
              className={getLinkClasses("/")}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={getLinkClasses("/about")}
            >
              About
            </Link>
            <Link 
              to="/pricing" 
              className={getLinkClasses("/pricing")}
            >
              Pricing
            </Link>
            <Link 
              to="/contact" 
              className={getLinkClasses("/contact")}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Sign Up Button */}
          <Link to="/signup" className="text-gray-700 hover:text-blue-950 transition-colors duration-300">
            <ButtonAnimatedGradient/>
          </Link>
        </div>

        {/* Enhanced Mobile Menu Toggle Button */}
        <button 
          className={`md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg space-y-1 z-50 transition-all duration-300 hover:bg-gray-100/50 ${
            isMenuOpen ? 'bg-white/20 backdrop-blur-sm' : ''
          }`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
            isMenuOpen ? 'rotate-45 translate-y-2 bg-white' : ''
          }`}></span>
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
            isMenuOpen ? 'opacity-0' : ''
          }`}></span>
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
            isMenuOpen ? '-rotate-45 -translate-y-2 bg-white' : ''
          }`}></span>
        </button>
      </div>

      {/* Enhanced Mobile Menu Overlay with animated blur */}
      <div 
        className={`fixed inset-0 transition-all duration-500 ease-out z-40 md:hidden ${
          isMenuOpen 
            ? 'bg-black/30 backdrop-blur-md opacity-100 pointer-events-auto' 
            : 'bg-black/0 backdrop-blur-none opacity-0 pointer-events-none'
        }`}
        onClick={() => handleMobileMenuClick()}
      />

      {/* Enhanced Mobile Menu with white background and staggered animations */}
      <div className={`md:hidden fixed top-0 right-0 h-screen w-80 max-w-[85vw] transition-all duration-500 ease-out transform z-50 ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* White background with blur effect */}
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xl border-l border-gray-200/50 shadow-2xl" />
        
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20" />
        
        {/* Close Button */}
        <button 
          onClick={toggleMenu}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 z-50"
          aria-label="Close menu"
        >
          <svg 
            className="w-6 h-6 text-gray-700" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
        
        {/* Menu content */}
        <div className="relative h-full flex flex-col pt-20 pb-8 px-6 overflow-y-auto">
          {/* Navigation Links with staggered animation */}
          <div className="flex-1 flex flex-col space-y-4">
            {[
              { path: "/", name: "Home", delay: "delay-100" },
              { path: "/about", name: "About", delay: "delay-200" },
              { path: "/pricing", name: "Pricing", delay: "delay-300" },
              { path: "/contact", name: "Contact", delay: "delay-400" }
            ].map((item, index) => (
              <div
                key={item.name}
                className={`transform transition-all duration-500 ${
                  isMenuOpen 
                    ? `translate-x-0 opacity-100 ${item.delay}` 
                    : 'translate-x-8 opacity-0'
                }`}
              >
                <Link 
                  to={item.path}
                  className={getMobileLinkClasses(item.path, item.name)}
                  onClick={() => handleMobileMenuClick(item.name)}
                >
                  <span className="flex items-center justify-between">
                    {item.name}
                    {location.pathname === item.path && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </span>
                  
                  {/* Hover effect indicator (updated for white background) */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-gray-100/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </div>
            ))}
          </div>
          
          {/* Sign Up Button with enhanced styling (updated for white background) */}
          <div className={`mt-8 pt-6 border-t border-gray-200/50 transform transition-all duration-700 ${
            isMenuOpen 
              ? 'translate-x-0 opacity-100 delay-500' 
              : 'translate-x-8 opacity-0'
          }`}>
            <Link 
              to="/signup" 
              className="block w-full"
              onClick={() => handleMobileMenuClick('signup')}
            >
              <div className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                clickedItem === 'signup' ? 'scale-95' : 'hover:scale-105'
              }`}>
                <ButtonAnimatedGradient className="w-full justify-center py-4 text-lg font-semibold"/>
                
                {/* Click ripple effect */}
                {clickedItem === 'signup' && (
                  <div className="absolute inset-0 bg-blue-500/20 rounded-xl animate-ping" />
                )}
              </div>
            </Link>
          </div>
          
          {/* Decorative elements (updated colors for white background) */}
          <div className={`mt-6 flex justify-center space-x-2 transform transition-all duration-700 ${
            isMenuOpen 
              ? 'translate-x-0 opacity-100 delay-700' 
              : 'translate-x-8 opacity-0'
          }`}>
            {[0, 1, 2].map((dot, index) => (
              <div 
                key={dot}
                className={`w-1.5 h-1.5 bg-gray-400/60 rounded-full animate-pulse`}
                style={{ animationDelay: `${index * 200}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}