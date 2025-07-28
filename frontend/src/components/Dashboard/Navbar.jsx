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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}
    >
      <div className="h-full w-full flex items-center justify-between px-4 sm:px-6 lg:px-2 ml-0 py-0">
        {/* Left side - Logo */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h1 className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
            AssetPlus
          </h1>
        </div>

        {/* Right side - Icons */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-all duration-200">
            <Bell className="w-5 h-5" />
          </button>
          <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200">
            <User className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
