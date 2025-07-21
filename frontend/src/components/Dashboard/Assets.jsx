import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Download, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AssetManagement = () => {
  const [assets, setAssets] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const [currentPage, setCurrentPage] = useState(1);
  const [editingAsset, setEditingAsset] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    status: '',
    assignedTo: '',
    location: '',
    purchaseDate: '',
    cost: ''
  });

  const categories = ['IT', 'Furniture', 'Vehicle'];
  const statuses = ['Available', 'Assigned', 'Under Repair', 'Retired'];

  // Fetch all assets on component mount
  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:5000/api/asset');
      setAssets(response.data);
    } catch (err) {
      setError('Failed to fetch assets. Please try again.');
      console.error('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateAssetTag = () => {
    const nextId = assets.length + 1;
    return `AST-${nextId.toString().padStart(3, '0')}`;
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
    
    if (!formData.name || !formData.category || !formData.status || !formData.location || !formData.purchaseDate || !formData.cost) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      if (editingAsset) {
        // Update existing asset
        const updatedAsset = {
          ...formData,
          cost: parseFloat(formData.cost)
        };
         console.log(updatedAsset)
        console.log(editingAsset)
        const response = await axios.put(`http://localhost:5000/api/asset/${editingAsset._id}`, updatedAsset);
       
        // Update asset in local state
        setAssets(prev => prev.map(asset => 
          asset.id === editingAsset._id ? { ...editingAsset, ...response.data } : asset
        ));
        
        alert('Asset updated successfully!');
        setEditingAsset(null);
      } else {
        // Create new asset
        const newAsset = {
          assetTag: generateAssetTag(),
          ...formData,
          cost: parseFloat(formData.cost)
        };
// console.log()
        const response = await axios.post('http://localhost:5000/api/asset', newAsset);
        
        // Add the new asset to the local state
        setAssets(prev => [...prev, response.data]);
        
        alert('Asset added successfully!');
      }
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        status: '',
        assignedTo: '',
        location: '',
        purchaseDate: '',
        cost: ''
      });
      setShowAddForm(false);
      
    } catch (err) {
      setError(editingAsset ? 'Failed to update asset. Please try again.' : 'Failed to add asset. Please try again.');
      console.error('Error saving asset:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/asset/${id}`);
        
        // Remove asset from local state
        setAssets(prev => prev.filter(asset => asset.id !== id));
        
        alert('Asset deleted successfully!');
      } catch (err) {
        setError('Failed to delete asset. Please try again.');
        console.error('Error deleting asset:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = async (asset) => {
    // Set the form data with the asset to edit
    setFormData({
      name: asset.name,
      category: asset.category,
      status: asset.status,
      assignedTo: asset.assignedTo || '',
      location: asset.location,
      purchaseDate: asset.purchaseDate,
      cost: asset.cost.toString()
    });
    setEditingAsset(asset);
    setShowAddForm(true);
  };

  const filteredAssets = assets.filter(asset =>
    asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetTag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-blue-100 text-blue-800';
      case 'Assigned': return 'bg-green-100 text-green-800';
      case 'Under Repair': return 'bg-red-100 text-red-800';
      case 'Retired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assets</h1>
              <p className="text-gray-600 mt-1">Manage and track all your IT assets</p>
            </div>
            {/* <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              disabled={loading}
            >
              <Plus size={16} />
              Add Asset
            </button> */}
          <Link
          to="/dashboard/assets/addasset"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
         <Plus size={16} />
              Add Asset
          </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
              Loading...
            </div>
          )}

          {/* Add Asset Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">{editingAsset ? 'Edit Asset' : 'Add New Asset'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Status</option>
                      {statuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                    <input
                      type="text"
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Leave empty if not assigned"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date *</label>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost *</label>
                    <input
                      type="number"
                      name="cost"
                      value={formData.cost}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                    >
                      {loading ? (editingAsset ? 'Updating...' : 'Adding...') : (editingAsset ? 'Update Asset' : 'Add Asset')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingAsset(null);
                        setFormData({
                          name: '',
                          category: '',
                          status: '',
                          assignedTo: '',
                          location: '',
                          purchaseDate: '',
                          cost: ''
                        });
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search assets by name, tag, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={16} />
                Advanced Search
              </button> */}
            </div>
          </div>

          {/* Assets List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Assets List</h2>
            </div>

            {filteredAssets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No assets found</p>
                <p className="text-gray-400 mt-2">Add your first asset to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Tag</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAssets.map((asset) => (
                      <tr key={asset._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.assetTag}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{asset.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{asset.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(asset.status)}`}>
                            {asset.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{asset.assignedTo || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{asset.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{asset.purchaseDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${asset.cost?.toLocaleString() || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleEdit(asset)}
                              className="text-blue-400 hover:text-blue-600"
                              title="Edit Asset"
                            >
                              <Edit2 size={16} />
                            </button>
                            {/* <button 
                              onClick={() => {
                                // You can implement download functionality here
                                console.log('Download asset:', asset.id);
                              }}
                              className="text-gray-400 hover:text-gray-600"
                              title="Download"
                            >
                              <Download size={16} />
                            </button> */}
                            <button 
                              onClick={() => handleDelete(asset._id)}
                              className="text-red-400 hover:text-red-600"
                              title="Delete Asset"
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

            {/* Pagination */}
            {/* {filteredAssets.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <button className="flex items-center gap-2 px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <span className="text-sm text-gray-700">{currentPage}</span>
                <button className="flex items-center gap-2 px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetManagement;