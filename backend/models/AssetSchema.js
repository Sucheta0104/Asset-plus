const mongoose = require("mongoose");
const assetSchema = new mongoose.Schema({
  assetTag: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["IT", "Furniture", "Vehicle"],
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    default: " ",
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
  vendor: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  warrentyExpiry: {
    type: Date,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
    enum: ["Assigned", "Available", "UnderRepair"],
  },
  cost: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Asset", assetSchema);
