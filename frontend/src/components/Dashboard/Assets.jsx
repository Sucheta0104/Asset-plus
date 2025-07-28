import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, X } from 'lucide-react';
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
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'Assigned':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Under Repair':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'Retired':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Asset Management</h1>
              <p className="text-gray-600">Manage and track all company assets</p>
            </div>
            <Link
              to="addasset"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-sm"
            >
              <Plus size={20} />
              Add Asset
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 border border-red-400 text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}



          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Assets List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Assets List</h2>
            </div>
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
  <thead className="bg-gray-50">
    <tr>
      {[
        'Asset Tag', 'Name', 'Category', 'Status', 
        'Assigned To', 'Location', 'Purchase Date', 
        'Cost', 'Actions'
      ].map((heading) => (
        <th
          key={heading}
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          {heading}
        </th>
      ))}
    </tr>
  </thead>

  <tbody className="bg-white divide-y divide-gray-100">
    {filteredAssets.length === 0 ? (
      <tr>
        <td colSpan={9} className="text-center py-12">
          <p className="text-gray-400 text-lg">No assets found</p>
          <p className="text-gray-400 mt-2">Add your first asset to get started</p>
        </td>
      </tr>
    ) : (
      filteredAssets.map((asset) => (
        <tr key={asset._id} className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.assetTag}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{asset.name}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{asset.category}</td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(asset.status)}`}>
              {asset.status}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
            {asset.assignedTo || '-'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
            {asset.location}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
            {asset.purchaseDate}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
            ${asset.cost?.toLocaleString() || 0}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(asset)}
                className="text-blue-600 hover:text-blue-700 transition-colors"
                title="Edit Asset"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(asset._id)}
                className="text-red-600 hover:text-red-700 transition-colors"
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

            {/* Pagination */}
            {/* {filteredAssets.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
                <button className="flex items-center gap-2 px-3 py-1 text-sm text-gray-400 hover:text-gray-300">
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <span className="text-sm text-gray-300">{currentPage}</span>
                <button className="flex items-center gap-2 px-3 py-1 text-sm text-gray-400 hover:text-gray-300">
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