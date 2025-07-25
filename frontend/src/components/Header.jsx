import { Link } from "react-router-dom";
import { useState } from "react";
import ButtonAnimatedGradient from "../ui/Signin";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("/"); // Track active section

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setIsMenuOpen(false); // Close mobile menu when section is clicked
  };

  // Function to get link classes based on active state
  const getLinkClasses = (section) => {
    const baseClasses = "text-gray-700 hover:text-blue-600 transition-all duration-300 relative";
    const activeClasses = activeSection === section 
      ? "text-blue-600 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[3px] after:bg-blue-600 after:rounded-full" 
      : "";
    return `${baseClasses} ${activeClasses}`;
  };

  // Mobile link classes
  const getMobileLinkClasses = (section) => {
    const baseClasses = "text-gray-700 hover:text-blue-600 py-2 text-lg transition-all duration-300 relative";
    const activeClasses = activeSection === section 
      ? "text-blue-600 after:content-[''] after:absolute after:bottom-[4px] after:left-0 after:w-full after:h-[3px] after:bg-blue-600 after:rounded-full" 
      : "";
    return `${baseClasses} ${activeClasses}`;
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-600 rounded-md" />
          <span className="font-bold text-xl text-gray-800">AssetPlus</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-lg">
          <Link 
            to="/" 
            className={getLinkClasses("/")}
            onClick={() => handleSectionClick("/")}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={getLinkClasses("/about")}
            onClick={() => handleSectionClick("/about")}
          >
            About
          </Link>
          <Link 
            to="/pricing" 
            className={getLinkClasses("/pricing")}
            onClick={() => handleSectionClick("/pricing")}
          >
            Pricing
          </Link>
          <Link 
            to="/contact" 
            className={getLinkClasses("/contact")}
            onClick={() => handleSectionClick("/contact")}
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Sign Up Button */}
        <div className="hidden md:flex gap-2">
          <Link className="text-gray-700 hover:text-blue-600" to="/signup">
            <ButtonAnimatedGradient/>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white border-t shadow-lg transition-all duration-300 ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <nav className="flex flex-col px-6 py-4 space-y-4">
          <Link 
            to="/" 
            className={getMobileLinkClasses("/")}
            onClick={() => handleSectionClick("/")}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={getMobileLinkClasses("/about")}
            onClick={() => handleSectionClick("/about")}
          >
            About
          </Link>
          <Link 
            to="/pricing" 
            className={getMobileLinkClasses("/pricing")}
            onClick={() => handleSectionClick("/pricing")}
          >
            Pricing
          </Link>
          <Link 
            to="/contact" 
            className={getMobileLinkClasses("/contact")}
            onClick={() => handleSectionClick("/contact")}
          >
            Contact
          </Link>
          <div className="pt-2 border-t border-gray-200">
            <Link 
              to="/signup" 
              className="inline-block"
              onClick={() => setIsMenuOpen(false)}
            >
              <ButtonAnimatedGradient/>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}