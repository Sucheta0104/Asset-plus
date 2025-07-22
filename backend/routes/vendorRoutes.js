const express = require('express');
const router = express.Router();

const {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  getVendorSummary
} = require('../controllers/vendorController');

const authMiddleware = require('../middleware/authMiddleware'); // ✅ Authentication only

// 📌 Vendor CRUD & Summary Routes

// Create vendor
router.post('/', authMiddleware, createVendor);

// Get all vendors
router.get('/', authMiddleware, getVendors);

// Get vendor summary
router.get('/summary/all', authMiddleware, getVendorSummary);

// Get vendor by ID
router.get('/:id', authMiddleware, getVendorById);

// Update vendor
router.put('/:id', authMiddleware, updateVendor);

// Delete vendor
router.delete('/:id', authMiddleware, deleteVendor);

module.exports = router;
