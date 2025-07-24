import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, ArrowLeft } from 'lucide-react';

const VendorManagementForm = () => {
  const [vendors, setVendors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorData)
      });
      
      if (!response.ok) throw new Error('Failed to create vendor');
      const newVendor = await response.json();
      setVendors(prev => [...prev, newVendor]);
      setError('');
      return true;
    } catch (err) {
      setError('Error creating vendor: ' + err.message);
      console.error('Create error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateVendor = async (id, vendorData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorData)
      });
      
      if (!response.ok) throw new Error('Failed to update vendor');
      const updatedVendor = await response.json();
      setVendors(prev => prev.map(vendor => 
        vendor.id === id || vendor._id === id ? updatedVendor : vendor
      ));
      setError('');
      return true;
    } catch (err) {
      setError('Error updating vendor: ' + err.message);
      console.error('Update error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteVendor = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete vendor');
      setVendors(prev => prev.filter(vendor => 
        vendor.id !== id && vendor._id !== id
      ));
      setError('');
      return true;
    } catch (err) {
      setError('Error deleting vendor: ' + err.message);
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
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
        {message}
      </div>
    ) : null
  );

  // Loading Indicator
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
    </div>
  );

  if (showForm) {
    return (
      <div className="container">
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <button 
                  onClick={resetForm}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={loading}
                >
                  <ArrowLeft size={20} />
                  <span className="hidden sm:inline">Back</span>
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
                </h1>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <ErrorMessage message={error} />
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vendor Name *
                    </label>
                    <input
                      type="text"
                      name="vendorName"
                      value={formData.vendorName}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Enter vendor name"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Enter contact person name"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Enter phone number"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="emailAddress"
                      value={formData.emailAddress}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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
                      className="w-full px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Enter GST number (optional)"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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
                    Company Address *
                  </label>
                  <textarea
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter complete company address"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {editingVendor ? 'Updating...' : 'Adding...'}
                      </div>
                    ) : (
                      editingVendor ? 'Update Vendor' : 'Add Vendor'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full sm:w-auto px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Vendor Management</h1>
                <p className="text-gray-600 text-sm sm:text-base">Manage all vendor information and contacts</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add Vendor</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>

          <ErrorMessage message={error} />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                {summary.total || vendors.length}
              </div>
              <div className="text-gray-600 text-sm sm:text-base">Total Vendors</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                {summary.active || vendors.filter(v => v.status === 'Active').length}
              </div>
              <div className="text-gray-600 text-sm sm:text-base">Active Vendors</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
                {summary.inactive || vendors.filter(v => v.status === 'Inactive').length}
              </div>
              <div className="text-gray-600 text-sm sm:text-base">Inactive Vendors</div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by vendor name, contact person, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  disabled={loading}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                disabled={loading}
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {loading && <LoadingSpinner />}

          {/* Empty State */}
          {!loading && vendors.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Plus size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first vendor</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <Plus size={20} />
                Add First Vendor
              </button>
            </div>
          )}

          {/* Vendors Table - Desktop */}
          {!loading && vendors.length > 0 && (
            <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVendors.map((vendor) => (
                      <tr key={vendor.id || vendor._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{vendor.vendorName}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{vendor.companyAddress}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vendor.contactPerson}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{vendor.phoneNumber}</div>
                          <div className="text-sm text-gray-500">{vendor.emailAddress}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vendor.gstNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            vendor.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {vendor.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(vendor)}
                              className="text-blue-600 hover:text-blue-800 transition-colors disabled:text-blue-400"
                              disabled={loading}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(vendor)}
                              className="text-red-600 hover:text-red-800 transition-colors disabled:text-red-400"
                              disabled={loading}
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
                <div key={vendor.id || vendor._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{vendor.vendorName}</h3>
                      <p className="text-sm text-gray-600">{vendor.contactPerson}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(vendor)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:text-blue-400"
                        disabled={loading}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(vendor)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:text-red-400"
                        disabled={loading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-sm text-gray-500">Phone:</span>
                      <span className="text-sm text-gray-900">{vendor.phoneNumber}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-sm text-gray-500">Email:</span>
                      <span className="text-sm text-gray-900 break-all">{vendor.emailAddress}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-sm text-gray-500">GST:</span>
                      <span className="text-sm text-gray-900">{vendor.gstNumber || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-sm text-gray-500">Address:</span>
                      <span className="text-sm text-gray-900 text-right">{vendor.companyAddress}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      vendor.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {vendor.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorManagementForm;