import React, { useState } from 'react';
import { Package, Users, Wrench, Plus, UserPlus, FileText, Settings } from 'lucide-react';

export default function ITAssetDashboard() {
  const [assets, setAssets] = useState([]);
  const [departments, setDepartments] = useState([
    { name: 'IT Department', color: 'bg-blue-500', assets: 0 },
    { name: 'Sales', color: 'bg-green-500', assets: 0 },
    { name: 'Marketing', color: 'bg-yellow-500', assets: 0 },
    { name: 'HR', color: 'bg-purple-500', assets: 0 }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: '',
    department: '',
    status: 'assigned',
    critical: false
  });

  const handleAddAsset = () => {
    if (newAsset.name && newAsset.department) {
      const asset = {
        id: Date.now(),
        ...newAsset
      };
      setAssets([...assets, asset]);
      
      // Update department counts
      setDepartments(prev => 
        prev.map(dept => 
          dept.name === newAsset.department 
            ? { ...dept, assets: dept.assets + 1 }
            : dept
        )
      );
      
      setNewAsset({ name: '', department: '', status: 'assigned', critical: false });
      setShowAddForm(false);
    }
  };

  const totalAssets = assets.length;
  const assignedAssets = assets.filter(asset => asset.status === 'assigned').length;
  const underRepair = assets.filter(asset => asset.status === 'repair').length;
  const criticalRepairs = assets.filter(asset => asset.critical).length;
  const utilizationRate = totalAssets > 0 ? ((assignedAssets / totalAssets) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your IT assets and activities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assets</p>
                <p className="text-3xl font-bold text-gray-900">{totalAssets}</p>
                {totalAssets > 0 && (
                  <p className="text-sm text-green-600 mt-1">+12% from last month</p>
                )}
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="text-3xl font-bold text-gray-900">{assignedAssets}</p>
                {totalAssets > 0 && (
                  <p className="text-sm text-gray-600 mt-1">{utilizationRate}% utilization</p>
                )}
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Repair</p>
                <p className="text-3xl font-bold text-gray-900">{underRepair}</p>
                {criticalRepairs > 0 && (
                  <p className="text-sm text-red-600 mt-1">{criticalRepairs} critical repairs</p>
                )}
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asset Allocation */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Asset Allocation by Department</h2>
            </div>
            
            {totalAssets === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No assets added yet</p>
                <p className="text-sm text-gray-400">Add your first asset to see allocation data</p>
              </div>
            ) : (
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${dept.color}`}></div>
                      <span className="text-gray-700">{dept.name}</span>
                    </div>
                    <span className="text-gray-900 font-medium">{dept.assets} assets</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700">Add Asset</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700">Assign Asset</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700">Generate Report</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700">Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add Asset Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Add New Asset</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset Name
                  </label>
                  <input
                    type="text"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Dell Laptop"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    value={newAsset.department}
                    onChange={(e) => setNewAsset({ ...newAsset, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    <option value="IT Department">IT Department</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newAsset.status}
                    onChange={(e) => setNewAsset({ ...newAsset, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="assigned">Assigned</option>
                    <option value="repair">Under Repair</option>
                    <option value="available">Available</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="critical"
                    checked={newAsset.critical}
                    onChange={(e) => setNewAsset({ ...newAsset, critical: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">
                    Mark as critical repair
                  </label>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleAddAsset}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add Asset
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}