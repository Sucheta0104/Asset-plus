// middleware/auth.js
require('dotenv').config(); // load .env



const auth = (req, res, next) => {
  const { email, password } = req.body;

  // Load hardcoded credentials from .env
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    req.admin = { email }; // optionally attach admin info
    next(); // grant access
  } else {
    res.status(401).json({ message: "Access denied. Invalid credentials." });
  }
};

module.exports = auth;
