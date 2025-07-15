const Maintenance = require('../models/Maintenance');

// Create maintenance record
exports.createMaintenance = async (req, res) => {
  try {
    const data = req.body;
    const maintenance = new Maintenance(data);
    await maintenance.save();
    res.status(201).json({ message: 'Maintenance logged successfully', maintenance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create maintenance record' });
  }
};

// Get all maintenance records
exports.getAllMaintenance = async (req, res) => {
  try {
    const maintenanceLogs = await Maintenance.find().sort({ maintenanceDate: -1 });
    res.status(200).json(maintenanceLogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch maintenance history' });
  }
};

// Get single record by ID
exports.getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);
    if (!maintenance) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(maintenance);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving record' });
  }
};

// Update maintenance record
exports.updateMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );
    if (!maintenance) return res.status(404).json({ message: 'Maintenance log not found' });
    res.status(200).json({ message: 'Maintenance updated successfully', maintenance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update maintenance record' });
  }
};

exports.deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);

    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance log not found' });
    }

    res.status(200).json({ message: 'Maintenance record deleted successfully' });
  } catch (error) {
    console.error(" Delete Maintenance Error:", error); 
    res.status(500).json({ error: 'Failed to delete maintenance record' });
  }
};
