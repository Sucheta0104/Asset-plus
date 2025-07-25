// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const {
  getReportSummary,
  getDepartmentDistribution,
  getAssetCostAnalysis,
  getMaintenanceTrends,
  getVendorPortfolio,
  getDebugInfo
} = require('../controllers/reportController');

router.get('/summary', getReportSummary);
router.get('/department-distribution', getDepartmentDistribution);
router.get('/asset-cost', getAssetCostAnalysis);
router.get('/maintenance-trends', getMaintenanceTrends);
router.get('/vendor-portfolio', getVendorPortfolio);
router.get('/debug', getDebugInfo); // Optional: for debugging

module.exports = router;