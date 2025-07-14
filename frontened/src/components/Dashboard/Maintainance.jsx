import React, { useState } from 'react';

const Maintenance = () => {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [maintenanceDate, setMaintenanceDate] = useState('2024-07-09');
  const [maintenanceTime, setMaintenanceTime] = useState('09:30');
  const [maintenanceType, setMaintenanceType] = useState('Routine Inspection');
  const [technicianName, setTechnicianName] = useState('');
  const [serviceCost, setServiceCost] = useState('');
  const [partsUsed, setPartsUsed] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [nextServiceDate, setNextServiceDate] = useState('');
  const [assetStatus, setAssetStatus] = useState('Fully Operational');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="container">
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-bounce">
            <div className="flex items-center space-x-2">
              <span>✅</span>
              <span>Maintenance logged successfully!</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6 transform transition-all duration-300 hover:shadow-md">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl sm:text-3xl animate-pulse">🔧</span>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Maintenance</h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">Record repair activity and maintenance logs</p>
        </div>

        {/* Main Card */}
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm transform transition-all duration-300 hover:shadow-md">
          {/* Recording Info */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 p-4 sm:p-6 rounded-lg mb-6 transform transition-all duration-300 hover:shadow-sm">
            <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-3 flex items-center">
              <span className="mr-2">📋</span>
              What to record in maintenance:
            </h3>
            <div className="text-sm sm:text-base text-gray-700 space-y-2">
              <div className="flex items-center transform transition-all duration-300 hover:translate-x-1">
                <span className="mr-2">•</span>
                <span>Asset details and identification</span>
              </div>
              <div className="flex items-center transform transition-all duration-300 hover:translate-x-1">
                <span className="mr-2">•</span>
                <span>Date and time of service</span>
              </div>
              <div className="flex items-center transform transition-all duration-300 hover:translate-x-1">
                <span className="mr-2">•</span>
                <span>Type of maintenance work performed</span>
              </div>
              <div className="flex items-center transform transition-all duration-300 hover:translate-x-1">
                <span className="mr-2">•</span>
                <span>Technician information</span>
              </div>
              <div className="flex items-center transform transition-all duration-300 hover:translate-x-1">
                <span className="mr-2">•</span>
                <span>Parts used and replaced</span>
              </div>
              <div className="flex items-center transform transition-all duration-300 hover:translate-x-1">
                <span className="mr-2">•</span>
                <span>Service cost and next due date</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Asset Selection */}
            <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Asset
              </label>
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
              >
                <option value="">Choose an asset...</option>
                <option value="laptop-001">LAPTOP-001 - Dell Latitude 7420 (IT Dept)</option>
                <option value="printer-005">PRINTER-005 - HP LaserJet Pro (Sales)</option>
                <option value="monitor-012">MONITOR-012 - Samsung 24" Display (Marketing)</option>
                <option value="desk-008">DESK-008 - Ergonomic Office Desk (HR)</option>
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maintenance Date
                </label>
                <input
                  type="date"
                  value={maintenanceDate}
                  onChange={(e) => setMaintenanceDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                />
              </div>
              <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={maintenanceTime}
                  onChange={(e) => setMaintenanceTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                />
              </div>
            </div>

            {/* Maintenance Type */}
            <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Type
              </label>
              <select
                value={maintenanceType}
                onChange={(e) => setMaintenanceType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
              >
                <option>Routine Inspection</option>
                <option>Repair Work</option>
                <option>Cleaning Service</option>
                <option>Parts Replacement</option>
                <option>Software Update</option>
                <option>Calibration</option>
              </select>
            </div>

            {/* Technician and Cost */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technician Name
                </label>
                <input
                  type="text"
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  placeholder="Enter technician name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-gray-400 focus:scale-105"
                />
              </div>
              <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Cost
                </label>
                <input
                  type="number"
                  value={serviceCost}
                  onChange={(e) => setServiceCost(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-gray-400 focus:scale-105"
                />
              </div>
            </div>

            {/* Parts Used */}
            <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parts Used
              </label>
              <textarea
                value={partsUsed}
                onChange={(e) => setPartsUsed(e.target.value)}
                placeholder="List any parts that were replaced or used during maintenance..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-300 hover:border-gray-400 focus:scale-105"
              />
            </div>

            {/* Work Description */}
            <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Description
              </label>
              <textarea
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                placeholder="Describe the maintenance work performed..."
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-300 hover:border-gray-400 focus:scale-105"
              />
            </div>

            {/* Next Service Date */}
            <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Service Due
              </label>
              <input
                type="date"
                value={nextServiceDate}
                onChange={(e) => setNextServiceDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
              />
            </div>

            {/* Asset Status */}
            <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset Status After Service
              </label>
              <select
                value={assetStatus}
                onChange={(e) => setAssetStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
              >
                <option>Fully Operational</option>
                <option>Needs Follow-up</option>
                <option>Requires Replacement</option>
                <option>Out of Service</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full sm:w-auto bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-md font-medium transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 hover:shadow-lg ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg">🔧</span>
                    <span>Log Maintenance</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Maintenance;