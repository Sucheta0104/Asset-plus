// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const {
  getReportSummary,
  getDepartmentDistribution,
  getAssetCostAnalysis,
  getMaintenanceTrends,
  getVendorPortfolio
} = require('../controllers/reportController');

router.get('/summary', getReportSummary);
router.get('/department-distribution', getDepartmentDistribution);
router.get('/asset-cost', getAssetCostAnalysis);
router.get('/maintenance-trends', getMaintenanceTrends);
router.get('/vendor-portfolio', getVendorPortfolio);

module.exports = router;
