import React, { useState, useEffect } from 'react';
import { Menu, X, Bell, User } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AssetPlus
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Welcome back to AssetPlus</p>
            </div>
          </div>

          {/* Right-aligned Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <Bell className="w-5 h-5 text-gray-600 hover:text-blue-600 transition-transform duration-200 hover:scale-110 cursor-pointer" />
            <User className="w-5 h-5 text-gray-600 hover:text-purple-600 transition-transform duration-200 hover:scale-110 cursor-pointer" />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
