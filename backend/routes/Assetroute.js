const express = require('express');
const router = express.Router();

const AssetController = require('../controllers/AssetController');

// Only using auth middleware
const authMiddleware = require('../middleware/authMiddleware');

// Create asset (only auth)
router.post('/', authMiddleware, AssetController.createAsset);

// Get all assets
router.get('/', authMiddleware, AssetController.getallAsset);

// Get asset by ID
router.get('/:id', authMiddleware, AssetController.getassetbyID);

// Update asset
router.put('/:id', authMiddleware, AssetController.updateasset);

// Delete asset
router.delete('/:id', authMiddleware, AssetController.DeleteAsset);

module.exports = router;
