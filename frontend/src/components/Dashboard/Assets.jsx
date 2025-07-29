import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, X, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AssetManagement = () => {
  const [assets, setAssets] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingAsset, setEditingAsset] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    status: '',
    assignedTo: '',
    location: '',
    purchaseDate: '',
    cost: ''
  });

  // const categories = ['IT', 'Furniture', 'Vehicle'];
  // const statuses = ['Available', 'Assigned', 'Under Repair', 'Retired'];

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch all assets on component mount
  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(false);
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
      case 'Available':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-200';
      case 'Assigned':
        return 'bg-blue-50 text-blue-700 border border-blue-200 ring-1 ring-blue-200';
      case 'Under Repair':
        return 'bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-200';
      case 'Retired':
        return 'bg-rose-50 text-rose-700 border border-rose-200 ring-1 ring-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200 ring-1 ring-gray-200';
    }
  };

  // Mobile Card Component for Assets
  const AssetCard = ({ asset }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{asset.name}</h3>
          <p className="text-sm text-gray-500 font-mono">{asset.assetTag}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => handleEdit(asset)}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Asset"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(asset._id)}
            className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Asset"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-500 block mb-1">Category</span>
          <span className="font-medium text-gray-900">{asset.category}</span>
        </div>
        <div>
          <span className="text-gray-500 block mb-1">Status</span>
          <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(asset.status)}`}>
            {asset.status}
          </span>
        </div>
        <div>
          <span className="text-gray-500 block mb-1">Location</span>
          <span className="font-medium text-gray-900">{asset.location}</span>
        </div>
        <div>
          <span className="text-gray-500 block mb-1">Cost</span>
          <span className="font-medium text-gray-900">${asset.cost?.toLocaleString() || 0}</span>
        </div>
        {asset.assignedTo && (
          <div className="col-span-2">
            <span className="text-gray-500 block mb-1">Assigned To</span>
            <span className="font-medium text-gray-900">{asset.assignedTo}</span>
          </div>
        )}
        <div className="col-span-2">
          <span className="text-gray-500 block mb-1">Purchase Date</span>
          <span className="font-medium text-gray-900">{asset.purchaseDate}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Asset Management
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage and track all company assets efficiently
              </p>
            </div>
            <Link
              to="addasset"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              <span className="whitespace-nowrap">Add Asset</span>
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl mt-4 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-rose-200 flex-shrink-0 mt-0.5"></div>
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, tag, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Assets Display Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">
                Assets ({filteredAssets.length})
              </h2>
              {!isMobileView && (
                <div className="text-sm text-gray-500">
                  {filteredAssets.length === 0 ? 'No assets found' : `Showing ${filteredAssets.length} asset${filteredAssets.length !== 1 ? 's' : ''}`}
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Assets Content */}
          {!loading && (
            <>
              {/* Mobile View - Cards */}
              {isMobileView ? (
                <div className="p-4">
                  {filteredAssets.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium mb-2">No assets found</p>
                      <p className="text-gray-400">Add your first asset to get started</p>
                    </div>
                  ) : (
                    filteredAssets.map((asset) => (
                      <AssetCard key={asset._id} asset={asset} />
                    ))
                  )}
                </div>
              ) : (
                /* Desktop View - Table */
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <tr>
                        {[
                          'Asset Tag', 'Name', 'Category', 'Status', 
                          'Assigned To', 'Location', 'Purchase Date', 
                          'Cost', 'Actions'
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-50">
                      {filteredAssets.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="text-center py-16">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-xl font-medium mb-2">No assets found</p>
                            <p className="text-gray-400">Add your first asset to get started</p>
                          </td>
                        </tr>
                      ) : (
                        filteredAssets.map((asset, index) => (
                          <tr 
                            key={asset._id} 
                            className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900 bg-gray-50 rounded-lg mx-2 my-1">
                              {asset.assetTag}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {asset.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                                {asset.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-3 py-1.5 text-xs font-medium rounded-full ${getStatusColor(asset.status)}`}>
                                {asset.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {asset.assignedTo || (
                                <span className="text-gray-400 italic">Unassigned</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                              {asset.location}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {asset.purchaseDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              ${asset.cost?.toLocaleString() || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleEdit(asset)}
                                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-105"
                                  title="Edit Asset"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(asset._id)}
                                  className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all duration-200 transform hover:scale-105"
                                  title="Delete Asset"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetManagement;