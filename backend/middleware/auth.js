require('dotenv').config();

const auth = (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    // Load hardcoded credentials from .env
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // DEBUGGING
    console.log("Received from client:", email, password);
    console.log("Expected from .env:", adminEmail, adminPassword);

    if (email === adminEmail && password === adminPassword) {
      req.admin = { email };
      next();
    } else {
      res.status(401).json({ message: "Access denied. Invalid credentials." });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = auth;
