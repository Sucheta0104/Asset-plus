const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const assetRoutes = require('./routes/Assetroute');
const fileRoutes = require('./routes/fileroute');


const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/asset', assetRoutes);

// Static folder for uploaded files
app.use('/uploads', express.static('uploads'));

// All API routes
app.use('/api', fileRoutes);

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));


// Home route
app.get('/', (req, res) => {
  res.send("hello world");
});

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
