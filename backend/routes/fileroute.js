// routes/fileRoutes.js

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // multer setup
const { uploadFile } = require('../controllers/filecontroller');

// Route: POST /api/upload
router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;
