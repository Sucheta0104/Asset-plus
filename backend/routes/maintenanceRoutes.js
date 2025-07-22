const express = require('express');
const router = express.Router();

const {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
  getMaintenanceSummary
} = require('../controllers/maintenanceController');

const authMiddleware = require('../middleware/authMiddleware'); // ✅ Only authentication

// 📌 CRUD + Summary Routes

// Create a new maintenance record
router.post('/', authMiddleware, createMaintenance);

// Get all maintenance records
router.get('/', authMiddleware, getAllMaintenance);

// Get a single maintenance record by ID
router.get('/:id', authMiddleware, getMaintenanceById);

// Update maintenance record by ID
router.put('/:id', authMiddleware, updateMaintenance);

// Delete maintenance record by ID
router.delete('/:id', authMiddleware, deleteMaintenance);

// Get full maintenance summary/history
router.get('/summary/all', authMiddleware, getMaintenanceSummary);

module.exports = router;
