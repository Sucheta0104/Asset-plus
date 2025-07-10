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
    { name: 'Maintenance', icon: Wrench, path: '/dashboard/maintenance', end: true },
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 text-white rounded-lg shadow-lg hover:bg-slate-700 transition-colors duration-200"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
 
      {/* Mobile Overlay (for when menu is open) */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={toggleMobileMenu}
        />
      )}
 
      {/* Sidebar Container */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64
          bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          shadow-xl lg:shadow-none
        `}
      >
        {/* Main Menu Header */}
        <nav className="p-4 space-y-2">
          <h1 className="text-xl font-bold text-white mb-4">
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
                  ${isActive // Apply active styles based on NavLink's isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg transform scale-105'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white hover:transform hover:scale-102'}
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
                          ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}
                        `}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
 
                    <ChevronRight
                      className={`
                        w-4 h-4 transition-all duration-200
                        ${isActive
                          ? 'text-white opacity-100'
                          : 'text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-white'}
                      `}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
 
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="text-center">
            <p className="text-slate-500 text-sm">© 2024 AssetPlus</p>
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