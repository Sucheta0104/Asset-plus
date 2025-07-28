const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/contactController');

router.post('/', sendMessage);
router.get('/test', (req, res) => {
    res.send("Contact route is working!");
  });
  

module.exports = router;
