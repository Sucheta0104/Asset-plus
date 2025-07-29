const Asset = require("../models/AssetSchema");
const Activity = require("../models/ActivitySchema");
const Alert = require("../models/AlertSchema");

// Create new Asset
exports.createAsset = async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();

    // Create activity log
    await Activity.create({
      message: `New asset created: ${asset.name} (${asset.assetTag})`,
      type: 'asset'
    });

    // 2. Check for upcoming warranty expiry
    const today = new Date();
    const expiryDate = new Date(asset.warrentyExpiry);
    const diffInDays = (expiryDate - today) / (1000 * 60 * 60 * 24);

    if (diffInDays <= 30 && diffInDays >= 0) {
      await Alert.create({
        title: `Warranty Expiring Soon for ${asset.name}`,
        description: `Asset ${asset.assetTag} warranty expires on ${expiryDate.toDateString()}`,
        level: 'warning',
        expireAt: expiryDate
      });
    }

    console.log('✅ Asset created successfully:', asset);
    res.status(201).json({
      message: "Asset created successfully",
      asset: asset
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all assets
exports.getallAsset = async (req, res) => {
  try {
    console.log('🚀 GET /api/asset/ - Fetching all assets');
    console.log('🔍 Query parameters:', req.query);
    console.log('🔍 User from token:', req.user);
    
    const { category } = req.query;

    // If category is passed, filter by it. Otherwise, return all.
    const filter = category ? { category } : {};
    console.log('🔍 Filter applied:', filter);
    
    const assets = await Asset.find(filter);
    console.log('✅ Assets found:', assets.length);
    console.log('📊 Assets data:', assets);
    
    res.status(200).json(assets);
  } catch (err) {
    console.error('❌ Error in getallAsset:', err);
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
