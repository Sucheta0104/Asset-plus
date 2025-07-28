import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, ArrowLeft, CheckCircle, XCircle, AlertCircle, X, Users } from 'lucide-react';

const VendorManagementForm = () => {
  const [vendors, setVendors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  const API_BASE_URL = 'http://localhost:5000/api/vendors';

  const [formData, setFormData] = useState({
    vendorName: '',
    contactPerson: '',
    phoneNumber: '',
    emailAddress: '',
    companyAddress: '',
    gstNumber: '',
    status: 'Active'
  });

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };

  // Toast functions
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Fetch all vendors on component mount
  useEffect(() => {
    fetchVendors();
    fetchSummary();
  }, []);

  // API Functions
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(API_BASE_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch vendors');
      const data = await response.json();
      setVendors(data);
      setError('');
    } catch (err) {
      setError('Error fetching vendors: ' + err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/summary/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch summary');
      const data = await response.json();
      setSummary(data);
    } catch (err) {
      console.error('Summary fetch error:', err);
      // If summary fails, calculate from vendors array
      const active = vendors.filter(v => v.status === 'Active').length;
      const inactive = vendors.filter(v => v.status === 'Inactive').length;
      setSummary({
        total: vendors.length,
        active,
        inactive
      });
    }
  };

  const createVendor = async (vendorData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(vendorData)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error('Failed to create vendor');
      }
      const newVendor = await response.json();
      setVendors(prev => [...prev, newVendor]);
      setError('');
      showToast('Vendor created successfully!', 'success');
      return true;
    } catch (err) {
      setError('Error creating vendor: ' + err.message);
      showToast('Failed to create vendor: ' + err.message, 'error');
      console.error('Create error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateVendor = async (id, vendorData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(vendorData)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error('Failed to update vendor');
      }
      const updatedVendor = await response.json();
      setVendors(prev => prev.map(vendor => 
        vendor.id === id || vendor._id === id ? updatedVendor : vendor
      ));
      setError('');
      showToast('Vendor updated successfully!', 'success');
      return true;
    } catch (err) {
      setError('Error updating vendor: ' + err.message);
      showToast('Failed to update vendor: ' + err.message, 'error');
      console.error('Update error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteVendor = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error('Failed to delete vendor');
      }
      setVendors(prev => prev.filter(vendor => 
        vendor.id !== id && vendor._id !== id
      ));
      setError('');
      showToast('Vendor deleted successfully!', 'success');
      return true;
    } catch (err) {
      setError('Error deleting vendor: ' + err.message);
      showToast('Failed to delete vendor: ' + err.message, 'error');
      console.error('Delete error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.vendorName.trim() || !formData.contactPerson.trim() || 
        !formData.phoneNumber.trim() || !formData.emailAddress.trim() || 
        !formData.companyAddress.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!emailRegex.test(formData.emailAddress)) {
      setError('Please enter a valid email address');
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/\s|-/g, ''))) {
      setError('Please enter a valid phone number');
      return;
    }

    let success;
    if (editingVendor) {
      // Use the correct ID field (could be 'id' or '_id' depending on your backend)
      const vendorId = editingVendor.id || editingVendor._id;
      success = await updateVendor(vendorId, formData);
    } else {
      success = await createVendor(formData);
    }

    if (success) {
      resetForm();
      fetchSummary(); // Refresh summary after successful operation
    }
  };

  const handleEdit = (vendor) => {
    setFormData({
      vendorName: vendor.vendorName,
      contactPerson: vendor.contactPerson,
      phoneNumber: vendor.phoneNumber,
      emailAddress: vendor.emailAddress,
      companyAddress: vendor.companyAddress,
      gstNumber: vendor.gstNumber || '',
      status: vendor.status
    });
    setEditingVendor(vendor);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (vendor) => {
    if (window.confirm(`Are you sure you want to delete ${vendor.vendorName}?`)) {
      const vendorId = vendor.id || vendor._id;
      const success = await deleteVendor(vendorId);
      if (success) {
        fetchSummary(); // Refresh summary after deletion
      }
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = (vendor.vendorName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (vendor.contactPerson?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (vendor.emailAddress?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
});

  const resetForm = () => {
    setFormData({
      vendorName: '',
      contactPerson: '',
      phoneNumber: '',
      emailAddress: '',
      companyAddress: '',
      gstNumber: '',
      status: 'Active'
    });
    setEditingVendor(null);
    setShowForm(false);
    setError('');
  };

  // Error Display Component
  const ErrorMessage = ({ message }) => (
    message ? (
      <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded mb-6 shadow-sm">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          <span className="font-medium">{message}</span>
        </div>
      </div>
    ) : null
  );

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-500"></div>
      <span className="ml-3 text-gray-500">Loading...</span>
    </div>
  );

  const CustomToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-lg shadow-lg border-l-4 ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-500 text-green-800'
              : toast.type === 'error'
              ? 'bg-red-50 border-red-500 text-red-800'
              : 'bg-yellow-50 border-yellow-500 text-yellow-800'
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle size={20} className="text-green-600" />}
            {toast.type === 'error' && <XCircle size={20} className="text-red-600" />}
            {toast.type === 'warning' && <AlertCircle size={20} className="text-yellow-600" />}
          </div>
          <div className="flex-1 text-sm">
            <p className="font-medium">
              {toast.type === 'success' ? 'Success' : 
               toast.type === 'error' ? 'Error' : 'Warning'}
            </p>
            <p className="text-gray-600">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CustomToastContainer />
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={resetForm}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                disabled={loading}
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Vendors</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
              </h1>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <ErrorMessage message={error} />
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vendor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="vendorName"
                      value={formData.vendorName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors text-gray-800 placeholder-gray-400"
                      placeholder="Enter vendor name"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors text-gray-800 placeholder-gray-400"
                      placeholder="Enter contact person name"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors text-gray-800 placeholder-gray-400"
                      placeholder="Enter phone number"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="emailAddress"
                      value={formData.emailAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors text-gray-800 placeholder-gray-400"
                      placeholder="Enter email address"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Number
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors text-gray-800 placeholder-gray-400"
                      placeholder="Enter GST number (optional)"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors text-gray-800"
                      required
                      disabled={loading}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors text-gray-800 placeholder-gray-400"
                    placeholder="Enter complete company address"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        {editingVendor ? 'Updating...' : 'Adding...'}
                      </div>
                    ) : (
                      editingVendor ? 'Update Vendor' : 'Add Vendor'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CustomToastContainer />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Vendor Management</h1>
              <p className="text-gray-500 mt-1">Manage all vendor information and contacts</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
              disabled={loading}
            >
              <Plus size={18} />
              <span>Add Vendor</span>
            </button>
          </div>
        </div>

          <ErrorMessage message={error} />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Vendors</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {summary.total || vendors.length}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                  <Users size={20} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Active Vendors</p>
                  <p className="text-2xl font-bold text-green-600">
                    {summary.active || vendors.filter(v => v.status === 'Active').length}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-green-600">
                  <CheckCircle size={20} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Inactive Vendors</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {summary.inactive || vendors.filter(v => v.status === 'Inactive').length}
                  </p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
                  <XCircle size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-8 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by vendor name, contact person, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors text-gray-700 placeholder-gray-400"
                  disabled={loading}
                />
              </div>
              <div className="w-full sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors text-gray-700"
                  disabled={loading}
                >
                  <option value="All Status">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {loading && <LoadingSpinner />}

          {/* Empty State */}
          {!loading && vendors.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center shadow-sm">
              <div className="text-gray-300 mb-4">
                <Users size={64} className="mx-auto opacity-40" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No vendors found</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first vendor</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2 transition-colors shadow-sm"
              >
                <Plus size={18} />
                Add First Vendor
              </button>
            </div>
          )}

          {/* Vendors Table - Desktop */}
          {!loading && vendors.length > 0 && (
            <div className="hidden lg:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact Person
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone & Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GST Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredVendors.map((vendor) => (
                      <tr key={vendor.id || vendor._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{vendor.vendorName}</div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">{vendor.companyAddress}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{vendor.contactPerson}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{vendor.phoneNumber}</div>
                          <div className="text-xs text-gray-500">{vendor.emailAddress}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vendor.gstNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            vendor.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {vendor.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => handleEdit(vendor)}
                              className="text-blue-600 hover:text-blue-900 transition-colors disabled:opacity-50"
                              disabled={loading}
                              title="Edit vendor"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(vendor)}
                              className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                              disabled={loading}
                              title="Delete vendor"
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

          {/* Vendors Cards - Mobile & Tablet */}
          {!loading && vendors.length > 0 && (
            <div className="lg:hidden space-y-4">
              {filteredVendors.map((vendor) => (
                <div key={vendor.id || vendor._id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900">{vendor.vendorName}</h3>
                      <p className="text-sm text-gray-600">{vendor.contactPerson}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(vendor)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        disabled={loading}
                        title="Edit vendor"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(vendor)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        disabled={loading}
                        title="Delete vendor"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Phone</span>
                      <span className="text-sm font-medium text-gray-900">{vendor.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Email</span>
                      <span className="text-sm text-blue-600 break-all max-w-[180px] text-right">{vendor.emailAddress}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">GST</span>
                      <span className="text-sm text-gray-700">{vendor.gstNumber || 'N/A'}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Address</p>
                      <p className="text-sm text-gray-700">{vendor.companyAddress}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      vendor.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {vendor.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(vendor.updatedAt || vendor.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    
  );
};


export default VendorManagementForm;