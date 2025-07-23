const express = require('express');
const router = express.Router();

const AssetController = require('../controllers/AssetController');

// Only using auth middleware
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes
router.use(authMiddleware);

// Create asset (only auth)
router.post('/', AssetController.createAsset);

// Get all assets
router.get('/', AssetController.getallAsset);

// Get asset by ID
router.get('/:id', AssetController.getassetbyID);

// Update asset
router.put('/:id', AssetController.updateasset);

// Delete asset
router.delete('/:id', AssetController.DeleteAsset);

module.exports = router;
