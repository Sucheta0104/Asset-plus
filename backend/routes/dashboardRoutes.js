const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  getDepartmentAllocation
} = require('../controllers/dashboardController');


// Routes
router.get('/summary',getDashboardSummary);
router.get('/department-allocation',  getDepartmentAllocation);

module.exports = router;
