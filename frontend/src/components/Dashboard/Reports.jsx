import React, { useState, useEffect, useRef } from "react";
import Chart from 'chart.js/auto';
import { FiPieChart, FiDollarSign, FiTool, FiTruck, FiRefreshCw } from 'react-icons/fi';

const Reports = () => {
  // Chart references
  const departmentChartRef = useRef(null);
  const assetValueChartRef = useRef(null);
  const maintenanceChartRef = useRef(null);
  const vendorChartRef = useRef(null);
  const chartInstances = useRef({});

  // State for API data
  const [summaryData, setSummaryData] = useState({
    totalAssets: 0,
    totalValue: '₹0',
    maintenanceCost: '₹0',
    activeVendors: 0
  });
  const [departmentData, setDepartmentData] = useState([]);
  const [assetCostData, setAssetCostData] = useState([]);
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly');
  
  // API base URL
  const API_BASE = 'http://localhost:5000/api/reports';

  // Color scheme
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  // Fetch all reports data
  const fetchReportsData = async () => {
    setIsLoading(true);
    try {
      // Fetch all data in parallel
      const [summaryRes, deptRes, assetRes, maintenanceRes, vendorRes] = await Promise.all([
        fetch(`${API_BASE}/summary`),
        fetch(`${API_BASE}/department-distribution`),
        fetch(`${API_BASE}/asset-cost`),
        fetch(`${API_BASE}/maintenance-trends`),
        fetch(`${API_BASE}/vendor-portfolio`)
      ]);

      // Process responses
      const [summary, deptData, assetData, maintenanceData, vendorData] = await Promise.all([
        summaryRes.json(),
        deptRes.json(),
        assetRes.json(),
        maintenanceRes.json(),
        vendorRes.json()
      ]);

      // Update state with API data
      setSummaryData({
        totalAssets: summary.totalAssets || 0,
        totalValue: summary.totalAssetValue ? `₹${summary.totalAssetValue.toLocaleString()}` : '₹0',
        maintenanceCost: summary.totalMaintenanceCost ? `₹${summary.totalMaintenanceCost.toLocaleString()}` : '₹0',
        activeVendors: summary.activeVendors || 0
      });

      setDepartmentData(Array.isArray(deptData) ? deptData : []);
      setAssetCostData(Array.isArray(assetData) ? assetData : []);
      setMaintenanceData(Array.isArray(maintenanceData) ? maintenanceData : []);
      setVendorData(Array.isArray(vendorData) ? vendorData : []);

      // Initialize charts after data is loaded
      setTimeout(initializeCharts, 100);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize charts
  const initializeCharts = () => {
    // Department Distribution - Doughnut Chart
    if (departmentData.length > 0 && departmentChartRef.current) {
      const ctx = departmentChartRef.current.getContext('2d');
      
      if (chartInstances.current.department) {
        chartInstances.current.department.destroy();
      }
      
      chartInstances.current.department = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: departmentData.map(item => item._id),
          datasets: [{
            data: departmentData.map(item => item.count),
            backgroundColor: COLORS,
            borderWidth: 2,
            borderColor: '#fff',
            borderRadius: 4,
            spacing: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'right',
              labels: {
                usePointStyle: true,
                padding: 20,
                font: { size: 12 }
              }
            },
            tooltip: {
              backgroundColor: 'white',
              titleColor: '#1f2937',
              bodyColor: '#4b5563',
              borderColor: '#e5e7eb',
              borderWidth: 1,
              padding: 12,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              callbacks: {
                label: function(context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((context.raw * 100) / total).toFixed(1);
                  return `${context.label}: ${context.raw} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }

    // Asset Value Trend - Line Chart
    if (assetCostData.length > 0 && assetValueChartRef.current) {
      const ctx = assetValueChartRef.current.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 200);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

      if (chartInstances.current.assetValue) {
        chartInstances.current.assetValue.destroy();
      }

      chartInstances.current.assetValue = new Chart(ctx, {
        type: 'line',
        data: {
          labels: assetCostData.map(item => item._id),
          datasets: [{
            label: 'Asset Value',
            data: assetCostData.map(item => item.totalAssetValue),
            borderColor: '#3b82f6',
            backgroundColor: gradient,
            borderWidth: 2,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#3b82f6',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'white',
              titleColor: '#1f2937',
              bodyColor: '#4b5563',
              borderColor: '#e5e7eb',
              borderWidth: 1,
              padding: 12,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              callbacks: {
                label: function(context) {
                  return `₹${context.raw.toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#6b7280' }
            },
            y: {
              grid: { color: '#f3f4f6', drawBorder: false },
              ticks: {
                color: '#6b7280',
                callback: function(value) {
                  return '₹' + (value / 1000).toFixed(0) + 'K';
                }
              }
            }
          }
        }
      });
    }

    // Maintenance Trends - Bar Chart
    if (maintenanceData.length > 0 && maintenanceChartRef.current) {
      const ctx = maintenanceChartRef.current.getContext('2d');

      if (chartInstances.current.maintenance) {
        chartInstances.current.maintenance.destroy();
      }

      chartInstances.current.maintenance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: maintenanceData.map(item => item._id),
          datasets: [{
            label: 'Maintenance Cost (₹)',
            data: maintenanceData.map(item => item.totalMaintenanceCost),
            backgroundColor: COLORS[1] + '80', // 50% opacity
            borderColor: COLORS[1],
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'white',
              titleColor: '#1f2937',
              bodyColor: '#4b5563',
              borderColor: '#e5e7eb',
              borderWidth: 1,
              padding: 12,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              callbacks: {
                label: function(context) {
                  return '₹' + context.raw.toLocaleString();
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#6b7280' }
            },
            y: {
              grid: { color: '#f3f4f6', drawBorder: false },
              ticks: {
                color: '#6b7280',
                callback: function(value) {
                  return '₹' + (value / 1000).toFixed(0) + 'K';
                }
              }
            }
          }
        }
      });
    }

    // Vendor Portfolio - Doughnut Chart
    if (vendorData.length > 0 && vendorChartRef.current) {
      const ctx = vendorChartRef.current.getContext('2d');

      if (chartInstances.current.vendor) {
        chartInstances.current.vendor.destroy();
      }

      chartInstances.current.vendor = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: vendorData.map(item => item._id),
          datasets: [{
            data: vendorData.map(item => item.value),
            backgroundColor: COLORS,
            borderWidth: 2,
            borderColor: '#fff',
            borderRadius: 4,
            spacing: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'white',
              titleColor: '#1f2937',
              bodyColor: '#4b5563',
              borderColor: '#e5e7eb',
              borderWidth: 1,
              padding: 12,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              callbacks: {
                label: function(context) {
                  return `${context.label}: ₹${context.raw.toLocaleString()}`;
                }
              }
            }
          }
        }
      });
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchReportsData();

    // Cleanup charts on unmount
    return () => {
      Object.values(chartInstances.current).forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, []);

  // Format currency
  const formatCurrency = (value) => {
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  // Stat Card Component
  const StatCard = ({ title, value, icon, color, loading = false }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {loading ? '...' : value}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          {icon}
        </div>
      </div>
    </div>
  );

  // Chart Container Component
  const ChartCard = ({ title, children, className = '', loading, error }) => (
    <div className={`bg-white p-5 rounded-xl border border-gray-100 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          <select 
            className="text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button 
            onClick={fetchReportsData}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            disabled={isLoading}
          >
            <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      <div className="h-80">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-red-500">
            Error loading data
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Asset Reports</h1>
        <p className="text-gray-600">Overview of your asset management metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Assets" 
          value={summaryData.totalAssets.toLocaleString()} 
          icon={<FiPieChart className="w-5 h-5 text-blue-500" />}
          color="text-blue-500"
          loading={isLoading}
        />
        <StatCard 
          title="Total Value" 
          value={summaryData.totalValue} 
          icon={<FiDollarSign className="w-5 h-5 text-green-500" />}
          color="text-green-500"
          loading={isLoading}
        />
        <StatCard 
          title="Maintenance" 
          value={summaryData.maintenanceCost} 
          icon={<FiTool className="w-5 h-5 text-amber-500" />}
          color="text-amber-500"
          loading={isLoading}
        />
        <StatCard 
          title="Active Vendors" 
          value={summaryData.activeVendors} 
          icon={<FiTruck className="w-5 h-5 text-violet-500" />}
          color="text-violet-500"
          loading={isLoading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Department Distribution */}
        <ChartCard 
          title="Department Distribution" 
          loading={isLoading}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            <div className="h-64 lg:h-auto">
              <canvas ref={departmentChartRef} className="max-w-full max-h-full" />
            </div>
            <div className="space-y-2 overflow-y-auto max-h-64 lg:max-h-none">
              {departmentData.map((dept, index) => (
                <div key={dept._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium text-gray-700">{dept._id}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{dept.count}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Asset Value Trend */}
        <ChartCard 
          title="Asset Value Trend" 
          loading={isLoading}
        >
          <canvas ref={assetValueChartRef} className="w-full h-full" />
        </ChartCard>

        {/* Maintenance Trends */}
        <ChartCard 
          title="Maintenance Trends" 
          loading={isLoading}
          className="lg:col-span-2"
        >
          <canvas ref={maintenanceChartRef} className="w-full h-full" />
        </ChartCard>
      </div>

      {/* Vendor Portfolio */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Vendor Portfolio</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 flex items-center justify-center">
            <canvas ref={vendorChartRef} className="max-w-full max-h-full" />
          </div>
          <div className="space-y-3 overflow-y-auto max-h-80">
            {vendorData.map((vendor, index) => (
              <div key={vendor._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-gray-900">{vendor._id}</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">
                    {((vendor.value / vendorData.reduce((sum, v) => sum + v.value, 0)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <span>Value: </span>
                  <span className="font-medium">₹{vendor.value?.toLocaleString() || '0'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;