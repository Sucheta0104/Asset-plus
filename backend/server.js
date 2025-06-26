const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Home route
app.get('/', (req, res) => {
  res.send("hello world");
});

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
