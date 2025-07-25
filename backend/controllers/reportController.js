// controllers/reportController.js
const Asset = require('../models/AssetSchema');
const Maintenance = require('../models/Maintenance');

// Summary Cards - FIXED WITH CORRECT FIELD NAMES
exports.getReportSummary = async (req, res) => {
  try {
    // Get total number of assets
    const totalAssets = await Asset.countDocuments();
    
    // Get total ASSET purchase value
    const assetValueQuery = await Asset.aggregate([
      {
        $group: {
          _id: null,
          totalAssetValue: { $sum: "$cost" },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get total MAINTENANCE cost using serviceCost field
    const maintenanceCostQuery = await Maintenance.aggregate([
      {
        $match: {
          serviceCost: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          totalMaintenanceCost: { $sum: "$serviceCost" }
        }
      }
    ]);
    
    // Get distinct vendors and departments with correct field names
    const totalVendors = await Asset.distinct("vendor", {
      vendor: { $exists: true, $ne: null, $ne: "" }
    });
    
    const totalDepartments = await Asset.distinct("department", {
      department: { $exists: true, $ne: null, $ne: "" }
    });
    
    // Calculate ASSET VALUE
    const totalAssetValue = assetValueQuery[0]?.totalAssetValue || 0;
    
    // Get maintenance cost
    const totalMaintenanceCost = maintenanceCostQuery[0]?.totalMaintenanceCost || 0;
    
    const result = {
      totalAssets,
      totalAssetValue,
      totalMaintenanceCost,
      activeVendors: totalVendors.length,
      activeDepartments: totalDepartments.length,
      grandTotal: totalAssetValue + totalMaintenanceCost
    };
    
    res.json(result);
  } catch (err) {
    console.error('Error in getReportSummary:', err);
    res.status(500).json({ message: err.message });
  }
};

// Pie Chart: Department Distribution
exports.getDepartmentDistribution = async (req, res) => {
  try {
    const data = await Asset.aggregate([
      { 
        $match: { 
          department: { 
            $exists: true, 
            $ne: null, 
            $ne: "" 
          } 
        } 
      },
      { 
        $group: { 
          _id: "$department", 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } }
    ]);
    
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const withPercentages = data.map(item => ({
      ...item,
      percentage: total > 0 ? ((item.count / total) * 100).toFixed(1) : 0
    }));
    
    res.json(withPercentages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Bar Chart: Asset Cost by Category
exports.getAssetCostAnalysis = async (req, res) => {
  try {
    const data = await Asset.aggregate([
      {
        $match: {
          category: { $exists: true, $ne: null, $ne: "" }
        }
      },
      {
        $group: {
          _id: "$category",
          totalCost: { $sum: "$cost" },
          quantity: { $sum: 1 }
        }
      },
      { $sort: { totalCost: -1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Line Chart: Maintenance Cost over Time
exports.getMaintenanceTrends = async (req, res) => {
  try {
    const data = await Maintenance.aggregate([
      {
        $match: {
          maintenanceDate: { $exists: true, $ne: null },
          serviceCost: { $exists: true, $ne: null, $gt: 0 }
        }
      },
      {
        $group: {
          _id: { 
            $dateToString: { 
              format: "%b", 
              date: "$maintenanceDate" 
            }
          },
          totalCost: { $sum: "$serviceCost" },
          incidents: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Pie Chart: Vendor Contribution
exports.getVendorPortfolio = async (req, res) => {
  try {
    const data = await Asset.aggregate([
      {
        $match: {
          vendor: { $exists: true, $ne: null, $ne: "" },
          cost: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: "$vendor",
          totalAssets: { $sum: 1 },
          value: { $sum: "$cost" }
        }
      },
      { $sort: { value: -1 } }
    ]);
    
    const totalAll = data.reduce((sum, v) => sum + v.value, 0);
    const withPct = data.map(v => ({
      ...v,
      percentage: totalAll > 0 ? ((v.value / totalAll) * 100).toFixed(1) : "0.0"
    }));
    
    res.json(withPct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Simple debug endpoint
exports.getDebugInfo = async (req, res) => {
  try {
    const assetCount = await Asset.countDocuments();
    const maintenanceCount = await Maintenance.countDocuments();
    
    res.json({
      totalAssets: assetCount,
      totalMaintenance: maintenanceCount,
      message: "Debug info without detailed data"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};