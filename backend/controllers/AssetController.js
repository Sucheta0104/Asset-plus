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
    console.log('🔄 Updating asset with ID:', req.params.id);
    console.log('📝 Request body:', req.body);
    
    const { 
      name, 
      category, 
      status, 
      assignedTo, 
      location, 
      purchaseDate, 
      cost, 
      brand, 
      model, 
      serialNumber, 
      vendor, 
      warrentyExpiry, 
      description, 
      department 
    } = req.body;
    
    // Validate required fields
    if (!name || !category || !location || !purchaseDate) {
      return res.status(400).json({ 
        message: "Name, category, location, and purchase date are required for update" 
      });
    }

    // Build update data object with only valid fields
    const updateData = {};
    
    // Required fields
    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (location) updateData.location = location;
    if (purchaseDate) updateData.purchaseDate = purchaseDate;
    
    // Optional fields - only add if they have values
    if (status !== undefined && status !== '') updateData.status = status;
    if (assignedTo !== undefined && assignedTo !== '') updateData.assignedTo = assignedTo;
    if (cost !== undefined && cost !== '') updateData.cost = parseFloat(cost);
    if (brand !== undefined && brand !== '') updateData.brand = brand;
    if (model !== undefined && model !== '') updateData.model = model;
    if (serialNumber !== undefined && serialNumber !== '') updateData.serialNumber = serialNumber;
    if (vendor !== undefined && vendor !== '') updateData.vendor = vendor;
    if (warrentyExpiry !== undefined && warrentyExpiry !== '') updateData.warrentyExpiry = warrentyExpiry;
    if (description !== undefined && description !== '') updateData.description = description;
    if (department !== undefined && department !== '') updateData.department = department;

    console.log('📊 Update data:', updateData);

    const asset = await Asset.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { 
        new: true,
        runValidators: true 
      }
    );
    
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    // Create activity log
    await Activity.create({
      message: `Asset updated: ${asset.name} (${asset.assetTag})`,
      type: 'asset'
    });

    console.log('✅ Asset updated successfully:', asset);
    res.status(200).json(asset);
  } catch (err) {
    console.error('❌ Error updating asset:', err);
    
    // Handle specific MongoDB errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field} already exists. Please use a different value.` 
      });
    }
    
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
