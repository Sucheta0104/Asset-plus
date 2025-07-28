import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink for navigation
import {
  LayoutDashboard,
  Package,
  UserCheck,
  Wrench,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  Building2 // New icon for Vendor
} from 'lucide-react';
 
const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 
  // Define menu items with their full paths and an 'end' property
  // 'end: false' means the link is active if the URL starts with the path (e.g., /dashboard for /dashboard/assets)
  // 'end: true' means the link is active only if the URL is an exact match
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', end: false },
    { name: 'Assets', icon: Package, path: '/dashboard/assets', end: true },
    { name: 'Assignment', icon: UserCheck, path: '/dashboard/assignment', end: true },
    { name: 'Vendor', icon: Building2, path: '/dashboard/vendor', end: true },
    { name: 'Maintainance', icon: Wrench, path: '/dashboard/maintainance', end: true },
    { name: 'Reports', icon: BarChart3, path: '/dashboard/reports', end: true }
  ];
 
  // Toggles the mobile menu open/close state
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
 
  // Closes the mobile menu when a menu item is clicked
  const handleItemClick = () => {
    setIsMobileMenuOpen(false);
  };
 
  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow hover:bg-blue-50 transition-colors duration-200 border border-blue-200"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
      </button>
 
      {/* Mobile Overlay (for when menu is open) */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 backdrop-blur-sm"
          onClick={toggleMobileMenu}
        />
      )}
 
      {/* Sidebar Container */}
      <div
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 w-64
          bg-white shadow-lg border-r border-blue-100
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
        `}
      >
        {/* Main Menu Header */}
        <nav className="p-4 space-y-2">
          <h1 className="text-xl font-bold text-gray-900 mb-4 px-2">
            Main Menu
          </h1>
 
          {/* Map through menu items to create NavLinks */}
          {menuItems.map((item, index) => {
            const Icon = item.icon; // Lucide icon component
 
            return (
              <NavLink
                key={item.name}
                to={item.path} // Destination path for the link
                onClick={handleItemClick} // Close mobile menu on click
                end={item.end} // Control exact matching for active state
                // NavLink's className prop receives an object with 'isActive'
                className={({ isActive }) => `
                  w-full flex items-center justify-between px-3 py-3 rounded-lg text-left
                  transition-all duration-200 ease-in-out group
                  ${isActive
                    ? 'bg-blue-100 text-blue-900 font-medium transform scale-[1.02]'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'}
                  animate-fadeIn
                `}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* Content inside NavLink (Icon and text) */}
                {({ isActive }) => ( // This inner render prop is not strictly necessary here,
                                     // but it explicitly shows 'isActive' is available for children.
                                     // The outer 'isActive' from the NavLink's className prop is sufficient.
                  <>
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`
                          w-5 h-5 transition-all duration-200
                          ${isActive ? 'text-blue-900' : 'text-gray-600 group-hover:text-blue-700'}
                        `}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
 
                    <ChevronRight
                      className={`
                        w-4 h-4 transition-all duration-200
                        ${isActive
                          ? 'text-blue-900 opacity-100'
                          : 'text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-blue-700'}
                      `}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
 
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-100">
          <div className="text-center">
            <p className="text-gray-600 text-sm">© 2025 AssetPlus</p>
          </div>
        </div>
      </div>
 
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
 
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </>
  );
};
 
export default Sidebar;