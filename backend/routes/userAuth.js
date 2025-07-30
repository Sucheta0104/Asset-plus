const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/userAuthController');
const authMiddleware = require('../middleware/auth');

router.post('/login', userAuthController.login);
router.post('/register', userAuthController.registerUser);
router.get('/me', authMiddleware, userAuthController.getCurrentUser);

module.exports = router;
