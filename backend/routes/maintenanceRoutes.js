const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
  getMaintenanceSummary
} = require('../controllers/maintenanceController');

// Apply auth middleware to all routes
router.use(auth);

// 📌 CRUD + Summary Routes

// Create a new maintenance record
router.post('/', createMaintenance);

// Get all maintenance records
router.get('/', getAllMaintenance);

// Get full maintenance summary/history
router.get('/summary/all', getMaintenanceSummary);

// Get a single maintenance record by ID
router.get('/:id', getMaintenanceById);

// Update maintenance record by ID
router.put('/:id', updateMaintenance);

// Delete maintenance record by ID
router.delete('/:id', deleteMaintenance);

module.exports = router;
