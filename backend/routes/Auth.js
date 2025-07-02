const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Admin login route using hardcoded check inside middleware
router.post('/login', auth, (req, res) => {
  return res.status(200).json({ message: 'Welcome Admin' });
});

module.exports = router;
