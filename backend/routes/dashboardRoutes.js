const express = require('express');
const router = express.Router();

const {
  getDashboardSummary,
  getDepartmentAllocation,
  getLastActivities,
  getAlerts
} = require('../controllers/dashboardController');




// Summary and department
router.get('/summary', getDashboardSummary);
router.get('/department-allocation', getDepartmentAllocation);

// Last activities and alerts
router.get('/activities', getLastActivities);
router.get('/alerts', getAlerts);

module.exports = router;
