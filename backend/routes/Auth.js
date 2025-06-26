const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Admin login route (protected using hardcoded credentials)
router.post('/login', auth, (req, res) => {
  res.json({ message: `Welcome Admin: ${req.admin.email}` });
});

module.exports = router;
