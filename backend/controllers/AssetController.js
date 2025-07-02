const Asset = require("../models/AssetSchema");

// Create new Asset
exports.createAsset = async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json({message: "Asset created successfully"});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all assets
exports.getallAsset = async (req, res) => {
  try {
    const { category } = req.query;

    // If category is passed, filter by it. Otherwise, return all.
    const filter = category ? { category } : {};
    const assets = await Asset.find(filter);
    res.status(200).json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get asset by ID
exports.getassetbyID = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.status(200).json(asset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update asset by ID
exports.updateasset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(asset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete asset by ID
exports.DeleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    res.status(200).json(asset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
