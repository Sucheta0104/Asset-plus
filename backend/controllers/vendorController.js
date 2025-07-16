const Vendor = require('../models/Vendor');

// Create Vendor
exports.createVendor = async (req, res) => {
  try {
    const newVendor = new Vendor(req.body);
    await newVendor.save();
    res.status(201).json({ message: "Vendor added successfully", vendor: newVendor });
  } catch (error) {
    res.status(500).json({ error: "Failed to create vendor" });
  }
};

// Get All Vendors
exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
};

// Get Vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vendor" });
  }
};

// Update Vendor
exports.updateVendor = async (req, res) => {
  try {
    const updated = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json({ message: "Vendor updated successfully", vendor: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to update vendor" });
  }
};

// Delete Vendor
exports.deleteVendor = async (req, res) => {
  try {
    const deleted = await Vendor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete vendor" });
  }
};

// Summary of vendor history
exports.getVendorSummary = async (req, res) => {
  try {
    const allVendors = await Vendor.find().sort({ createdAt: -1 });
    const totalVendors = allVendors.length;
    const activeCount = allVendors.filter(v => v.status === 'Active').length;
    const inactiveCount = allVendors.filter(v => v.status === 'Inactive').length;

    res.status(200).json({
      totalVendors,
      activeCount,
      inactiveCount,
      vendors: allVendors, // optional: full list
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendor summary' });
  }
};
