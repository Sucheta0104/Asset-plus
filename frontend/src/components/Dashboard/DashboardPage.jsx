import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Users, Wrench, Clock, FileText, Settings, Package, UserPlus, TrendingUp, BarChart3, Activity, AlertTriangle, CheckCircle, Monitor } from 'lucide-react';
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

// Professional Computer Logo Component
const ComputerLogo = ({ className = "w-5 h-5" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      {/* Monitor Screen */}
      <rect 
        x="3" 
        y="4" 
        width="18" 
        height="12" 
        rx="2" 
        fill="currentColor" 
        opacity="0.1"
      />
      <rect 
        x="3" 
        y="4" 
        width="18" 
        height="12" 
        rx="2" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        fill="none"
      />
      
      {/* Screen Content Lines */}
      <line 
        x1="6" 
        y1="7" 
        x2="18" 
        y2="7" 
        stroke="currentColor" 
        strokeWidth="1" 
        opacity="0.6"
      />
      <line 
        x1="6" 
        y1="9" 
        x2="15" 
        y2="9" 
        stroke="currentColor" 
        strokeWidth="1" 
        opacity="0.6"
      />
      <line 
        x1="6" 
        y1="11" 
        x2="12" 
        y2="11" 
        stroke="currentColor" 
        strokeWidth="1" 
        opacity="0.6"
      />
      
      {/* Monitor Stand */}
      <path 
        d="M10 16v2h4v-2" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        fill="none"
      />
      
      {/* Base */}
      <line 
        x1="8" 
        y1="20" 
        x2="16" 
        y2="20" 
        stroke="currentColor" 
        strokeWidth="1.5"
      />
    </g>
  </svg>
);

// Enhanced Activity Logo Component
const ActivityLogo = ({ className = "w-5 h-5" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      {/* Computer Monitor */}
      <rect 
        x="2" 
        y="3" 
        width="20" 
        height="14" 
        rx="2" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        fill="none"
      />
      
      {/* Activity Chart */}
      <path 
        d="M6 12l2-3 3 6 2-4 3 2" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Activity Dots */}
      <circle cx="6" cy="12" r="1.5" fill="currentColor" opacity="0.8"/>
      <circle cx="8" cy="9" r="1.5" fill="currentColor" opacity="0.8"/>
      <circle cx="11" cy="15" r="1.5" fill="currentColor" opacity="0.8"/>
      <circle cx="13" cy="11" r="1.5" fill="currentColor" opacity="0.8"/>
      <circle cx="16" cy="13" r="1.5" fill="currentColor" opacity="0.8"/>
      
      {/* Monitor Stand */}
      <path 
        d="M10 17v2h4v-2" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        fill="none"
      />
      
      {/* Base */}
      <line 
        x1="8" 
        y1="21" 
        x2="16" 
        y2="21" 
        stroke="currentColor" 
        strokeWidth="1.5"
      />
    </g>
  </svg>
);

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newAsset, setNewAsset] = useState({
    name: '',
    department: '',
    assignedTo: '',
    status: 'available',
    category: 'laptop'
  });
  const [departmentAllocation, setDepartmentAllocation] = useState([]);
  const [allocationLoading, setAllocationLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const departments = ['IT Department', 'Sales', 'Marketing', 'HR'];
  const statuses = ['Available', 'Assigned', 'UnderRepair'];
  const categories = ['laptop', 'desktop', 'monitor', 'printer', 'server', 'phone', 'tablet'];
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Current token:', token ? 'Token exists' : 'No token found'); // Debug log
    console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'None'); // Debug log
    if (!token) {
      navigate('/');
      return;
    }
  }, [navigate]);

  // Modify the existing useEffect for fetching assets
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        console.log('🔍 Fetching assets - Token exists:', !!token);
        
        if (!token) {
          console.log('❌ No token found, redirecting to login');
          navigate('/');
          return;
        }

        console.log('🚀 Making API call to: http://localhost:5000/api/asset/');
        const response = await axios.get('http://localhost:5000/api/asset/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('✅ Assets API Response:', response.data);
        console.log('📊 Number of assets received:', response.data?.length || 0);
        console.log('🔍 Assets data structure:', response.data);
        
        setAssets(response.data || []);
      } catch (error) {
        console.error('❌ Error fetching assets:', error);
        console.error('❌ Error response:', error.response?.data);
        console.error('❌ Error status:', error.response?.status);
        console.error('❌ Error headers:', error.response?.headers);
        
        if (error.response?.status === 401) {
          console.log('🔐 Unauthorized - removing token and redirecting');
          localStorage.removeItem('token');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Listen for asset data changes
    const handleAssetDataChange = (event) => {
      console.log('Asset data changed, refreshing dashboard...', event.detail);
      fetchData();
      fetchDepartmentAllocation();
      fetchRecentActivities();
      fetchAlerts();
    };
    
    window.addEventListener('assetDataChanged', handleAssetDataChange);
    
    return () => {
      window.removeEventListener('assetDataChanged', handleAssetDataChange);
    };
  }, [navigate]);

  const fetchDepartmentAllocation = async () => {
    try {
      setAllocationLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/dashboard/department-allocation', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartmentAllocation(response.data);
    } catch (error) {
      console.error('Error fetching department allocation:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
    } finally {
      setAllocationLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      setActivitiesLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/dashboard/activities', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecentActivities(response.data);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
    } finally {
      setActivitiesLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      setAlertsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/dashboard/alerts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Alerts API Response:', response.data); // Debug log
      setAlerts(Array.isArray(response.data) ? response.data : response.data?.alerts || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      console.error('Error response:', error.response?.data); // Debug log
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
    } finally {
      setAlertsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentAllocation();
    fetchRecentActivities();
    fetchAlerts();
  }, [navigate, assets]); // Will refresh when assets change

  // Calculate statistics
  console.log('📊 Calculating asset statistics...');
  console.log('📊 Assets array:', assets);
  console.log('📊 Assets length:', assets.length);
  
  const totalAssets = assets.length;
  const assignedAssets = assets.filter(asset => asset.status === 'Assigned').length;
  const underRepair = assets.filter(asset => asset.status === 'UnderRepair').length;
  const availableAssets = assets.filter(asset => asset.status === 'Available').length;
  // Note: AMC Due and critical repairs don't exist in current schema
  const criticalRepairs = 0; // Placeholder until priority field is added to schema
  const utilizationRate = totalAssets > 0 ? Math.round((assignedAssets / totalAssets) * 100) : 0;
  
  console.log('📊 Statistics calculated:');
  console.log('  - Total Assets:', totalAssets);
  console.log('  - Assigned Assets:', assignedAssets);
  console.log('  - Under Repair:', underRepair);
  console.log('  - Available Assets:', availableAssets);
  console.log('  - Utilization Rate:', utilizationRate + '%');
  console.log('🔍 Asset statuses found:', assets.map(asset => asset.status));

  // Enhanced activity icon function with professional styling
  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'assigned':
      case 'assignment':
        return { icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' };
      case 'added':
      case 'created':
        return { icon: Plus, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
      case 'maintenance':
      case 'repair':
        return { icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' };
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' };
      case 'system':
      case 'update':
        return { icon: ComputerLogo, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' };
      default:
        return { icon: ComputerLogo, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' };
    }
  };

  // Get alert severity styling
  const getAlertSeverity = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
      case 'high':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: 'text-red-600' };
      case 'medium':
      case 'warning':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: 'text-yellow-600' };
      case 'low':
      case 'info':
        return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: 'text-blue-600' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800', icon: 'text-gray-600' };
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const getDepartmentColor = (department, index) => {
    const colors = [
      { bg: 'bg-blue-500', text: 'text-blue-500' },
      { bg: 'bg-green-500', text: 'text-green-500' },
      { bg: 'bg-yellow-500', text: 'text-yellow-500' },
      { bg: 'bg-purple-500', text: 'text-purple-500' },
      { bg: 'bg-red-500', text: 'text-red-500' },
      { bg: 'bg-indigo-500', text: 'text-indigo-500' }
    ];
    return colors[index % colors.length] || colors[0];
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, iconBgColor, iconColor, trend, loading }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 hover:border-slate-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          {loading ? (
            <div className="h-8 bg-slate-200 rounded animate-pulse mt-2"></div>
          ) : (
            <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          )}
          {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${iconBgColor} shadow-sm`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      {trend && (
        <div className={`mt-4 flex items-center text-xs ${trend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          <TrendingUp className="w-4 h-4 mr-1" />
          <span className="font-medium">{trend > 0 ? '+' : ''}{trend}% from last month</span>
        </div>
      )}
    </div>
  );

  const DepartmentRow = ({ department, count, color, percentage }) => (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-all duration-200 group border border-slate-100 mb-2 hover:border-slate-200 hover:shadow-sm">
      <div className="flex items-center space-x-3 flex-1">
        <div className={`w-3 h-3 rounded-full ${color.bg} transition-transform duration-200 group-hover:scale-110 shadow-sm`}></div>
        <div className="flex-1">
          <span className="font-medium text-slate-800 group-hover:text-slate-900">{department}</span>
          {percentage && (
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${color.bg} transition-all duration-500 shadow-sm`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
      <div className="text-right">
        <span className="text-slate-900 font-bold text-lg">{count}</span>
        <span className="text-slate-500 text-sm ml-1">assets</span>
        {percentage && (
          <p className="text-xs text-slate-500 mt-1">{percentage.toFixed(1)}%</p>
        )}
      </div>
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
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">{asset.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
            {asset.status.replace('-', ' ')}
          </span>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <p><span className="font-medium text-gray-700">Department:</span> {asset.department}</p>
          <p><span className="font-medium text-gray-700">Category:</span> {asset.category}</p>
          {asset.assignedTo && (
            <p><span className="font-medium text-gray-700">Assigned to:</span> {asset.assignedTo}</p>
          )}
        </div>
        <div className="mt-3 flex space-x-2">
          <select 
            value={asset.status} 
            onChange={(e) => console.log(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1 flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status.replace('-', ' ')}</option>
            ))}
          </select>
          <button 
            onClick={() => console.log('Delete asset')}
            className="text-xs text-red-600 hover:text-white px-2 py-1 border border-red-200 rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate total assets for percentage calculation
  const totalAllocationAssets = departmentAllocation.reduce((sum, dept) => sum + (dept.count || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600 text-sm sm:text-base">Monitor and manage your organization's assets efficiently</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard
            title="Total Assets"
            value={totalAssets}
            subtitle="All registered assets"
            icon={Package}
            iconBgColor="bg-slate-100"
            iconColor="text-slate-600"
            trend={12}
            loading={loading}
          />
          <StatCard
            title="Assigned Assets"
            value={assignedAssets}
            subtitle={`${utilizationRate}% utilization`}
            icon={Users}
            iconBgColor="bg-blue-50"
            iconColor="text-blue-600"
            trend={8}
            loading={loading}
          />
          <StatCard
            title="Under Repair"
            value={underRepair}
            subtitle={`${criticalRepairs} critical`}
            icon={Wrench}
            iconBgColor="bg-amber-50"
            iconColor="text-amber-600"
            trend={-5}
            loading={loading}
          />
          <StatCard
            title="Available Assets"
            value={availableAssets}
            subtitle="Ready for assignment"
            icon={CheckCircle}
            iconBgColor="bg-emerald-50"
            iconColor="text-emerald-600"
            trend={5}
            loading={loading}
          />
        </div>

        {/* Asset Allocation by Department Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Asset Allocation by Department */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Asset Allocation by Department</h3>
              </div>
              {allocationLoading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              )}
            </div>
            
            <div className="space-y-1">
              {allocationLoading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-3 h-3 bg-slate-200 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-24 mb-2"></div>
                        <div className="w-full bg-slate-200 rounded-full h-2 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-6 bg-slate-200 rounded animate-pulse w-12 mb-1"></div>
                      <div className="h-3 bg-slate-200 rounded animate-pulse w-8"></div>
                    </div>
                  </div>
                ))
              ) : departmentAllocation.length > 0 ? (
                departmentAllocation.map((dept, index) => {
                  const percentage = totalAllocationAssets > 0 ? (dept.count / totalAllocationAssets) * 100 : 0;
                  return (
                    <DepartmentRow
                      key={dept.department || dept._id || index}
                      department={dept.department || dept._id}
                      count={dept.count || 0}
                      color={getDepartmentColor(dept.department, index)}
                      percentage={percentage}
                    />
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm">No department allocation data available</p>
                </div>
              )}
            </div>

            {!allocationLoading && departmentAllocation.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Total Assets Allocated</span>
                  <span className="font-bold text-slate-900 text-lg">{totalAllocationAssets}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/dashboard/assets"
                className="flex items-center p-4 rounded-xl bg-white hover:bg-blue-50 transition-all duration-200 border border-slate-200 hover:border-blue-200 hover:shadow-sm group"
              >
                <div className="bg-blue-50 p-3 rounded-xl mr-3 group-hover:bg-blue-100 transition-colors border border-blue-100">
                  <Plus className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-700 block">Add Asset</span>
                  <span className="text-xs text-slate-500">Register new equipment</span>
                </div>
              </Link>
              <Link
                to="/dashboard/assignment"
                className="flex items-center p-4 rounded-xl bg-white hover:bg-emerald-50 transition-all duration-200 border border-slate-200 hover:border-emerald-200 hover:shadow-sm group"
              >
                <div className="bg-emerald-50 p-3 rounded-xl mr-3 group-hover:bg-emerald-100 transition-colors border border-emerald-100">
                  <UserPlus className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-700 block">Assign Asset</span>
                  <span className="text-xs text-slate-500">Assign to employee</span>
                </div>
              </Link>
              <Link
                to="/dashboard/reports"
                className="flex items-center p-4 rounded-xl bg-white hover:bg-purple-50 transition-all duration-200 border border-slate-200 hover:border-purple-200 hover:shadow-sm group"
              >
                <div className="bg-purple-50 p-3 rounded-xl mr-3 group-hover:bg-purple-100 transition-colors border border-purple-100">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-700 block">Create Report</span>
                  <span className="text-xs text-slate-500">Generate audit report</span>
                </div>
              </Link>
              <Link
                to="/dashboard/maintainance"
                className="flex items-center p-4 rounded-xl bg-white hover:bg-amber-50 transition-all duration-200 border border-slate-200 hover:border-amber-200 hover:shadow-sm group"
              >
                <div className="bg-amber-50 p-3 rounded-xl mr-3 group-hover:bg-amber-100 transition-colors border border-amber-100">
                  <Wrench className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-700 block">Log Maintenance</span>
                  <span className="text-xs text-slate-500">Record repair activity</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activities and Alerts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-3 rounded-xl border border-indigo-100 shadow-sm">
                  <ActivityLogo className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Recent Activities</h3>
              </div>
              {activitiesLoading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
              )}
            </div>

            <div className="space-y-3">
              {activitiesLoading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : recentActivities.length > 0 ? (
                recentActivities.slice(0, 5).map((activity, index) => {
                  const activityIcon = getActivityIcon(activity.type);
                  const IconComponent = activityIcon.icon;
                  
                  return (
                    <div key={activity.id || index} className={`flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-all duration-200 border ${activityIcon.border} hover:shadow-sm group`}>
                      <div className={`p-2.5 rounded-xl ${activityIcon.bg} flex-shrink-0 shadow-sm border ${activityIcon.border} group-hover:scale-105 transition-transform duration-200`}>
                        <IconComponent className={`w-4 h-4 ${activityIcon.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate leading-relaxed">
                          {activity.title || activity.description || activity.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          {activity.timestamp ? formatTimeAgo(activity.timestamp) : activity.time || 'Just now'}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0 mt-2.5 shadow-sm"></div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <div className="bg-slate-50 p-4 rounded-xl w-fit mx-auto mb-4 border border-slate-100">
                    <ActivityLogo className="w-12 h-12 text-slate-300" />
                  </div>
                  <p className="text-sm font-medium">No recent activities</p>
                  <p className="text-xs text-slate-400 mt-1">Activity logs will appear here</p>
                </div>
              )}
            </div>

            {!activitiesLoading && recentActivities.length > 5 && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors hover:underline">
                  View all activities →
                </button>
              </div>
            )}
          </div>

          {/* Alerts & Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 p-3 rounded-xl border border-red-100 shadow-sm">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Alerts & Notifications</h3>
              </div>
              {alertsLoading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
              )}
            </div>

            <div className="space-y-3">
              {alertsLoading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="p-4 rounded-xl border animate-pulse">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-slate-200 rounded animate-pulse flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : alerts.length > 0 ? (
                alerts.slice(0, 5).map((alert, index) => {
                  const severity = getAlertSeverity(alert.severity || alert.priority);
                  
                  return (
                    <div key={alert.id || index} className={`p-4 rounded-xl border ${severity.bg} ${severity.border} hover:shadow-sm transition-all duration-200 group`}>
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className={`w-5 h-5 ${severity.icon} flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform duration-200`} />
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-bold ${severity.text} mb-1 leading-relaxed`}>
                            {alert.title || alert.message}
                          </h4>
                          {alert.description && (
                            <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                              {alert.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-500 font-medium">
                              {alert.timestamp ? formatTimeAgo(alert.timestamp) : alert.time || 'Just now'}
                            </p>
                            {alert.actionRequired && (
                              <span className="text-xs bg-white px-2 py-1 rounded-full border font-semibold shadow-sm">
                                Action Required
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <div className="bg-slate-50 p-4 rounded-xl w-fit mx-auto mb-4 border border-slate-100">
                    <AlertTriangle className="w-12 h-12 text-slate-300" />
                  </div>
                  <p className="text-sm font-medium">No alerts or notifications</p>
                  <p className="text-xs text-slate-400 mt-1">System alerts will appear here</p>
                </div>
              )}
            </div>

            {!alertsLoading && alerts.length > 5 && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button className="text-sm text-red-600 hover:text-red-700 font-semibold transition-colors hover:underline">
                  View all alerts →
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
    
  );
};

export default Dashboard;