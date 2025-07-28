import React, { useState, useEffect, useRef } from "react";
import Chart from 'chart.js/auto';
import { 
  FiPieChart, 
  FiDollarSign, 
  FiTool, 
  FiTruck, 
  FiRefreshCw, 
  FiTrendingUp, 
  FiTrendingDown,
  FiDownload,
  FiFilter,
  FiCalendar
} from 'react-icons/fi';

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
    activeVendors: 0,
    trends: {
      assets: 0,
      value: 0,
      maintenance: 0,
      vendors: 0
    }
  });

  const [departmentData, setDepartmentData] = useState([]);
  const [assetCostData, setAssetCostData] = useState([]);
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly');
  
  // Enhanced color schemes
  const COLORS = {
    primary: ["#4F46E5", "#7C3AED", "#EC4899", "#EF4444", "#F59E0B", "#10B981"],
    gradients: [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
    ]
  };

  // API base URL
  const API_BASE = 'http://localhost:5000/api/reports';

  // Calculate trends from data
  const calculateTrends = (currentData, previousData) => {
    if (!previousData || previousData.length === 0) return 0;
    const current = currentData.reduce((sum, item) => sum + (item.count || item.totalAssetValue || item.totalMaintenanceCost || item.value || 0), 0);
    const previous = previousData.reduce((sum, item) => sum + (item.count || item.totalAssetValue || item.totalMaintenanceCost || item.value || 0), 0);
    return previous > 0 ? ((current - previous) / previous * 100).toFixed(1) : 0;
  };

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

      // Check if all requests were successful
      if (!summaryRes.ok || !deptRes.ok || !assetRes.ok || !maintenanceRes.ok || !vendorRes.ok) {
        throw new Error('One or more API requests failed');
      }

      // Process responses
      const [summary, deptData, assetData, maintenanceDataRes, vendorDataRes] = await Promise.all([
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
        activeVendors: summary.activeVendors || 0,
        trends: {
          assets: summary.assetsTrend || 0,
          value: summary.valueTrend || 0,
          maintenance: summary.maintenanceTrend || 0,
          vendors: summary.vendorsTrend || 0
        }
      });

      const processedDeptData = Array.isArray(deptData) ? deptData : [];
      const processedAssetData = Array.isArray(assetData) ? assetData : [];
      const processedMaintenanceData = Array.isArray(maintenanceDataRes) ? maintenanceDataRes : [];
      const processedVendorData = Array.isArray(vendorDataRes) ? vendorDataRes : [];

      setDepartmentData(processedDeptData);
      setAssetCostData(processedAssetData);
      setMaintenanceData(processedMaintenanceData);
      setVendorData(processedVendorData);

      // Initialize charts after data is loaded
      setTimeout(initializeCharts, 100);
    } catch (error) {
      console.error('Error fetching reports:', error);
      
      // Set empty arrays on error to prevent chart rendering issues
      setDepartmentData([]);
      setAssetCostData([]);
      setMaintenanceData([]);
      setVendorData([]);
      
      // Keep summary data as 0 values on error
      setSummaryData({
        totalAssets: 0,
        totalValue: '₹0',
        maintenanceCost: '₹0',
        activeVendors: 0,
        trends: {
          assets: 0,
          value: 0,
          maintenance: 0,
          vendors: 0
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize enhanced charts
  const initializeCharts = () => {
    // Department Distribution - Enhanced Doughnut Chart
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
            backgroundColor: COLORS.primary,
            borderWidth: 0,
            borderRadius: 8,
            spacing: 2,
            hoverBorderWidth: 3,
            hoverBorderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '75%',
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderWidth: 0,
              padding: 16,
              cornerRadius: 8,
              titleFont: { size: 14, weight: '600' },
              bodyFont: { size: 13 },
              callbacks: {
                label: function(context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((context.raw * 100) / total).toFixed(1);
                  return `${context.label}: ${context.raw} assets (${percentage}%)`;
                }
              }
            }
          },
          animation: {
            animateRotate: true,
            duration: 1000
          }
        }
      });
    }

    // Asset Cost Trends - Professional Line Chart with Area Fill
    if (assetCostData.length > 0 && assetValueChartRef.current) {
      const ctx = assetValueChartRef.current.getContext('2d');
      
      // Create sophisticated gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, 'rgba(79, 70, 229, 0.15)');
      gradient.addColorStop(0.5, 'rgba(79, 70, 229, 0.08)');
      gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');

      if (chartInstances.current.assetValue) {
        chartInstances.current.assetValue.destroy();
      }

      chartInstances.current.assetValue = new Chart(ctx, {
        type: 'line',
        data: {
          labels: assetCostData.map(item => item._id),
          datasets: [{
            label: 'Asset Cost',
            data: assetCostData.map(item => item.totalAssetValue || item.totalCost || item.value || 0),
            borderColor: '#4F46E5',
            backgroundColor: gradient,
            borderWidth: 3,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#4F46E5',
            pointBorderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointHoverBorderWidth: 4,
            pointHoverBackgroundColor: '#4F46E5',
            pointHoverBorderColor: '#ffffff',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              titleColor: '#ffffff',
              bodyColor: '#cbd5e1',
              borderWidth: 0,
              padding: 16,
              cornerRadius: 12,
              titleFont: { size: 14, weight: '600' },
              bodyFont: { size: 13, weight: '500' },
              displayColors: false,
              callbacks: {
                title: function(context) {
                  return `Period: ${context[0].label}`;
                },
                label: function(context) {
                  return `Asset Cost: ₹${context.raw.toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { 
                display: false 
              },
              ticks: { 
                color: '#64748b',
                font: { size: 12, weight: '500' },
                padding: 8
              },
              border: {
                display: false
              }
            },
            y: {
              grid: { 
                color: 'rgba(148, 163, 184, 0.1)',
                drawBorder: false,
                lineWidth: 1
              },
              ticks: {
                color: '#64748b',
                font: { size: 12, weight: '500' },
                callback: function(value) {
                  if (value >= 100000) {
                    return '₹' + (value / 100000).toFixed(1) + 'L';
                  } else if (value >= 1000) {
                    return '₹' + (value / 1000).toFixed(0) + 'K';
                  }
                  return '₹' + value;
                },
                padding: 12
              },
              border: {
                display: false
              }
            }
          },
          animation: {
            duration: 1800,
            easing: 'easeInOutCubic'
          }
        }
      });
    }

    // Maintenance Trends - Professional Bar Chart with Gradients
    if (maintenanceData.length > 0 && maintenanceChartRef.current) {
      const ctx = maintenanceChartRef.current.getContext('2d');

      if (chartInstances.current.maintenance) {
        chartInstances.current.maintenance.destroy();
      }

      // Create gradient for bars
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, '#059669');
      gradient.addColorStop(0.6, '#10B981');
      gradient.addColorStop(1, '#34D399');

      chartInstances.current.maintenance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: maintenanceData.map(item => item._id),
          datasets: [{
            label: 'Maintenance Cost',
            data: maintenanceData.map(item => item.totalMaintenanceCost || item.totalCost || item.cost || 0),
            backgroundColor: gradient,
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: {
              topLeft: 12,
              topRight: 12,
              bottomLeft: 0,
              bottomRight: 0
            },
            borderSkipped: false,
            barThickness: 45,
            maxBarThickness: 60,
            categoryPercentage: 0.8,
            barPercentage: 0.9
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              titleColor: '#ffffff',
              bodyColor: '#cbd5e1',
              borderWidth: 0,
              padding: 16,
              cornerRadius: 12,
              titleFont: { size: 14, weight: '600' },
              bodyFont: { size: 13, weight: '500' },
              displayColors: false,
              callbacks: {
                title: function(context) {
                  return `Period: ${context[0].label}`;
                },
                label: function(context) {
                  return `Maintenance: ₹${context.raw.toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { 
                color: '#64748b',
                font: { size: 12, weight: '500' },
                padding: 8
              },
              border: { display: false }
            },
            y: {
              grid: { 
                color: 'rgba(148, 163, 184, 0.1)',
                drawBorder: false,
                lineWidth: 1
              },
              ticks: {
                color: '#64748b',
                font: { size: 12, weight: '500' },
                callback: function(value) {
                  if (value >= 100000) {
                    return '₹' + (value / 100000).toFixed(1) + 'L';
                  } else if (value >= 1000) {
                    return '₹' + (value / 1000).toFixed(0) + 'K';
                  }
                  return '₹' + value;
                },
                padding: 12
              },
              border: { display: false }
            }
          },
          animation: {
            duration: 1500,
            easing: 'easeOutQuart'
          }
        }
      });
    }

    // Vendor Portfolio - Enhanced Polar Area Chart
    if (vendorData.length > 0 && vendorChartRef.current) {
      const ctx = vendorChartRef.current.getContext('2d');

      if (chartInstances.current.vendor) {
        chartInstances.current.vendor.destroy();
      }

      chartInstances.current.vendor = new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: vendorData.map(item => item._id),
          datasets: [{
            data: vendorData.map(item => item.value),
            backgroundColor: COLORS.primary.map(color => color + '80'),
            borderColor: COLORS.primary,
            borderWidth: 2,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderWidth: 0,
              padding: 16,
              cornerRadius: 8,
              titleFont: { size: 14, weight: '600' },
              bodyFont: { size: 13 },
              callbacks: {
                label: function(context) {
                  return `${context.label}: ₹${context.raw.toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            r: {
              grid: { color: 'rgba(107, 114, 128, 0.1)' },
              ticks: {
                display: false
              }
            }
          },
          animation: {
            duration: 1500,
            easing: 'easeInOutQuart'
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

  // Enhanced Stat Card Component
  const StatCard = ({ title, value, icon, trend, loading = false, iconColor = "text-blue-600" }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {trend && trend !== 0 && (
              <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                trend > 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
              }`}>
                {trend > 0 ? <FiTrendingUp className="w-3 h-3 mr-1" /> : <FiTrendingDown className="w-3 h-3 mr-1" />}
                {Math.abs(trend)}%
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : value === '₹0' || value === 0 || value === '0' ? (
              <span className="text-gray-400">No data</span>
            ) : (
              value
            )}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-gray-50">
          {React.cloneElement(icon, { className: `w-6 h-6 ${iconColor}` })}
        </div>
      </div>
    </div>
  );

  // Enhanced Chart Container Component
  const ChartCard = ({ title, children, className = '', loading, error, actions }) => (
    <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">Performance metrics overview</p>
        </div>
        <div className="flex items-center space-x-3">
          {actions}
          <div className="flex items-center space-x-2">
            <select 
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button 
              onClick={fetchReportsData}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
              disabled={isLoading}
            >
              <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      <div className="h-80 relative">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-red-500">
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <p>Error loading chart data</p>
            </div>
          </div>
        ) : (
          <div className="h-full">{children}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-6">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Asset Analytics</h1>
            <p className="text-gray-600">Comprehensive insights into your asset portfolio performance</p>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Assets" 
          value={summaryData.totalAssets.toLocaleString()} 
          icon={<FiPieChart />}
          trend={parseFloat(summaryData.trends.assets)}
          loading={isLoading}
          iconColor="text-indigo-600"
        />
        <StatCard 
          title="Total Value" 
          value={summaryData.totalValue} 
          icon={<FiDollarSign />}
          trend={parseFloat(summaryData.trends.value)}
          loading={isLoading}
          iconColor="text-green-600"
        />
        <StatCard 
          title="Maintenance Cost" 
          value={summaryData.maintenanceCost} 
          icon={<FiTool />}
          trend={parseFloat(summaryData.trends.maintenance)}
          loading={isLoading}
          iconColor="text-red-600"
        />
        <StatCard 
          title="Active Vendors" 
          value={summaryData.activeVendors} 
          icon={<FiTruck />}
          trend={parseFloat(summaryData.trends.vendors)}
          loading={isLoading}
          iconColor="text-yellow-600"
        />
      </div>

      {/* Enhanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Department Distribution */}
        <ChartCard 
          title="Department Distribution" 
          loading={isLoading}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="h-full flex items-center justify-center">
              <canvas ref={departmentChartRef} className="max-w-full max-h-full" />
            </div>
            <div className="space-y-3 overflow-y-auto max-h-80">
              {departmentData.length > 0 ? departmentData.map((dept, index) => (
                <div key={dept._id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3 shadow-sm" 
                      style={{ backgroundColor: COLORS.primary[index % COLORS.primary.length] }}
                    />
                    <span className="text-sm font-medium text-gray-700">{dept._id}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">{dept.count}</span>
                    <div className="text-xs text-gray-500">assets</div>
                  </div>
                </div>
              )) : (
                <div className="flex items-center justify-center h-40 text-gray-500">
                  <div className="text-center">
                    <FiPieChart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No department data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ChartCard>

        {/* Asset Value Trend */}
        <ChartCard 
          title="Asset Value Growth" 
          loading={isLoading}
          actions={
            <div className="text-right">
              <div className="text-sm text-gray-500">This Month</div>
              <div className={`text-lg font-bold ${summaryData.trends.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summaryData.trends.value >= 0 ? '+' : ''}{summaryData.trends.value}%
              </div>
            </div>
          }
        >
          <canvas ref={assetValueChartRef} className="w-full h-full" />
        </ChartCard>
      </div>

      {/* Maintenance Trends - Full Width */}
      <div className="mb-8">
        <ChartCard 
          title="Maintenance Cost Analysis" 
          loading={isLoading}
          actions={
            <div className="text-right">
              <div className="text-sm text-gray-500">Monthly Average</div>
              <div className={`text-lg font-bold ${summaryData.trends.maintenance <= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                ₹{maintenanceData.length > 0 ? (maintenanceData.reduce((sum, item) => sum + item.totalMaintenanceCost, 0) / maintenanceData.length / 100000).toFixed(2) : '0'}L
              </div>
            </div>
          }
        >
          <canvas ref={maintenanceChartRef} className="w-full h-full" />
        </ChartCard>
      </div>

      {/* Vendor Portfolio */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Vendor Portfolio Analysis</h3>
            <p className="text-sm text-gray-500 mt-1">Distribution of vendor partnerships and spending</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Vendors</div>
            <div className="text-2xl font-bold text-indigo-600">{vendorData.length}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 flex items-center justify-center">
            <canvas ref={vendorChartRef} className="max-w-full max-h-full" />
          </div>
          <div className="space-y-4 overflow-y-auto max-h-80">
            {vendorData.length > 0 ? vendorData.map((vendor, index) => {
              const totalValue = vendorData.reduce((sum, v) => sum + v.value, 0);
              const percentage = totalValue > 0 ? ((vendor.value / totalValue) * 100).toFixed(1) : 0;
              return (
                <div key={vendor._id} className="p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3 shadow-sm" 
                        style={{ backgroundColor: COLORS.primary[index % COLORS.primary.length] }}
                      />
                      <span className="font-semibold text-gray-900">{vendor._id}</span>
                    </div>
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      {percentage}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Contract Value</span>
                    <span className="text-lg font-bold text-gray-900">₹{vendor.value?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: COLORS.primary[index % COLORS.primary.length]
                      }}
                    />
                  </div>
                </div>
              );
            }) : (
              <div className="flex items-center justify-center h-40 text-gray-500">
                <div className="text-center">
                  <FiTruck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No vendor data available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;