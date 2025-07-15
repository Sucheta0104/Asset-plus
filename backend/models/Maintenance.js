const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    assetTag: {
      type: String,
      required: true,
    },
    assetName: {
      type: String,
      required: true,
    },
    maintenanceDate: {
      type: Date,
      required: true,
    },
    maintenanceTime: {
      type: String,
      required: true,
    },
    maintenanceType: {
      type: String,
      required: true,
    },
    technicianName: {
      type: String,
      required: true,
    },
    serviceCost: {
      type: Number,
      required: true,
    },
    partsUsed: { type: String },
    workDescription: { type: String },
    nextServiceDate: { type: Date },
    assetStatus: {
      type: String,
      enum: [
        "Fully Operational",
        "Needs Follow-up",
        "Requires Replacement",
        "Out of Service",
      ],
      default: "Fully Operational",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);
