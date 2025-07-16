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

// Create vendor
router.post('/', createVendor);

// Get all vendors
router.get('/', getVendors);

// Get vendor summary
router.get('/summary/all', getVendorSummary);

// Get vendor by ID
router.get('/:id', getVendorById);

// Update vendor
router.put('/:id', updateVendor);

// Delete vendor
router.delete('/:id', deleteVendor);

module.exports = router;
