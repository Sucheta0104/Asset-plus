import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        {/* <main className="flex-1 p-4 md:p-6 ml-0 lg:ml-64 transition-all duration-300">
        </main> */}
                  <Outlet />

      </div>
    </div>
  );
};

export default DashboardLayout;