// routes/auth.js
const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// Use only for initial admin creation, then disable it
router.post('/register', register);

router.post('/login', login);

module.exports = router;
