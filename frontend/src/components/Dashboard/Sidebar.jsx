import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  UserCheck,
  Wrench,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  Building2,
  ArrowLeft
} from 'lucide-react';

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Add navigation handler
  const handleBackToHome = () => {
    navigate('/');
  };

  // Define menu items with their full paths and an 'end' property
  // 'end: true' means the link is active only if the URL is an exact match
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', end: true },
    { name: 'Assets', icon: Package, path: '/dashboard/assets', end: false },
    { name: 'Assignment', icon: UserCheck, path: '/dashboard/assignment', end: false },
    { name: 'Vendor', icon: Building2, path: '/dashboard/vendor', end: false },
    { name: 'Maintainance', icon: Wrench, path: '/dashboard/maintainance', end: false },
    { name: 'Reports', icon: BarChart3, path: '/dashboard/reports', end: false }
  ];

  // Toggles the mobile menu open/close state
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Closes the mobile menu when a menu item is clicked
  const handleItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Custom NavLink style function
  const getNavLinkClass = ({ isActive }) => {
    return `w-full flex items-center justify-between px-3 py-3 rounded-lg
           transition-all duration-200 ease-in-out
           ${isActive
             ? 'bg-blue-100 text-blue-900 font-medium'
             : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`;
  };

  // Custom ChevronRight style function
  const getChevronClass = (isActive) => {
    return `w-4 h-4 transition-opacity duration-200
           ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`;
  };

  return (
    <>
      {/* Updated Mobile Menu Toggle Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white hover:bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5 text-gray-700" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Updated Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Updated Sidebar Container */}
      <div
        className={`
          fixed top-0 left-0 h-screen z-40 w-64 sm:w-72
          bg-white shadow-lg border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
          pt-16 lg:pt-20
        `}
      >
        {/* Main Menu Header */}
        <nav className="px-4 py-2">
          {/* Updated Main Menu Header with Back Arrow */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToHome}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
              <h1 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Main Menu
              </h1>
            </div>
            {/* Add Close button for mobile */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={handleItemClick}
                  end={item.end}
                  className={getNavLinkClass}
                >
                  {({ isActive }) => (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <ChevronRight className={getChevronClass(isActive)} />
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Footer - Updated positioning */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <p className="text-gray-600 text-sm text-center">© 2025 AssetPlus</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;