const Asset = require('../models/AssetSchema.js');
const moment = require('moment');
const Activity = require('../models/ActivitySchema.js')
const Alert = require('../models/AlertSchema.js')

// Summary endpoint: total, assigned, underRepair, AMC due
exports.getDashboardSummary = async (req, res) => {
  try {
    const totalassets = await Asset.countDocuments();
    const assignedAssets = await Asset.countDocuments({ status: 'Assigned' });
    const underRepair = await Asset.countDocuments({ status: 'UnderRepair' });

    const today = moment().startOf('day').toDate();
    const next30Days = moment().add(30, 'days').endOf('day').toDate();

    const amcDue = await Asset.countDocuments({
      warrentyExpiry: {
        $gte: today,
        $lte: next30Days
      }
    });

    res.status(200).json({
      totalassets,
      assignedAssets,
      underRepair,
      amcDue
    });

  } catch (error) {
    res.status(500).json({
      message: 'error in fetching dashboard summary',
      error: error.message
    });
  }
};

// Department-wise asset count
exports.getDepartmentAllocation = async (req, res) => {
  try {
    const result = await Asset.aggregate([
      { $match: { department: { $ne: null } } },
      {
        $group: {
          _id: '$department',
          totalAssets: { $sum: 1 }
        }
      }
    ]);

    const formatted = result.map(item => ({
      department: item._id,
      count: item.totalAssets
    }));

    res.status(200).json(formatted);

  } catch (error) {
    res.status(500).json({
      message: 'failed to fetch department allocation',
      error: error.message
    });
  }
};


//get last 5 activities
exports.getLastActivities = async (req,res)=>{
    try {
        const activities = await Activity.find().sort({createdAt:-1}).limit(5);
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({
            error:'Error Fetching Activities'
        })
    }
}

//Get active alerts
exports.getAlerts = async (req,res)=>{
    try {
        const alerts = await Alert.find({expiresAt:{$gt:new Date()}}).sort({createdAt:-1});
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({
            error:'Failed to fetch alerts'
        })
    }
}