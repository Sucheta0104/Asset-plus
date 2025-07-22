const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

const {
  getDashboardSummary,
  getDepartmentAllocation,
  getLastActivities,
  getAlerts
} = require('../controllers/dashboardController');

router.get('/summary', verifyToken, getDashboardSummary);
router.get('/department-allocation', verifyToken, getDepartmentAllocation);
router.get('/activities', verifyToken, getLastActivities);
router.get('/alerts', verifyToken, getAlerts);

module.exports = router;
