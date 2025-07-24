// controllers/reportController.js
const Asset = require('../models/AssetSchema');
const Maintenance = require('../models/Maintenance');

// Summary Cards
exports.getReportSummary = async (req, res) => {
  try {
    // Debug: Let's see what data we have
    console.log('=== DEBUG: Checking data ===');
    
    // Check total assets
    const totalAssets = await Asset.countDocuments();
    console.log('Total Assets Count:', totalAssets);
    
    // Check a sample asset to see field names
    const sampleAsset = await Asset.findOne();
    console.log('Sample Asset:', sampleAsset);
    
    // Check total value with multiple possible field names
    const totalValueQuery = await Asset.aggregate([
      {
        $group: {
          _id: null,
          totalPurchaseCost: { $sum: "$purchaseCost" },
          totalValue: { $sum: "$value" },
          totalPrice: { $sum: "$price" },
          totalCost: { $sum: "$cost" },
          count: { $sum: 1 }
        }
      }
    ]);
    console.log('Asset Value Analysis:', totalValueQuery);
    
    // Check maintenance data
    const maintenanceCount = await Maintenance.countDocuments();
    console.log('Maintenance Records Count:', maintenanceCount);
    
    const sampleMaintenance = await Maintenance.findOne();
    console.log('Sample Maintenance:', sampleMaintenance);
    
    // Calculate maintenance cost with fallback
    const maintenanceCostQuery = await Maintenance.aggregate([
      {
        $group: {
          _id: null,
          totalCost: { $sum: "$cost" },
          totalAmount: { $sum: "$amount" },
          totalPrice: { $sum: "$price" },
          count: { $sum: 1 }
        }
      }
    ]);
    console.log('Maintenance Cost Analysis:', maintenanceCostQuery);
    
    // Get distinct vendors and departments
    const totalVendors = await Asset.distinct("vendor");
    const totalDepartments = await Asset.distinct("assignedDepartment");
    
    console.log('Unique Vendors:', totalVendors);
    console.log('Unique Departments:', totalDepartments);
    
    // Calculate final values with fallbacks
    const totalValue = totalValueQuery[0]?.totalPurchaseCost || 
                      totalValueQuery[0]?.totalValue || 
                      totalValueQuery[0]?.totalPrice || 
                      totalValueQuery[0]?.totalCost || 0;
    
    const maintenanceCost = maintenanceCostQuery[0]?.totalCost || 
                           maintenanceCostQuery[0]?.totalAmount || 
                           maintenanceCostQuery[0]?.totalPrice || 0;
    
    const result = {
      totalAssets,
      totalValue,
      maintenanceCost,
      activeVendors: totalVendors.filter(v => v && v !== null && v !== '').length,
      activeDepartments: totalDepartments.filter(d => d && d !== null && d !== '').length
    };
    
    console.log('Final Result:', result);
    console.log('=== END DEBUG ===');
    
    res.json(result);
  } catch (err) {
    console.error('Error in getReportSummary:', err);
    res.status(500).json({ message: err.message });
  }
};

// Debug endpoint to check your data structure
exports.getDebugInfo = async (req, res) => {
  try {
    const assetSample = await Asset.findOne();
    const maintenanceSample = await Maintenance.findOne();
    
    const assetFields = assetSample ? Object.keys(assetSample.toObject()) : [];
    const maintenanceFields = maintenanceSample ? Object.keys(maintenanceSample.toObject()) : [];
    
    // Check for assets with purchaseCost > 0
    const assetsWithCost = await Asset.countDocuments({ 
      purchaseCost: { $gt: 0 } 
    });
    
    // Check for maintenance with cost > 0
    const maintenanceWithCost = await Maintenance.countDocuments({ 
      cost: { $gt: 0 } 
    });
    
    res.json({
      assetSample,
      maintenanceSample,
      assetFields,
      maintenanceFields,
      assetsWithCost,
      maintenanceWithCost,
      totalAssets: await Asset.countDocuments(),
      totalMaintenance: await Maintenance.countDocuments()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Pie Chart: Department Distribution
exports.getDepartmentDistribution = async (req, res) => {
  try {
    const data = await Asset.aggregate([
      { 
        $match: { 
          assignedDepartment: { 
            $exists: true, 
            $ne: null, 
            $ne: "" 
          } 
        } 
      },
      { 
        $group: { 
          _id: "$assignedDepartment", 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } }
    ]);
    res.json(data);
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
          totalCost: { $sum: "$purchaseCost" },
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
          date: { $exists: true, $ne: null },
          cost: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: { 
            $dateToString: { 
              format: "%Y-%m", 
              date: "$date" 
            }
          },
          totalCost: { $sum: "$cost" },
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
          purchaseCost: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: "$vendor",
          totalAssets: { $sum: 1 },
          value: { $sum: "$purchaseCost" }
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