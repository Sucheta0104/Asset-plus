import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Plus, Users, CheckCircle, RotateCcw, Package, Eye, Search, Edit2, Trash2 } from 'lucide-react';
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

  // Stats Section with white theme
  const StatsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Assignments</p>
            <p className="text-2xl font-bold text-gray-800">{summary.totalAssignments}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-full text-blue-600">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-gray-800">{summary.activeAssignments}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-full text-green-600">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Returned</p>
            <p className="text-2xl font-bold text-gray-800">{summary.returnedAssignments}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-full text-gray-600">
            <RotateCcw className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Available Assets</p>
            <p className="text-2xl font-bold text-gray-800">{summary.availableAssets}</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-full text-yellow-600">
            <Package className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTableCell = (data, defaultValue = '-') => {
    return data || defaultValue;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Asset Assignment</h1>
        <p className="text-gray-600">Manage asset assignments to employees</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Assign Asset
        </button>
        <Link
          to="/dashboard/assignment/assignmenthistory"
          className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Eye size={18} />
          View History
        </Link>
      </div>

      {/* Assignment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingAssignment ? 'Update Assignment' : 'Assign New Asset'}
              </h2>
              <button 
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Tag</label>
                <input
                  type="text"
                  name="assetTag"
                  value={formData.assetTag}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Asset Name</label>
                <input
                  type="text"
                  name="assetName"
                  value={formData.assetName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">employeeName</label>
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">employeeID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Assigned Date</label>
                <input
                  type="date"
                  name="assignmentDate"
                  value={formData.assignmentDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="Active">Active</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingAssignment ? 'Update Assignment' : 'Assign Asset'}
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-600 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Current Assignments</h2>
        </div>
        
        {assignments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No assignments yet</h3>
            <p className="text-gray-500 mb-4">Start by assigning assets to employees</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Assign First Asset
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
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
                    <tr key={assignment._id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {renderTableCell(assignment.assetId?.assetTag)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {renderTableCell(assignment.assetId?.name)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {renderTableCell(assignment.employeeName)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {renderTableCell(assignment.employeeId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {renderTableCell(assignment.department)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {assignment.assignmentDate ? new Date(assignment.assignmentDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          assignment.status === 'Active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {renderTableCell(assignment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
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
          </div>
        )}
      </div>
      
      {/* Render nested routes here */}
      <Outlet />
    </div>
  );
};

export default AssignmentPage;