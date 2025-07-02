const express = require('express');
const router = express.Router();

const AssetController = require('../controllers/AssetController');

router.post('/', AssetController.createAsset);
router.get('/', AssetController.getallAsset);
router.get('/:id', AssetController.getassetbyID);
router.put('/:id', AssetController.updateasset);
router.delete('/:id', AssetController.DeleteAsset);

module.exports = router;
