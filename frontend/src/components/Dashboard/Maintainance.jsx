import React, { useState } from 'react';

const Maintenance = () => {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [maintenanceDate, setMaintenanceDate] = useState('');
  const [maintenanceTime, setMaintenanceTime] = useState('');
  const [maintenanceType, setMaintenanceType] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [serviceCost, setServiceCost] = useState('');
  const [partsUsed, setPartsUsed] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [nextServiceDate, setNextServiceDate] = useState('');
  const [assetStatus, setAssetStatus] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!selectedAsset || !maintenanceDate || !maintenanceTime || !maintenanceType || !technicianName || !serviceCost || !workDescription || !assetStatus) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create new maintenance record
    const newRecord = {
      id: Date.now(),
      assetTag: selectedAsset.split(' - ')[0],
      assetName: selectedAsset.split(' - ')[1]?.split(' (')[0] || 'Unknown Asset',
      maintenanceDate,
      maintenanceTime,
      technicianName,
      maintenanceType,
      serviceCost: parseFloat(serviceCost),
      partsUsed,
      workDescription,
      nextServiceDate,
      assetStatus,
      createdAt: new Date().toISOString()
    };

    // Add to history
    setMaintenanceHistory(prev => [newRecord, ...prev]);

    // Reset form
    setSelectedAsset('');
    setMaintenanceDate('');
    setMaintenanceTime('');
    setMaintenanceType('');
    setTechnicianName('');
    setServiceCost('');
    setPartsUsed('');
    setWorkDescription('');
    setNextServiceDate('');
    setAssetStatus('');

    setIsSubmitting(false);
    alert('Maintenance logged successfully!');
  };

  const MaintenanceHistoryComponent = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-6 animate-slideIn">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
          <span>📋</span>
          <span>Maintenance History</span>
        </h2>
        <button
          onClick={() => setShowHistory(false)}
          className="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200 hover:scale-105"
        >
          ✕ Close
        </button>
      </div>

      {maintenanceHistory.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🔧</div>
          <p className="text-lg">No maintenance records yet</p>
          <p className="text-sm">Create your first maintenance log to see it here</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center transform hover:scale-105 transition-transform duration-200">
              <h3 className="text-xl font-bold text-blue-900 animate-countUp">{maintenanceHistory.length}</h3>
              <p className="text-sm text-blue-700">Total Maintenance Logs</p>
            </div>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center transform hover:scale-105 transition-transform duration-200">
              <h3 className="text-xl font-bold text-green-900 animate-countUp">
                ₹{maintenanceHistory.reduce((total, log) => total + log.serviceCost, 0)}
              </h3>
              <p className="text-sm text-green-700">Total Cost</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center transform hover:scale-105 transition-transform duration-200">
              <h3 className="text-xl font-bold text-yellow-900 animate-countUp">
                {maintenanceHistory.filter(log => log.assetStatus === 'Needs Follow-up').length}
              </h3>
              <p className="text-sm text-yellow-700">Follow-up Needed</p>
            </div>
          </div>

          {/* Maintenance Records Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium">Asset</th>
                  <th className="px-4 py-3 font-medium">Date & Time</th>
                  <th className="px-4 py-3 font-medium">Technician</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Cost</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceHistory.map((log, index) => (
                  <tr 
                    key={log.id} 
                    className="border-b hover:bg-gray-50 transition-colors duration-200 animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{log.assetTag}</div>
                      <div className="text-xs text-gray-500">{log.assetName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{new Date(log.maintenanceDate).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{log.maintenanceTime}</div>
                    </td>
                    <td className="px-4 py-3">{log.technicianName}</td>
                    <td className="px-4 py-3">{log.maintenanceType}</td>
                    <td className="px-4 py-3">₹{log.serviceCost}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs transition-all duration-200 ${
                        log.assetStatus === 'Fully Operational'
                          ? 'bg-green-100 text-green-800'
                          : log.assetStatus === 'Needs Follow-up'
                          ? 'bg-yellow-100 text-yellow-800'
                          : log.assetStatus === 'Requires Replacement'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {log.assetStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="container">
    <div className="max-w-4xl mx-auto py-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6 animate-slideDown">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center space-x-2">
              <span className="animate-bounce">🔧</span>
              <span>Maintenance</span>
            </h1>
            <p className="text-gray-600 text-sm">Record repair activity and maintenance logs</p>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 transform"
          >
            <span>📋</span>
            <span>{showHistory ? 'Hide History' : 'View History'}</span>
          </button>
        </div>
      </div>

      {/* Show History if toggled */}
      {showHistory && <MaintenanceHistoryComponent />}

      {/* Main Card */}
      <div className="bg-white p-8 rounded-lg shadow-sm animate-slideUp">
        {/* Recording Info */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-6 transform hover:scale-[1.02] transition-transform duration-200">
          <h3 className="text-lg font-medium text-gray-800 mb-3">What to record in maintenance:</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-orange-500">•</span>
              <span>Asset details and identification</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-500">•</span>
              <span>Date and time of service</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-500">•</span>
              <span>Type of maintenance work performed</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-500">•</span>
              <span>Technician information</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-500">•</span>
              <span>Parts used and replaced</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-500">•</span>
              <span>Service cost and next due date</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Asset Selection */}
          <div className="animate-fadeIn">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Asset *
            </label>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300"
              required
            >
              <option value="">Choose an asset...</option>
              <option value="LAPTOP-001 - Dell Latitude 7420 (IT Dept)">LAPTOP-001 - Dell Latitude 7420 (IT Dept)</option>
              <option value="PRINTER-005 - HP LaserJet Pro (Sales)">PRINTER-005 - HP LaserJet Pro (Sales)</option>
              <option value="MONITOR-012 - Samsung 24 Display (Marketing)">MONITOR-012 - Samsung 24" Display (Marketing)</option>
              <option value="DESK-008 - Ergonomic Office Desk (HR)">DESK-008 - Ergonomic Office Desk (HR)</option>
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4 animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Date *
              </label>
              <input
                type="date"
                value={maintenanceDate}
                onChange={(e) => setMaintenanceDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                value={maintenanceTime}
                onChange={(e) => setMaintenanceTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300"
                required
              />
            </div>
          </div>

          {/* Maintenance Type */}
          <div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maintenance Type *
            </label>
            <select
              value={maintenanceType}
              onChange={(e) => setMaintenanceType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300"
              required
            >
              <option value="">Select maintenance type...</option>
              <option value="Routine Inspection">Routine Inspection</option>
              <option value="Repair Work">Repair Work</option>
              <option value="Cleaning Service">Cleaning Service</option>
              <option value="Parts Replacement">Parts Replacement</option>
              <option value="Software Update">Software Update</option>
              <option value="Calibration">Calibration</option>
            </select>
          </div>

          {/* Technician and Cost */}
          <div className="grid grid-cols-2 gap-4 animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technician Name *
              </label>
              <input
                type="text"
                value={technicianName}
                onChange={(e) => setTechnicianName(e.target.value)}
                placeholder="Enter technician name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Cost *
              </label>
              <input
                type="number"
                value={serviceCost}
                onChange={(e) => setServiceCost(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300"
                required
              />
            </div>
          </div>

          {/* Parts Used */}
          <div className="animate-fadeIn" style={{ animationDelay: '400ms' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parts Used
            </label>
            <textarea
              value={partsUsed}
              onChange={(e) => setPartsUsed(e.target.value)}
              placeholder="List any parts that were replaced or used during maintenance..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200 hover:border-orange-300"
            />
          </div>

          {/* Work Description */}
          <div className="animate-fadeIn" style={{ animationDelay: '500ms' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Description *
            </label>
            <textarea
              value={workDescription}
              onChange={(e) => setWorkDescription(e.target.value)}
              placeholder="Describe the maintenance work performed..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200 hover:border-orange-300"
              required
            />
          </div>

          {/* Next Service Date */}
          <div className="animate-fadeIn" style={{ animationDelay: '600ms' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next Service Due
            </label>
            <input
              type="date"
              value={nextServiceDate}
              onChange={(e) => setNextServiceDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300"
            />
          </div>

          {/* Asset Status */}
          <div className="animate-fadeIn" style={{ animationDelay: '700ms' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asset Status After Service *
            </label>
            <select
              value={assetStatus}
              onChange={(e) => setAssetStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300"
              required
            >
              <option value="">Select status...</option>
              <option value="Fully Operational">Fully Operational</option>
              <option value="Needs Follow-up">Needs Follow-up</option>
              <option value="Requires Replacement">Requires Replacement</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4 animate-fadeIn" style={{ animationDelay: '800ms' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 transform disabled:scale-100"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Logging...</span>
                </>
              ) : (
                <>
                  <span>🔧</span>
                  <span>Log Maintenance</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes countUp {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.6s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-countUp {
          animation: countUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Maintenance;