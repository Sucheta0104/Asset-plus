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


const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
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

// Default route
app.get('/', (req, res) => {
  res.send("hello world");
});



// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
