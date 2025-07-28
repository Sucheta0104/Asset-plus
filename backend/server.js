const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');


// Route imports
const authRoutes = require('./routes/Auth');
const assetRoutes = require('./routes/Assetroute');
const assignmentRoutes = require('./routes/assignmentRoute');
const dashboardRoutes = require('./routes/dashboardRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const userAuthRoutes = require('./routes/userAuth');
const reportRoutes = require('./routes/reportRoutes'); 
const contactRoutes = require('./routes/contactRoutes');


const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Specific origin for your React app
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/asset', assetRoutes);
app.use('/api/assignment', assignmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/user', userAuthRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/contact', contactRoutes);

// Default route
app.get('/', (req, res) => {
  res.send("hello world");
});

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
