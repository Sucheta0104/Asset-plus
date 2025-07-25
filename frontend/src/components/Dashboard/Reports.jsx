import React, { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Area, AreaChart,
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6", "#ec4899", "#84cc16"];

const Reports = () => {
  // State for API data
  const [summaryData, setSummaryData] = useState({
    totalAssets: 0,
    totalValue: '$0',
    maintenanceCost: '$0',
    activeVendors: 0
  });
  const [departmentData, setDepartmentData] = useState([]);
  const [assetCostData, setAssetCostData] = useState([]);
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState({
    summary: true,
    department: true,
    assetCost: true,
    maintenance: true,
    vendor: true
  });

  // Error states
  const [errors, setErrors] = useState({});

  // API base URL
  const API_BASE = 'http://localhost:5000/api/reports';

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      // Fetch summary data
      try {
        setLoading(prev => ({ ...prev, summary: true }));
        const summaryResponse = await fetch(`${API_BASE}/summary`);
        if (summaryResponse.ok) {
          const summary = await summaryResponse.json();
          // Format the data properly
          setSummaryData({
            totalAssets: summary.totalAssets || 0,
            totalValue: summary.totalAssetValue ? `₹${summary.totalAssetValue.toLocaleString()}` : '₹0',
            maintenanceCost: summary.totalMaintenanceCost ? `₹${summary.totalMaintenanceCost.toLocaleString()}` : '₹0',
            activeVendors: summary.activeVendors || 0
          });
        } else {
          throw new Error(`HTTP ${summaryResponse.status}`);
        }
      } catch (error) {
        console.error('Summary API error:', error);
        setErrors(prev => ({ ...prev, summary: error.message }));
      } finally {
        setLoading(prev => ({ ...prev, summary: false }));
      }

      // Fetch department distribution
      try {
        setLoading(prev => ({ ...prev, department: true }));
        const deptResponse = await fetch(`${API_BASE}/department-distribution`);
        if (deptResponse.ok) {
          const dept = await deptResponse.json();
          setDepartmentData(Array.isArray(dept) ? dept : []);
        } else {
          throw new Error(`HTTP ${deptResponse.status}`);
        }
      } catch (error) {
        console.error('Department API error:', error);
        setErrors(prev => ({ ...prev, department: error.message }));
      } finally {
        setLoading(prev => ({ ...prev, department: false }));
      }

      // Fetch asset cost data
      try {
        setLoading(prev => ({ ...prev, assetCost: true }));
        const assetResponse = await fetch(`${API_BASE}/asset-cost`);
        if (assetResponse.ok) {
          const asset = await assetResponse.json();
          setAssetCostData(Array.isArray(asset) ? asset : []);
        } else {
          throw new Error(`HTTP ${assetResponse.status}`);
        }
      } catch (error) {
        console.error('Asset cost API error:', error);
        setErrors(prev => ({ ...prev, assetCost: error.message }));
      } finally {
        setLoading(prev => ({ ...prev, assetCost: false }));
      }

      // Fetch maintenance trends
      try {
        setLoading(prev => ({ ...prev, maintenance: true }));
        const maintenanceResponse = await fetch(`${API_BASE}/maintenance-trends`);
        if (maintenanceResponse.ok) {
          const maintenance = await maintenanceResponse.json();
          setMaintenanceData(Array.isArray(maintenance) ? maintenance : []);
        } else {
          throw new Error(`HTTP ${maintenanceResponse.status}`);
        }
      } catch (error) {
        console.error('Maintenance API error:', error);
        setErrors(prev => ({ ...prev, maintenance: error.message }));
      } finally {
        setLoading(prev => ({ ...prev, maintenance: false }));
      }

      // Fetch vendor portfolio
      try {
        setLoading(prev => ({ ...prev, vendor: true }));
        const vendorResponse = await fetch(`${API_BASE}/vendor-portfolio`);
        if (vendorResponse.ok) {
          const vendor = await vendorResponse.json();
          setVendorData(Array.isArray(vendor) ? vendor : []);
        } else {
          throw new Error(`HTTP ${vendorResponse.status}`);
        }
      } catch (error) {
        console.error('Vendor API error:', error);
        setErrors(prev => ({ ...prev, vendor: error.message }));
      } finally {
        setLoading(prev => ({ ...prev, vendor: false }));
      }
    };

    fetchData();
  }, []);

  const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, _id }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{color: entry.color}} className="text-sm">
              {`${entry.dataKey}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ title, value, subtitle, color = "bg-blue-500", loading = false }) => (
    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 min-h-[120px]">
      <div className={`w-3 h-8 sm:h-12 ${color} rounded-full mb-2`}></div>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
          <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ) : (
        <>
          <h4 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{value}</h4>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">{title}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </>
      )}
    </div>
  );

  const ChartContainer = ({ title, color, loading, error, children, className = "" }) => (
    <div className={`bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h3>
        <div className={`w-3 h-3 ${color} rounded-full`}></div>
      </div>
      <div className="h-64 sm:h-80">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500 text-sm text-center px-4">Error loading data: {error}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Asset Management Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Comprehensive overview of your organization's assets and reports</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard 
            title="Total Assets" 
            value={summaryData.totalAssets?.toLocaleString() || "0"} 
            color="bg-blue-500" 
            subtitle="Across all departments"
            loading={loading.summary}
          />
          <StatCard 
            title="Total Value" 
            value={summaryData.totalValue || "$0"} 
            color="bg-green-500" 
            subtitle="Asset portfolio value"
            loading={loading.summary}
          />
          <StatCard 
            title="Maintenance Cost" 
            value={summaryData.maintenanceCost || "$0"} 
            color="bg-yellow-500" 
            subtitle="This year"
            loading={loading.summary}
          />
          <StatCard 
            title="Active Vendors" 
            value={summaryData.activeVendors?.toLocaleString() || "0"} 
            color="bg-purple-500" 
            subtitle="Supplier partnerships"
            loading={loading.summary}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Top Row - Department Distribution */}
          <div className="w-full">
            <ChartContainer 
              title="Department Distribution" 
              color="bg-blue-500"
              loading={loading.department}
              error={errors.department}
            >
              {departmentData.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  <div className="flex justify-center items-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={CustomPieLabel}
                          outerRadius={100}
                          innerRadius={40}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="_id"
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={CustomTooltip} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800 mb-3">Department Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                      {departmentData.map((dept, index) => (
                        <div key={dept._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div 
                              className="w-4 h-4 rounded-full mr-3 flex-shrink-0" 
                              style={{backgroundColor: COLORS[index % COLORS.length]}}
                            ></div>
                            <span className="text-gray-700 font-medium">{dept._id}</span>
                          </div>
                          <span className="font-bold text-gray-800 text-lg">{dept.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No department data available</p>
                </div>
              )}
            </ChartContainer>
          </div>

          {/* Second Row - Asset Cost Analysis */}
          <div className="w-full">
            <ChartContainer 
              title="Asset Cost Analysis" 
              color="bg-indigo-500"
              loading={loading.assetCost}
              error={errors.assetCost}
            >
              {assetCostData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={assetCostData} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
                    <defs>
                      <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" opacity={0.5} />
                    <XAxis 
                      dataKey="_id" 
                      angle={-45} 
                      textAnchor="end" 
                      height={60}
                      fontSize={12}
                      stroke="#000000"
                      tickLine={true}
                      axisLine={{ stroke: '#000000' }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
                      fontSize={12}
                      stroke="#000000"
                      tickLine={true}
                      axisLine={{ stroke: '#000000' }}
                    />
                    <Tooltip 
                      content={CustomTooltip}
                      cursor={{fill: 'rgba(99, 102, 241, 0.1)'}}
                    />
                    <Bar 
                      dataKey="totalAssetValue"
                      name="Asset Value"
                      fill="url(#colorBar)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No asset cost data available</p>
                </div>
              )}
            </ChartContainer>
          </div>

          {/* Third Row - Maintenance Trends */}
          <div className="w-full">
            <ChartContainer 
              title="Maintenance Trends" 
              color="bg-green-500"
              loading={loading.maintenance}
              error={errors.maintenance}
            >
              {maintenanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={maintenanceData} margin={{ top: 10, right: 30, left: 60, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05}/>
                      </linearGradient>
                      <linearGradient id="colorStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" opacity={0.5} />
                    <XAxis 
                      dataKey="_id" 
                      fontSize={12}
                      stroke="#000000"
                      tickLine={true}
                      axisLine={{ stroke: '#000000' }}
                      dy={5}
                    />
                    <YAxis 
                      tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
                      fontSize={12}
                      stroke="#000000"
                      tickLine={true}
                      axisLine={{ stroke: '#000000' }}
                    />
                    <Tooltip 
                      content={CustomTooltip}
                      cursor={{stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4'}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="totalMaintenanceCost"
                      name="Maintenance Cost"
                      stroke="url(#colorStroke)" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorArea)"
                      animationDuration={1000}
                      dot={{
                        stroke: '#059669',
                        strokeWidth: 2,
                        fill: '#ffffff',
                        r: 4
                      }}
                      activeDot={{
                        stroke: '#059669',
                        strokeWidth: 2,
                        fill: '#10b981',
                        r: 6
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No maintenance data available</p>
                </div>
              )}
            </ChartContainer>
          </div>

          {/* Fourth Row - Vendor Portfolio */}
          <div className="w-full">
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Vendor Portfolio</h3>
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80">
                  {loading.vendor ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-purple-500"></div>
                    </div>
                  ) : errors.vendor ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-red-500 text-sm text-center">Error loading vendor data: {errors.vendor}</p>
                    </div>
                  ) : vendorData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={vendorData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="_id"
                          label={CustomPieLabel}
                        >
                          {vendorData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={CustomTooltip} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No vendor data available</p>
                    </div>
                  )}
                </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Top Vendors</h4>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {loading.vendor ? (
                        <div className="animate-pulse space-y-3">
                          {[1,2,3,4,5,6].map(i => (
                            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                          ))}
                        </div>
                      ) : vendorData.slice(0, 8).map((vendor, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <div 
                                className="w-4 h-4 rounded-full mr-3 flex-shrink-0" 
                                style={{backgroundColor: COLORS[index % COLORS.length]}}
                              ></div>
                              <h5 className="font-medium text-gray-800 text-sm">{vendor._id}</h5>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600 ml-7">
                            <span>Total Value:</span>
                            <span className="font-semibold">₹{vendor.value?.toLocaleString() || 0}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600 ml-7 mt-1">
                            <span>Share:</span>
                            <span className="font-semibold">{vendor.percentage || 0}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;