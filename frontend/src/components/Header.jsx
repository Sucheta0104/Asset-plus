import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  
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
    const baseClasses = "text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium text-sm px-3 py-2 rounded-lg";
    const activeClasses = location.pathname === path 
      ? "text-blue-600 bg-blue-50" 
      : "";
    return `${baseClasses} ${activeClasses}`;
  };

  // Mobile link classes
  const getMobileLinkClasses = (path) => {
    const baseClasses = "text-gray-700 hover:text-blue-600 py-3 px-4 text-sm transition-colors duration-200 block rounded-lg hover:bg-gray-50 font-medium";
    const activeClasses = location.pathname === path 
      ? "text-blue-600 bg-blue-50" 
      : "";
    return `${baseClasses} ${activeClasses}`;
  };

  const handleLogout = () => {
    setShowProfileDropdown(false);
    logout();
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-white shadow-sm border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
          {/* AssetPlus Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              AssetPlus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex gap-2">
              <Link to="/" className={getLinkClasses("/")}>
                Home
              </Link>
              <Link to="/about" className={getLinkClasses("/about")}>
                About
              </Link>
              <Link to="/pricing" className={getLinkClasses("/pricing")}>
                Pricing
              </Link>
              <Link to="/contact" className={getLinkClasses("/contact")}>
                Contact
              </Link>
              {isAuthenticated && (
                <Link to="/dashboard" className={getLinkClasses("/dashboard")}>
                  Dashboard
                </Link>
              )}
            </nav>

            {/* Desktop Authentication */}
            {isAuthenticated ? (
              <div className="relative">
                <div 
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  onMouseEnter={() => setShowProfileDropdown(true)}
                  onMouseLeave={() => setShowProfileDropdown(false)}
                >
                  <FaUserCircle className="text-gray-600 text-2xl" />
                  <span className="text-gray-700 font-medium text-sm">
                    {user?.fullName || 'User'}
                  </span>
                  
                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.fullName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link 
                to="/signin" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
              isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
            }`}></span>
            <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 my-1 ${
              isMenuOpen ? 'opacity-0' : ''
            }`}></span>
            <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
              isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={handleMobileMenuClick}
        />
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 w-full bg-white border-b border-gray-200 shadow-lg z-50 md:hidden transition-all duration-300 ${
        isMenuOpen 
          ? 'translate-y-[60px] opacity-100 visible' 
          : '-translate-y-2 opacity-0 invisible'
      }`}>
        <nav className="flex flex-col px-4 py-4">
          <Link to="/" className={getMobileLinkClasses("/")} onClick={handleMobileMenuClick}>
            Home
          </Link>
          <Link to="/about" className={getMobileLinkClasses("/about")} onClick={handleMobileMenuClick}>
            About
          </Link>
          <Link to="/pricing" className={getMobileLinkClasses("/pricing")} onClick={handleMobileMenuClick}>
            Pricing
          </Link>
          <Link to="/contact" className={getMobileLinkClasses("/contact")} onClick={handleMobileMenuClick}>
            Contact
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className={getMobileLinkClasses("/dashboard")} onClick={handleMobileMenuClick}>
              Dashboard
            </Link>
          )}
          
          {/* Mobile Authentication */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-2">
                  <FaUserCircle className="text-gray-600 text-xl" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user?.fullName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    handleMobileMenuClick();
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/signin" 
                className="block w-full text-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors duration-200"
                onClick={handleMobileMenuClick}
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}