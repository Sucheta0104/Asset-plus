import React, { useState } from 'react';
import { Search, Download, Eye, Plus, X } from 'lucide-react';

const AssignmentHistory = () => {
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    assetId: '',
    assetName: '',
    employee: '',
    employeeId: '',
    department: '',
    assignedDate: '',
    assignedBy: '',
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
    if (formData.assetId && formData.assetName && formData.employee) {
      const newAssignment = {
        id: Date.now(),
        assetId: formData.assetId,
        assetName: formData.assetName,
        employee: formData.employee,
        employeeId: formData.employeeId,
        department: formData.department,
        assignedDate: formData.assignedDate,
        returnedDate: formData.status === 'Returned' ? new Date().toISOString().split('T')[0] : null,
        assignedBy: formData.assignedBy,
        status: formData.status
      };
      
      setAssignments(prev => [...prev, newAssignment]);
      setFormData({
        assetId: '',
        assetName: '',
        employee: '',
        employeeId: '',
        department: '',
        assignedDate: '',
        assignedBy: '',
        status: 'Active'
      });
      setShowForm(false);
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All Status' || assignment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalRecords = assignments.length;
  const currentlyActive = assignments.filter(a => a.status === 'Active').length;
  const returnedAssets = assignments.filter(a => a.status === 'Returned').length;

  return (
    <div className="container">
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assignment History</h1>
              <p className="text-gray-600">Complete history of all asset assignments</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Assignment</span>
            </button>
            {/* <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button> */}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by asset, employee, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Returned">Returned</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{totalRecords}</div>
              <div className="text-gray-600">Total Records</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{currentlyActive}</div>
              <div className="text-gray-600">Currently Active</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">{returnedAssets}</div>
              <div className="text-gray-600">Returned Assets</div>
            </div>
          </div>
        </div>

        {/* Assignment Records */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Assignment Records</h2>
          </div>
          
          {assignments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No assignments found</div>
              <p className="text-gray-500 mb-6">Add your first asset assignment to get started</p>
              <button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Assignment
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returned Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssignments.map((assignment, index) => (
                    <tr key={assignment.id} className="hover:bg-gray-50 transition-colors duration-150" style={{ animationDelay: `${index * 0.1}s` }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{assignment.assetId}</div>
                          <div className="text-sm text-gray-500">{assignment.assetName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{assignment.employee}</div>
                          <div className="text-sm text-gray-500">{assignment.employeeId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{assignment.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{assignment.assignedDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{assignment.returnedDate || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{assignment.assignedBy}</div>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Assignment Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 transform scale-95 animate-pulse">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Assignment</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset ID</label>
                  <input
                    type="text"
                    name="assetId"
                    value={formData.assetId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                  <input
                    type="text"
                    name="assetName"
                    value={formData.assetName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
                  <input
                    type="text"
                    name="employee"
                    value={formData.employee}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Date</label>
                  <input
                    type="date"
                    name="assignedDate"
                    value={formData.assignedDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned By</label>
                  <input
                    type="text"
                    name="assignedBy"
                    value={formData.assignedBy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Returned">Returned</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Assignment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
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
    </div>
  );
};

export default AssignmentHistory;