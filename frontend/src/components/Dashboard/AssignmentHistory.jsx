import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AssignmentHistory = () => {
  const [assignments, setAssignments] = useState([]);
  const [summary, setSummary] = useState({
    totalAssignments: 0,
    activeAssignments: 0,
    returnedAssignments: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const fetchAssignments = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/assignment/summary/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
      toast.error('Failed to fetch summary data.');
    }
  };

  const fetchAssignmentById = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/assignment/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching assignment by ID:', error);
      toast.error('Failed to fetch assignment details.');
      return null;
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
        await axios.put(`http://localhost:5000/api/assignment/${editingAssignment._id || editingAssignment.id}`, formData, {
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
      
      resetForm();
      fetchAssignments();
      fetchSummary();
    } catch (error) {
      console.error('Error saving assignment:', error);
      toast.error('Failed to save assignment. Please try again.');
    }
  };

  const handleEdit = async (assignment) => {
    // Fetch full assignment details by ID
    const fullAssignment = await fetchAssignmentById(assignment._id || assignment.id);
    if (fullAssignment) {
      setEditingAssignment(fullAssignment);
      setFormData({
        assetTag: fullAssignment.assetId?.assetTag || fullAssignment.assetTag || '',
        assetName: fullAssignment.assetId?.name || fullAssignment.assetName || '',
        employeeName: fullAssignment.employeeName || '',
        employeeId: fullAssignment.employeeId || '',
        department: fullAssignment.department || '',
        assignmentDate: fullAssignment.assignmentDate || '',
        status: fullAssignment.status || 'Active'
      });
      setShowForm(true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/assignment/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Assignment deleted successfully!');
        fetchAssignments();
        fetchSummary();
      } catch (error) {
        console.error('Error deleting assignment:', error);
        toast.error('Failed to delete assignment. Please try again.');
      }
    }
  };

  const handleView = async (assignment) => {
    const fullAssignment = await fetchAssignmentById(assignment._id || assignment.id);
    if (fullAssignment) {
      // You can implement a view modal here or navigate to a detail page
      console.log('Full assignment details:', fullAssignment);
      toast.info('Assignment details loaded. Check console for full data.');
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

  const exportReport = async () => {
    try {
      toast.info('Exporting report...');
      // You can implement CSV/PDF export here
      const csvContent = assignments.map(assignment => ({
        AssetTag: assignment.assetId?.assetTag || assignment.assetTag || '',
        AssetName: assignment.assetId?.name || assignment.assetName || '',
        Employee: assignment.employeeName || '',
        EmployeeID: assignment.employeeId || '',
        Department: assignment.department || '',
        AssignedDate: assignment.assignmentDate || '',
        ReturnedDate: assignment.returnedDate || '',
        Status: assignment.status || ''
      }));
      
      console.log('Export data:', csvContent);
      toast.success('Report data prepared. Check console for export data.');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report.');
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const assetTag = assignment.assetId?.assetTag || assignment.assetTag || '';
    const assetName = assignment.assetId?.name || assignment.assetName || '';
    const employeeName = assignment.employeeName || '';
    const department = assignment.department || '';
    
    const matchesSearch = assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All Status' || assignment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalRecords = assignments.length;
  const currentlyActive = assignments.filter(a => a.status === 'Active').length;
  const returnedAssets = assignments.filter(a => a.status === 'Returned').length;

  if (loading) {
    return (
      <div className="container">
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assignment history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
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
              <button 
                onClick={exportReport}
                className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAssignments.map((assignment, index) => (
                      <tr key={assignment._id || assignment.id} className="hover:bg-gray-50 transition-colors duration-150" style={{ animationDelay: `${index * 0.1}s` }}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {assignment.assetId?.assetTag || assignment.assetTag || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {assignment.assetId?.name || assignment.assetName || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{assignment.employeeName || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{assignment.employeeId || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{assignment.department || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{assignment.assignmentDate || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{assignment.returnedDate || '-'}</div>
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
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleView(assignment)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEdit(assignment)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Edit Assignment"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(assignment._id || assignment.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Delete Assignment"
                            >
                              <Trash2 className="w-4 h-4" />
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

          {/* Add/Edit Assignment Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6 transform scale-95 animate-pulse">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}
                  </h3>
                  <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
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
                      name="employeeName"
                      value={formData.employeeName}
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
                      name="assignmentDate"
                      value={formData.assignmentDate}
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
                      {editingAssignment ? 'Update Assignment' : 'Add Assignment'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
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