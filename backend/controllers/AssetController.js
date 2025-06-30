const Asset = require("../models/AssetSchema");

//Create new Asset
exports.createAsset = async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json(asset);
  } catch {
    res.status(400).json({ message: err.message });
  }
};

//Get all asset
exports.getallAsset = async (req, res) => {
  try {
    const assets = await Asset.find();
    res.status(200).json(assets);
  } catch {
    res.status(500).json({ message: err.message });
  }
};

//Get asset by id

exports.getassetbyID = async (req, res) => {
  try {
    const asset = await Asset.findbyId(req.params.id);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }
    res.status(200).json(asset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Update asset by id
exports.updateasset = async (req, res) => {
    try {
        const asset = await Asset.findbyidUpdate(req.params.id,req.body,{new:true});
        res.status(200).json(asset);
        
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

//Delete asset 
exports.DeleteAsset = async (req,res)=>{
    try {
        const asset = await Asset.findByIdAndDelete(req.params.id);
        res.status(200).json(asset);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
