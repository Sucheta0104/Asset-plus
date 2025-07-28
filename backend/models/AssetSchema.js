const mongoose = require("mongoose");
const assetSchema = new mongoose.Schema({
  assetTag: {
    type: String,
    required: false,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
    enum: ["IT", "Furniture", "Vehicle"],
  },
  brand: {
    type: String,
    required: false,
  },
  model: {
    type: String,
    default: " ",
  },
  serialNumber: {
    type: String,
    required: false,
    unique: false,
    trim: false,
  },
  purchaseDate: {
    type: Date,
    required: false,
  },
  vendor: {
    type: String,
    required: false,
    trim: false,
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
    required: false,
    enum: ["Assigned", "Available", "UnderRepair"]
  },
  department: {
  type: String,
  required: false,
  enum: ["IT", "Sales", "Marketing", "HR"],
},
  cost: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("Asset", assetSchema);
