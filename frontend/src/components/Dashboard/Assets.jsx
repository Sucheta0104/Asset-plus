import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, X, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditAssetModal from './EditAssetModal';

const AssetManagement = () => {
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingAsset, setEditingAsset] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);

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

  const handleDeleteClick = (asset) => {
    setAssetToDelete(asset);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assetToDelete) return;
    
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/asset/${assetToDelete._id}`);
      
      // Remove asset from local state
      setAssets(prev => prev.filter(asset => asset.id !== assetToDelete._id));
      
      // Show success toast
      toast.success(`Asset "${assetToDelete.name}" deleted successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError('Failed to delete asset. Please try again.');
      console.error('Error deleting asset:', err);
      
      // Show error toast
      toast.error('Failed to delete asset. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setAssetToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setAssetToDelete(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingAsset(null);
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setShowEditModal(true);
  };

  const handleUpdateAsset = (updatedAsset) => {
    setAssets(prev => prev.map(asset => 
      asset._id === updatedAsset._id ? updatedAsset : asset
    ));
    setError('');
    
    // Show success toast for update
    toast.success(`Asset "${updatedAsset.name}" updated successfully!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
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

  // Delete Confirmation Modal Component
  const DeleteModal = () => {
    if (!showDeleteModal || !assetToDelete) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop with blur effect */}
        <div className="fixed inset-0 bg-white bg-opacity-30 backdrop-blur-sm transition-all duration-300" onClick={handleDeleteCancel}></div>
        
        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Delete Asset
              </h3>
              <button
                onClick={handleDeleteCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
                <div className="ml-3 sm:ml-4 flex-1">
                  <p className="text-sm sm:text-base text-gray-900 font-medium">
                    Are you sure you want to delete this asset?
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
                <div className="text-xs sm:text-sm space-y-1">
                  <p className="font-medium text-gray-900 truncate">{assetToDelete.name}</p>
                  <p className="text-gray-600">Tag: {assetToDelete.assetTag}</p>
                  <p className="text-gray-600 truncate">Category: {assetToDelete.category}</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                This action cannot be undone. The asset will be permanently removed from the system.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 rounded-b-xl">
              <button
                onClick={handleDeleteCancel}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Deleting...' : 'Delete Asset'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Mobile Card Component for Assets
  const AssetCard = ({ asset }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">{asset.name}</h3>
          <p className="text-sm text-gray-500">{asset.assetTag}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(asset)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(asset)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-500">Category</span>
          <p className="font-medium text-gray-900">{asset.category}</p>
        </div>
        <div>
          <span className="text-gray-500">Status</span>
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getStatusColor(asset.status)}`}>
            {asset.status}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Location</span>
          <p className="font-medium text-gray-900">{asset.location}</p>
        </div>
        <div>
          <span className="text-gray-500">Cost</span>
          <p className="font-medium text-gray-900">${asset.cost?.toLocaleString() || 0}</p>
        </div>
        {asset.assignedTo && (
          <div className="col-span-2">
            <span className="text-gray-500">Assigned To</span>
            <p className="font-medium text-gray-900">{asset.assignedTo}</p>
          </div>
        )}
        <div className="col-span-2">
          <span className="text-gray-500">Purchase Date</span>
          <p className="font-medium text-gray-900">{asset.purchaseDate}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Asset Management
              </h1>
              <p className="text-gray-600">
                Manage and track all company assets
              </p>
            </div>
            <Link
              to="addasset"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
            >
              <Plus size={18} />
              Add Asset
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mt-4">
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, tag, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Assets Display Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">
              Assets ({filteredAssets.length})
            </h2>
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
                      <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium mb-2">No assets found</p>
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
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Asset Tag
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Purchase Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cost
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAssets.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-6 py-12 text-center">
                            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium mb-2">No assets found</p>
                            <p className="text-gray-400">Add your first asset to get started</p>
                          </td>
                        </tr>
                      ) : (
                        filteredAssets.map((asset) => (
                          <tr key={asset._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {asset.assetTag}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {asset.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {asset.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getStatusColor(asset.status)}`}>
                                {asset.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {asset.location}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(asset.purchaseDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${asset.cost?.toLocaleString() || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEdit(asset)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(asset)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
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

      {/* Delete Confirmation Modal */}
      <DeleteModal />

      {/* Edit Asset Modal */}
      <EditAssetModal
        asset={editingAsset}
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onUpdate={handleUpdateAsset}
      />

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default AssetManagement;