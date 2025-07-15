import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Plus, Users, CheckCircle, RotateCcw, Package, Eye, Undo2, Search } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
const AssignmentPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    assetTag: '',
    assetName: '',
    employee: '',
    employeeId: '',
    department: '',
    assignedDate: '',
    status: 'Active'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (formData.assetTag && formData.assetName && formData.employee) {
      const newAssignment = {
        ...formData,
        id: Date.now(),
        assignedDate: formData.assignedDate || new Date().toISOString().split('T')[0]
      };
      setAssignments(prev => [...prev, newAssignment]);
      setFormData({
        assetTag: '',
        assetName: '',
        employee: '',
        employeeId: '',
        department: '',
        assignedDate: '',
        status: 'Active'
      });
      setShowForm(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === id ? { ...assignment, status: newStatus } : assignment
      )
    );
  };

  const totalAssignments = assignments.length;
  const activeAssignments = assignments.filter(a => a.status === 'Active').length;
  const returnedAssignments = assignments.filter(a => a.status === 'Returned').length;
  const availableAssets = 10 - activeAssignments; // Assuming 10 total assets

  return (
    <div className="container">
     <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Asset Assignment</h1>
        <p className="text-gray-600">Manage asset assignments to employees</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
        >
          <Plus size={20} />
          Assign Asset
        </button>
        <Link
          to="/dashboard/assignment/assignmenthistory"
          className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transform hover:scale-105 transition-all duration-200"
        >
          <Eye size={20} />
          View History
        </Link>
      </div>

      {/* Assignment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 animate-slide-up">
            <h2 className="text-xl font-bold mb-4">Assign New Asset</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Tag</label>
                <input
                  type="text"
                  name="assetTag"
                  value={formData.assetTag}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                <input
                  type="text"
                  name="assetName"
                  value={formData.assetName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <input
                  type="text"
                  name="employee"
                  value={formData.employee}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Date</label>
                <input
                  type="date"
                  name="assignedDate"
                  value={formData.assignedDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Assign Asset
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search assignments by asset, employee, or department..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Assignments</p>
              <p className="text-3xl font-bold text-gray-900">{totalAssignments}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-3xl font-bold text-gray-900">{activeAssignments}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Returned</p>
              <p className="text-3xl font-bold text-gray-900">{returnedAssignments}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <RotateCcw className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Assets</p>
              <p className="text-3xl font-bold text-gray-900">{availableAssets}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Assignments */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Current Assignments</h2>
        </div>
        
        {assignments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-600 mb-4">Start by assigning assets to employees</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Assign First Asset
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Tag</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment, index) => (
                  <tr key={assignment.id} className="hover:bg-gray-50 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {assignment.assetTag}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.assetName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.employee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.employeeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.assignedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        assignment.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(assignment.id, assignment.status === 'Active' ? 'Returned' : 'Active')}
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          <Undo2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Render nested routes here */}
      <Outlet />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
    </div>
  );
};

export default AssignmentPage;

