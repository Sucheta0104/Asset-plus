import React, { useState, useEffect } from 'react';

import { Plus, Users, CheckCircle, RotateCcw, Package, Eye, Search, Edit2, Trash2, X } from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AssignmentPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [summary, setSummary] = useState({
    totalAssignments: 0,
    activeAssignments: 0,
    returnedAssignments: 0,
    availableAssets: 0
  });
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    assetTag: '',
    assetName: '',
    employeeName: '',
    employeeId: '',
    department: '',
    assignmentDate: '',
    status: 'Active'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
    fetchSummary();
  }, []);
  console.log(assignments)

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/assignment/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      if (error.response?.status === 401) {
        navigate('/');
      } else {
        toast.error('Failed to fetch assignments. Please refresh the page.');
      }
    }
  };

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/assignment/summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (editingAssignment) {
        // Update existing assignment
        await axios.put(`http://localhost:5000/api/assignment/${editingAssignment._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Assignment updated successfully!');
        setEditingAssignment(null);
      } else {
        // Create new assignment
        await axios.post('http://localhost:5000/api/assignment/', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Assignment created successfully!');
      }
      setShowForm(false);
      setFormData({
        assetTag: '',
        assetName: '',
        employeeName: '',
        employeeId: '',
        department: '',
        assignmentDate: '',
        status: 'Active'
      });
      fetchAssignments();
      fetchSummary();
    } catch (error) {
      console.error('Error saving assignment:', error);
      toast.error('Failed to save assignment. Please try again.');
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      assetTag: assignment.assetId?.assetTag || '',
      assetName: assignment.assetId?.name || '',
      employeeName: assignment.employeeName,
      employeeId: assignment.employeeId,
      department: assignment.department,
      assignmentDate: assignment.assignmentDate,
      status: assignment.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/assignment/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchAssignments();
        fetchSummary();
        toast.success('Assignment deleted successfully!');
      } catch (error) {
        console.error('Error deleting assignment:', error);
        toast.error('Failed to delete assignment. Please try again.');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/assignment/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchAssignments();
      fetchSummary();
      toast.success(`Assignment status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating assignment status:', error);
      toast.error('Failed to update assignment status. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      assetTag: '',
      assetName: '',
      employeeName: '',
      employeeId: '',
      department: '',
      assignmentDate: '',
      status: 'Active'
    });
    setEditingAssignment(null);
    setShowForm(false);
  };

  const handleSearch = async (searchTerm) => {
    try {
      const token = localStorage.getItem('token');
      if (!searchTerm.trim()) {
        // If search is empty, fetch all assignments
        fetchAssignments();
        return;
      }
      const response = await axios.get(`http://localhost:5000/api/assignment/search?query=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(response.data);
    } catch (error) {
      console.error('Error searching assignments:', error);
      toast.error('Error searching assignments');
    }
  };

  // Stats Section with responsive design
  const StatsSection = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-2 sm:mb-0">
            <p className="text-xs sm:text-sm text-gray-500 truncate">Total Assignments</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{summary.totalAssignments}</p>
          </div>
          <div className="bg-blue-50 p-2 lg:p-3 rounded-full text-blue-600 self-end sm:self-auto">
            <Users className="h-4 w-4 lg:h-5 lg:w-5" />
          </div>
        </div>
      </div>

      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-2 sm:mb-0">
            <p className="text-xs sm:text-sm text-gray-500">Active</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{summary.activeAssignments}</p>
          </div>
          <div className="bg-green-50 p-2 lg:p-3 rounded-full text-green-600 self-end sm:self-auto">
            <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5" />
          </div>
        </div>
      </div>

      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-2 sm:mb-0">
            <p className="text-xs sm:text-sm text-gray-500">Returned</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{summary.returnedAssignments}</p>
          </div>
          <div className="bg-gray-50 p-2 lg:p-3 rounded-full text-gray-600 self-end sm:self-auto">
            <RotateCcw className="h-4 w-4 lg:h-5 lg:w-5" />
          </div>
        </div>
      </div>

      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-2 sm:mb-0">
            <p className="text-xs sm:text-sm text-gray-500 truncate">Available Assets</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{summary.availableAssets}</p>
          </div>
          <div className="bg-yellow-50 p-2 lg:p-3 rounded-full text-yellow-600 self-end sm:self-auto">
            <Package className="h-4 w-4 lg:h-5 lg:w-5" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTableCell = (data, defaultValue = '-') => {
    return data || defaultValue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Asset Assignment</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage asset assignments to employees</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
          <Link
            to="/dashboard/assignment/assignmenthistory"
            className="flex items-center justify-center gap-2 bg-white text-gray-700 px-3 sm:px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm text-sm"
          >
            <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="whitespace-nowrap">View History</span>
          </Link>
        </div>

        {/* Assignment Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="sticky top-0 bg-white px-4 sm:px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    {editingAssignment ? 'Update Assignment' : 'Assign New Asset'}
                  </h2>
                  <button 
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="px-4 sm:px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Tag</label>
                  <input
                    type="text"
                    name="assetTag"
                    value={formData.assetTag}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
                  <input
                    type="text"
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Date</label>
                  <input
                    type="date"
                    name="assignmentDate"
                    value={formData.assignmentDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="Returned">Returned</option>
                  </select>
                </div>
              </div>
              
              <div className="sticky bottom-0 bg-white px-4 sm:px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    {editingAssignment ? 'Update Assignment' : 'Assign Asset'}
                  </button>
                  <button
                    onClick={resetForm}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search assignments..."
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              onChange={(e) => {
                // Debounce the search to avoid too many API calls
                const timeoutId = setTimeout(() => {
                  handleSearch(e.target.value);
                }, 500);
                return () => clearTimeout(timeoutId);
              }}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <StatsSection />

        {/* Current Assignments */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Current Assignments</h2>
          </div>
          
          {assignments.length === 0 ? (
            <div className="p-6 sm:p-8 lg:p-12 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">No assignments yet</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4">Start by assigning assets to employees</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Assign First Asset
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Mobile Card View */}
              <div className="block sm:hidden">
                {assignments.map((assignment, index) => (
                  <div key={assignment._id || index} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {renderTableCell(assignment.assetId?.assetTag)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {renderTableCell(assignment.assetId?.name)}
                          </p>
                        </div>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          assignment.status === 'Active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {renderTableCell(assignment.status)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Employee:</span>
                          <p className="font-medium truncate">{renderTableCell(assignment.employeeName)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">ID:</span>
                          <p className="font-medium">{renderTableCell(assignment.employeeId)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Department:</span>
                          <p className="font-medium truncate">{renderTableCell(assignment.department)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <p className="font-medium">
                            {assignment.assignmentDate ? new Date(assignment.assignmentDate).toLocaleDateString() : '-'}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-2">
                        <button 
                          onClick={() => handleEdit(assignment)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded hover:bg-blue-50"
                          title="Edit Assignment"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(assignment._id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-2 rounded hover:bg-red-50"
                          title="Delete Assignment"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Tag</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Name</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Employee ID</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Department</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Assigned Date</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignments.map((assignment, index) => (
                    <tr key={assignment._id || index} className="hover:bg-gray-50">
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {renderTableCell(assignment.assetId?.assetTag)}
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-[150px] truncate">
                        {renderTableCell(assignment.assetId?.name)}
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-[120px] truncate">
                        {renderTableCell(assignment.employeeName)}
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                        {renderTableCell(assignment.employeeId)}
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell max-w-[120px] truncate">
                        {renderTableCell(assignment.department)}
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                        {assignment.assignmentDate ? new Date(assignment.assignmentDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          assignment.status === 'Active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {renderTableCell(assignment.status)}
                        </span>
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-1 sm:space-x-2">
                          <button 
                            onClick={() => handleEdit(assignment)}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                            title="Edit Assignment"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(assignment._id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                            title="Delete Assignment"
                          >
                            <Trash2 size={16} />
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
      </div>
    </div>
  );
};

export default AssignmentPage;