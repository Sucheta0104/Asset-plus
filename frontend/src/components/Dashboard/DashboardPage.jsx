import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Users, Wrench, Clock, FileText, Settings, Package, UserPlus, TrendingUp } from 'lucide-react';
import axios from 'axios';

// Add axios interceptor setup
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: '',
    department: '',
    assignedTo: '',
    status: 'available',
    category: 'laptop'
  });
 const [departmentAllocation, setDepartmentAllocation] = useState([]);
  const departments = ['IT Department', 'Sales', 'Marketing', 'HR'];
  const statuses = ['available', 'assigned', 'under-repair', 'amc-due'];
  const categories = ['laptop', 'desktop', 'monitor', 'printer', 'server', 'phone', 'tablet'];
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
  }, [navigate]);

  // Modify the existing useEffect for fetching assets
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/asset/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAssets(response.data);
      } catch (error) {
        console.error('Error fetching assets:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        }
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/dashboard/department-allocation', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => setDepartmentAllocation(res.data))
      .catch(err => console.log(err));
  }, []);

  

  // const addAsset = () => {
  //   if (newAsset.name && newAsset.department) {
  //     const asset = {
  //       ...newAsset,
  //       id: Date.now(),
  //       createdAt: new Date().toISOString(),
  //     };
  //     setAssets([...assets, asset]);
  //     setNewAsset({
  //       name: '',
  //       department: '',
  //       assignedTo: '',
  //       status: 'available',
  //       category: 'laptop'
  //     });
  //     setIsAddingAsset(false);
  //   }
  // };

  // const updateAssetStatus = (id, newStatus, assignedTo = '') => {
  //   setAssets(assets.map(asset => 
  //     asset.id === id 
  //       ? { ...asset, status: newStatus, assignedTo } 
  //       : asset
  //   ));
  // };

  // const deleteAsset = (id) => {
  //   setAssets(assets.filter(asset => asset.id !== id));
  // };

  // Calculate statistics
  const totalAssets = assets.length;
  const assignedAssets = assets.filter(asset => asset.status === 'assigned').length;
  const underRepair = assets.filter(asset => asset.status === 'under-repair').length;
  const amcDue = assets.filter(asset => asset.status === 'amc-due').length;
  const criticalRepairs = assets.filter(asset => asset.status === 'under-repair' && asset.priority === 'critical').length;
  const utilizationRate = totalAssets > 0 ? Math.round((assignedAssets / totalAssets) * 100) : 0;

  // Department allocation
  // const departmentStats = departmentAllocation.map(dept => ({
  //   name: dept,
  //   count: assets.filter(asset => asset.department === dept).length
  // }));

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <div className={`bg-white rounded-lg p-6 shadow-sm border-l-4 ${color} transform hover:scale-105 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
          <Icon className={`w-6 h-6 ${color.replace('border-l-', 'text-')}`} />
        </div>
      </div>
      {trend && (
        <div className="mt-2 flex items-center text-sm text-green-600">
          <TrendingUp className="w-4 h-4 mr-1" />
          {trend}
        </div>
      )}
    </div>
  );

  const DepartmentRow = ({ department, count, color }) => (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full ${color} mr-3`}></div>
        <span className="text-gray-700 font-medium">{department}</span>
      </div>
      <span className="text-gray-900 font-semibold">{count} assets</span>
    </div>
  );

  const AssetCard = ({ asset }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'assigned': return 'bg-green-100 text-green-800';
        case 'under-repair': return 'bg-red-100 text-red-800';
        case 'amc-due': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-blue-100 text-blue-800';
      }
    };

    return (
      
      <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">{asset.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
            {asset.status.replace('-', ' ')}
          </span>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <p><span className="font-medium">Department:</span> {asset.department}</p>
          <p><span className="font-medium">Category:</span> {asset.category}</p>
          {asset.assignedTo && (
            <p><span className="font-medium">Assigned to:</span> {asset.assignedTo}</p>
          )}
        </div>
        <div className="mt-3 flex space-x-2">
          <select 
            value={asset.status} 
            onChange={(e) => updateAssetStatus(asset.id, e.target.value, asset.assignedTo)}
            className="text-xs border rounded px-2 py-1 flex-1"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status.replace('-', ' ')}</option>
            ))}
          </select>
          <button 
            onClick={() => deleteAsset(asset.id)}
            className="text-xs text-red-600 hover:text-red-800 px-2 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      
    );
  };

  return (
    <div className="container">
    <div className="min-h-screen bg-gray-50 p-9">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your IT assets and activities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Assets" 
            value={totalAssets || 0}
            subtitle={totalAssets > 0 ? "+12% from last month" : "No assets yet"}
            icon={Package}
            color="border-l-blue-500"
            trend={totalAssets > 0 ? "+12% from last month" : null}
          />
          <StatCard 
            title="Assigned" 
            value={assignedAssets || 0}
            subtitle={`${utilizationRate}% utilization`}
            icon={Users}
            color="border-l-green-500"
          />
          <StatCard 
            title="Under Repair" 
            value={underRepair || 0}
            subtitle={`${criticalRepairs} critical repairs`}
            icon={Wrench}
            color="border-l-red-500"
          />
          <StatCard 
            title="AMC Due" 
            value={amcDue || 0}
            subtitle="Next 30 days"
            icon={Clock}
            color="border-l-yellow-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Asset Allocation */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <TrendingUp className="w-5 h-5 text-gray-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Asset Allocation by Department</h2>
              </div>
              
              {departmentAllocation.some(dept => dept.count > 0) ? (
                <div className="space-y-2">
                  {departmentAllocation.map((dept, index) => (
                    <DepartmentRow 
                      key={dept.department}
                      department={dept.department}
                      count={dept.count}
                      color={['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'][index]}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No assets allocated yet</p>
                  <p className="text-sm text-gray-400 mt-2">Add assets to see department allocation</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <Link
                 to="/dashboard/assets"
                  className="w-full flex items-center p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Add Asset</div>
                    <div className="text-sm text-blue-100">Register new equipment</div>
                  </div>
                </Link>
                
                <Link
                to="/dashboard/assignment"
                 className="w-full flex items-center p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 transform hover:scale-105">
                  <UserPlus className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Assign Asset</div>
                    <div className="text-sm text-green-100">Assign to employee</div>
                  </div>
                </Link>
                
                <Link 
                to="/dashboard/reports"
                className="w-full flex items-center p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 transform hover:scale-105">
                  <FileText className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Create Report</div>
                    <div className="text-sm text-purple-100">Generate audit report</div>
                  </div>
                </Link>
                
                <Link
                to="/dashboard/maintainance"
                className="w-full flex items-center p-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 transform hover:scale-105">
                  <Settings className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Log Maintenance</div>
                    <div className="text-sm text-orange-100">Record repair activity</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Assets List */}
        {/* {assets.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Assets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assets.map(asset => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            </div>
          </div>
        )} */}

        {/* Add Asset Modal */}
        {isAddingAsset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 transform scale-0 animate-pulse">
              <div className="animate-scale-in">
                <h3 className="text-xl font-semibold mb-4">Add New Asset</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Asset Name"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={newAsset.department}
                    onChange={(e) => setNewAsset({...newAsset, department: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <select
                    value={newAsset.category}
                    onChange={(e) => setNewAsset({...newAsset, category: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Assigned To (optional)"
                    value={newAsset.assignedTo}
                    onChange={(e) => setNewAsset({...newAsset, assignedTo: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={newAsset.status}
                    onChange={(e) => setNewAsset({...newAsset, status: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status.replace('-', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={addAsset}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Add Asset
                  </button>
                  <button
                    onClick={() => setIsAddingAsset(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
    </div>
    
  );
};

export default Dashboard;