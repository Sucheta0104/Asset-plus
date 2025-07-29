import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ButtonAnimatedGradient from "../ui/Signin.jsx";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMobileMenuClick = () => {
    setIsMenuOpen(false);
  };

  // Function to get link classes based on active state
  const getLinkClasses = (path) => {
    const baseClasses = "text-gray-700 hover:text-blue-600 transition-all duration-300 relative font-medium";
    const activeClasses = location.pathname === path 
      ? "text-blue-600 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-blue-500 after:to-blue-600 after:rounded-full after:shadow-sm" 
      : "hover:after:content-[''] hover:after:absolute hover:after:bottom-[-4px] hover:after:left-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-blue-400 hover:after:rounded-full hover:after:opacity-50";
    return `${baseClasses} ${activeClasses}`;
  };

  // Mobile link classes with enhanced animations
  const getMobileLinkClasses = (path) => {
    const baseClasses = "text-gray-700 hover:text-blue-600 py-3 px-4 text-lg transition-all duration-300 relative block rounded-lg hover:bg-blue-50 group";
    const activeClasses = location.pathname === path 
      ? "text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 shadow-sm" 
      : "";
    return `${baseClasses} ${activeClasses}`;
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-white shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-4">
          {/* Logo with enhanced styling */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group">
            <div className="w-9 h-9 bg-gradient-to-br from-green-400 via-blue-500 to-blue-950 rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              AssetPlus
            </span>
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
            className={`md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg transition-all duration-300 relative z-[60] ${
              isMenuOpen 
                ? 'bg-blue-50 border border-blue-200' 
                : 'hover:bg-gray-50 active:bg-gray-100'
            }`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
              isMenuOpen ? 'rotate-45 translate-y-2 bg-blue-600' : ''
            }`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 my-1 ${
              isMenuOpen ? 'opacity-0' : ''
            }`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
              isMenuOpen ? '-rotate-45 -translate-y-2 bg-blue-600' : ''
            }`}></span>
          </button>
        </div>
      </header>

      {/* Enhanced Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleMobileMenuClick}
        />
      )}

      {/* Enhanced Mobile Menu */}
      <div className={`fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xl z-50 md:hidden transition-all duration-300 transform ${
        isMenuOpen 
          ? 'translate-y-[73px] opacity-100 visible' 
          : '-translate-y-2 opacity-0 invisible'
      }`}>
        {/* Decorative gradient bar */}
        <div className="h-1 bg-gradient-to-r from-green-400 via-blue-500 to-blue-950"></div>
        
        <nav className="flex flex-col px-4 py-6 space-y-1">
          {/* Mobile navigation links with staggered animation */}
          {[
            { path: '/', label: 'Home', delay: '0ms' },
            { path: '/about', label: 'About', delay: '50ms' },
            { path: '/pricing', label: 'Pricing', delay: '100ms' },
            { path: '/contact', label: 'Contact', delay: '150ms' }
          ].map((item, index) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`${getMobileLinkClasses(item.path)} ${
                isMenuOpen 
                  ? 'translate-x-0 opacity-100' 
                  : '-translate-x-4 opacity-0'
              }`}
              style={{ 
                transitionDelay: isMenuOpen ? item.delay : '0ms',
                transitionDuration: '300ms' 
              }}
              onClick={handleMobileMenuClick}
            >
              <span className="flex items-center justify-between">
                {item.label}
                {location.pathname === item.path && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full shadow-sm animate-pulse"></div>
                )}
              </span>
            </Link>
          ))}
          
          {/* Mobile Sign Up Button with enhanced styling */}
          <div className={`pt-6 mt-4 border-t border-gray-200 transition-all duration-300 ${
            isMenuOpen 
              ? 'translate-x-0 opacity-100' 
              : '-translate-x-4 opacity-0'
          }`}
          style={{ 
            transitionDelay: isMenuOpen ? '200ms' : '0ms' 
          }}>
            <Link 
              to="/signup" 
              className="inline-block w-full"
              onClick={handleMobileMenuClick}
            >
              <div className="w-full flex justify-center py-2">
                <ButtonAnimatedGradient/>
              </div>
            </Link>
          </div>
        </nav>

        {/* Decorative bottom element */}
        <div className="px-4 pb-4">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>
      </div>
    </>
  );
}