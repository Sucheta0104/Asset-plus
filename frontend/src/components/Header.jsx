import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ButtonAnimatedGradient from "../ui/Signin";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
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
    const baseClasses = "text-gray-700 hover:text-blue-600 transition-all duration-300 relative";
    const activeClasses = location.pathname === path 
      ? "text-blue-600 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[3px] after:bg-blue-600 after:rounded-full" 
      : "";
    return `${baseClasses} ${activeClasses}`;
  };

  // Mobile link classes
  const getMobileLinkClasses = (path) => {
    const baseClasses = "text-gray-700 hover:text-blue-600 py-2 text-lg transition-all duration-300 relative block";
    const activeClasses = location.pathname === path 
      ? "text-blue-600 after:content-[''] after:absolute after:bottom-[4px] after:left-0 after:w-full after:h-[3px] after:bg-blue-600 after:rounded-full" 
      : "";
    return `${baseClasses} ${activeClasses}`;
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-950 rounded-md" />
          <span className="font-bold text-xl text-gray-800">AssetPlus</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-22 text-lg">
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
        <div className="hidden md:flex gap-2">
          <Link to="/signup" className="text-gray-700 hover:text-blue-950">
            <ButtonAnimatedGradient/>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 z-10"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={handleMobileMenuClick}
        />
      )}

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white border-t shadow-lg transition-all duration-300 overflow-hidden z-50 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="flex flex-col px-6 py-4 space-y-2">
          <Link 
            to="/" 
            className={getMobileLinkClasses("/")}
            onClick={handleMobileMenuClick}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={getMobileLinkClasses("/about")}
            onClick={handleMobileMenuClick}
          >
            About
          </Link>
          <Link 
            to="/pricing" 
            className={getMobileLinkClasses("/pricing")}
            onClick={handleMobileMenuClick}
          >
            Pricing
          </Link>
          <Link 
            to="/contact" 
            className={getMobileLinkClasses("/contact")}
            onClick={handleMobileMenuClick}
          >
            Contact
          </Link>
          <div className="pt-4 border-t border-gray-200 mt-2">
            <Link 
              to="/signup" 
              className="inline-block"
              onClick={handleMobileMenuClick}
            >
              <ButtonAnimatedGradient/>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}