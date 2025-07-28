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
  const statuses = ['available', 'assigned', 'under-repair', 'amc-due'];
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
  const totalAssets = assets.length;
  const assignedAssets = assets.filter(asset => asset.status === 'assigned').length;
  const underRepair = assets.filter(asset => asset.status === 'under-repair').length;
  const amcDue = assets.filter(asset => asset.status === 'amc-due').length;
  const criticalRepairs = assets.filter(asset => asset.status === 'under-repair' && asset.priority === 'critical').length;
  const utilizationRate = totalAssets > 0 ? Math.round((assignedAssets / totalAssets) * 100) : 0;

  // Get activity icon based on activity type
  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'assigned':
      case 'assignment':
        return { icon: UserPlus, color: 'text-green-600', bg: 'bg-green-100' };
      case 'added':
      case 'created':
        return { icon: Plus, color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'maintenance':
      case 'repair':
        return { icon: Wrench, color: 'text-orange-600', bg: 'bg-orange-100' };
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' };
      default:
        return { icon: Activity, color: 'text-gray-600', bg: 'bg-gray-100' };
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
    <div className="bg-white rounded-lg p-5 shadow-sm border border-blue-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          {loading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse mt-2"></div>
          ) : (
            <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          )}
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${iconBgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      {trend && (
        <div className={`mt-3 flex items-center text-xs ${trend > 0 ? 'text-gray-300' : 'text-red-300'}`}>
          <TrendingUp className="w-4 h-4 mr-1" />
          <span className="font-medium">{trend > 0 ? '+' : ''}{trend}% from last month</span>
        </div>
      )}
    </div>
  );

  const DepartmentRow = ({ department, count, color, percentage }) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-all duration-200 group border border-gray-100 mb-2">
      <div className="flex items-center space-x-3 flex-1">
        <div className={`w-3 h-3 rounded-full ${color.bg} transition-transform duration-200 group-hover:scale-110`}></div>
        <div className="flex-1">
          <span className="font-medium text-gray-800 group-hover:text-gray-900">{department}</span>
          {percentage && (
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className={`h-1.5 rounded-full ${color.bg} transition-all duration-300`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
      <div className="text-right">
        <span className="text-gray-900 font-semibold text-lg">{count}</span>
        <span className="text-gray-500 text-sm ml-1">assets</span>
        {percentage && (
          <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</p>
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
      <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate total assets for percentage calculation
  const totalAllocationAssets = departmentAllocation.reduce((sum, dept) => sum + (dept.count || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-500 text-sm sm:text-base">Monitor and manage your organization's assets efficiently</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard
            title="Total Assets"
            value={totalAssets}
            subtitle="All registered assets"
            icon={Package}
            iconBgColor="bg-gray-700"
            iconColor="text-gray-300"
            trend={12}
            loading={loading}
          />
          <StatCard
            title="Assigned Assets"
            value={assignedAssets}
            subtitle={`${utilizationRate}% utilization`}
            icon={Users}
            iconBgColor="bg-gray-700"
            iconColor="text-gray-300"
            trend={8}
            loading={loading}
          />
          <StatCard
            title="Under Repair"
            value={underRepair}
            subtitle={`${criticalRepairs} critical`}
            icon={Wrench}
            iconBgColor="bg-orange-900"
            iconColor="text-orange-300"
            trend={-5}
            loading={loading}
          />
          <StatCard
            title="AMC Due"
            value={amcDue}
            subtitle="Maintenance required"
            icon={Clock}
            iconBgColor="bg-red-900"
            iconColor="text-red-300"
            trend={3}
            loading={loading}
          />
        </div>

        {/* Asset Allocation by Department Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Asset Allocation by Department */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Asset Allocation by Department</h3>
              </div>
              {allocationLoading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              )}
            </div>
            
            <div className="space-y-1">
              {allocationLoading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2"></div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-12 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-8"></div>
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
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No department allocation data available</p>
                </div>
              )}
            </div>

            {!allocationLoading && departmentAllocation.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Total Assets Allocated</span>
                  <span className="font-semibold text-gray-900">{totalAllocationAssets}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/dashboard/assets"
                className="flex items-center p-3 rounded-lg bg-white hover:bg-blue-50 transition-colors duration-200 border border-gray-200 hover:border-blue-200 hover:shadow-sm group"
              >
                <div className="bg-blue-50 p-2 rounded-lg mr-3 group-hover:bg-blue-100 transition-colors">
                  <Plus className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 block">Add Asset</span>
                  <span className="text-xs text-gray-500">Register new equipment</span>
                </div>
              </Link>
              <Link
                to="/dashboard/assignment"
                className="flex items-center p-3 rounded-lg bg-white hover:bg-green-50 transition-colors duration-200 border border-gray-200 hover:border-green-200 hover:shadow-sm group"
              >
                <div className="bg-green-50 p-2 rounded-lg mr-3 group-hover:bg-green-100 transition-colors">
                  <UserPlus className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 block">Assign Asset</span>
                  <span className="text-xs text-gray-500">Assign to employee</span>
                </div>
              </Link>
              <Link
                to="/dashboard/reports"
                className="flex items-center p-3 rounded-lg bg-white hover:bg-purple-50 transition-colors duration-200 border border-gray-200 hover:border-purple-200 hover:shadow-sm group"
              >
                <div className="bg-purple-50 p-2 rounded-lg mr-3 group-hover:bg-purple-100 transition-colors">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 block">Create Report</span>
                  <span className="text-xs text-gray-500">Generate audit report</span>
                </div>
              </Link>
              <Link
                to="/dashboard/maintainance"
                className="flex items-center p-3 rounded-lg bg-white hover:bg-orange-50 transition-colors duration-200 border border-gray-200 hover:border-orange-200 hover:shadow-sm group"
              >
                <div className="bg-orange-50 p-2 rounded-lg mr-3 group-hover:bg-orange-100 transition-colors">
                  <Wrench className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 block">Log Maintenance</span>
                  <span className="text-xs text-gray-500">Record repair activity</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activities and Alerts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-2 rounded-lg">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
              </div>
              {activitiesLoading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
              )}
            </div>

            <div className="space-y-3">
              {activitiesLoading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : recentActivities.length > 0 ? (
                recentActivities.slice(0, 5).map((activity, index) => {
                  const activityIcon = getActivityIcon(activity.type);
                  const IconComponent = activityIcon.icon;
                  
                  return (
                    <div key={activity.id || index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100">
                      <div className={`p-2 rounded-full ${activityIcon.bg} flex-shrink-0`}>
                        <IconComponent className={`w-4 h-4 ${activityIcon.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.title || activity.description || activity.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.timestamp ? formatTimeAgo(activity.timestamp) : activity.time || 'Just now'}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0 mt-2"></div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No recent activities</p>
                </div>
              )}
            </div>

            {!activitiesLoading && recentActivities.length > 5 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  View all activities
                </button>
              </div>
            )}
          </div>

          {/* Alerts & Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-red-50 p-2 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Alerts & Notifications</h3>
              </div>
              {alertsLoading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
              )}
            </div>

            <div className="space-y-3">
              {alertsLoading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="p-4 rounded-lg border animate-pulse">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : alerts.length > 0 ? (
                alerts.slice(0, 5).map((alert, index) => {
                  const severity = getAlertSeverity(alert.severity || alert.priority);
                  
                  return (
                    <div key={alert.id || index} className={`p-4 rounded-lg border ${severity.bg} ${severity.border} hover:shadow-sm transition-all duration-200`}>
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className={`w-5 h-5 ${severity.icon} flex-shrink-0 mt-0.5`} />
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-semibold ${severity.text} mb-1`}>
                            {alert.title || alert.message}
                          </h4>
                          {alert.description && (
                            <p className="text-xs text-gray-600 mb-2">
                              {alert.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                              {alert.timestamp ? formatTimeAgo(alert.timestamp) : alert.time || 'Just now'}
                            </p>
                            {alert.actionRequired && (
                              <span className="text-xs bg-white px-2 py-1 rounded-full border font-medium">
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
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No alerts or notifications</p>
                </div>
              )}
            </div>

            {!alertsLoading && alerts.length > 5 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors">
                  View all alerts
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