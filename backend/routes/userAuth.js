const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/userAuthController');

router.post('/login', userAuthController.login);
router.post('/register', userAuthController.registerUser);

module.exports = router;
