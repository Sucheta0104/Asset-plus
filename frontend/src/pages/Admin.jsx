import React, { useState } from 'react';
import { X, User, Mail, Phone, Calendar, Shield, Edit, LogOut, AlertTriangle } from 'lucide-react';

export default function AdminProfilePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  // Admin data - replace with actual data
  const adminData = {
    name: "",
    email: "",
    phone: "",
    dateJoined: "",
    role: "Administrator",
    avatar: "https://via.placeholder.com/150/6366f1/white?text=Admin"
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Here you would typically:
    // 1. Clear authentication tokens
    // 2. Clear user session data
    // 3. Redirect to login page
    // 4. Make API call to invalidate session
    
    // For demo purposes, we'll just close the popup and show an alert
    setIsSigningOut(false);
    setShowSignOutConfirm(false);
    setIsOpen(false);
    
    // In a real app, you might redirect to login page:
    // window.location.href = '/login';
    // or use your router: navigate('/login');
    
    console.log('User signed out successfully');
  };

  const confirmSignOut = () => {
    setShowSignOutConfirm(true);
  };

  const cancelSignOut = () => {
    setShowSignOutConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
      >
        <User size={20} />
        View Admin Profile
      </button>

      {/* Popup Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-in fade-in duration-300 scale-95 animate-in">
            {/* Header with Close Button */}
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl p-6 text-white">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
              >
                <X size={20} />
              </button>
              
              {/* Profile Header */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={adminData.avatar}
                    alt="Admin Avatar"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-1">{adminData.name}</h2>
                <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  <Shield size={14} />
                  <span className="text-sm font-medium">{adminData.role}</span>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Contact Information
                </h3>
                
                {/* Email */}
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-gray-900 truncate">{adminData.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone size={18} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                    <p className="text-gray-900">{adminData.phone}</p>
                  </div>
                </div>

                {/* Date Joined */}
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar size={18} className="text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600">Date Joined</p>
                    <p className="text-gray-900">{adminData.dateJoined}</p>
                  </div>
                </div>
              </div>

              {/* Account Security Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Account Security
                </h3>
                
                {/* Sign Out Option */}
                <div className="flex items-center gap-4 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-200">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <LogOut size={18} className="text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600">Session Management</p>
                    <p className="text-gray-900 text-sm">Sign out from all devices</p>
                  </div>
                  <button
                    onClick={confirmSignOut}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                  <Edit size={16} />
                  Edit Profile
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Dialog */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 transform animate-in fade-in duration-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Sign Out</h3>
                  <p className="text-sm text-gray-600">Are you sure you want to sign out?</p>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-6">
                You will be signed out from all devices and redirected to the login page.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isSigningOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Signing Out...
                    </>
                  ) : (
                    <>
                      <LogOut size={16} />
                      Sign Out
                    </>
                  )}
                </button>
                <button
                  onClick={cancelSignOut}
                  disabled={isSigningOut}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}