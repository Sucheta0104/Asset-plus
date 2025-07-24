const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/userAuthController');

router.post('/login', userAuthController.login);

module.exports = router;
module.exports = router;
