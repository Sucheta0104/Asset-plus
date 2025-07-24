const Assignment = require("../models/Assignment");
const Asset = require("../models/AssetSchema");
const { Parser } = require("json2csv");

// Create a new assignment
exports.createAssignment = async (req, res) => {
  try {
    const asset = await Asset.findOne({ assetTag: req.body.assetTag });
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }
    req.body.assetId = asset._id;
    console.log("Asset ID:", asset._id);
    const assignment = new Assignment(req.body);
    await assignment.save();
    await Asset.findByIdAndUpdate(assignment.assetId, { status: "Assigned" });

    res.status(201).json({ message: "Asset assign successfully", assignment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating assignment", error: error.message });
  }
};

// Get all assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("assetId");
    res.status(200).json(assignments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching assignments", error: error.message });
  }
};

// Get assignment by ID
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate("assetId");
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json(assignment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching assignment", error: error.message });
  }
};

// Update assignment by ID
exports.updateAssignment = async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json({ message: "Assignment updated successfully", updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating assignment", error: error.message });
  }
};

// Delete assignment by Id
exports.deleteAssignment = async (req, res) => {
  try {
    const deleted = await Assignment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json({ message: "Assignment deleted successfully", deleted });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting assignment", error: error.message });
  }
};

// Get only returned assignments
exports.getReturnedAssignments = async (req, res) => {
  try {
    const returned = await Assignment.find({ status: "Returned" }).populate("assetId");
    res.status(200).json(returned);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch returned records", error: error.message });
  }
};

// Get assignments filtered by status (Active, Returned, or All)
exports.getAssignmentsByStatus = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};
    if (status && status !== "All") {
      filter.status = status;
    }

    const assignments = await Assignment.find(filter).populate("assetId");
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch assignments by status",
      error: error.message,
    });
  }
};

// Get assignment summary
exports.getAssignmentSummary = async (req, res) => {
  try {
    const total = await Assignment.countDocuments();
    const active = await Assignment.countDocuments({ status: "Active" });
    const returned = await Assignment.countDocuments({ status: "Returned" });
    const availableAssets = await Asset.countDocuments({ status: "Available" });

    res.status(200).json({
      totalAssignments: total,
      activeAssignments: active,
      returnedAssignments: returned,
      availableAssets: availableAssets,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch assignment summary",
      error: error.message,
    });
  }
};

// Search assignments by employeeName, employeeId or department
exports.searchAssignments = async (req, res) => {
  try {
    const { query } = req.query;

    const results = await Assignment.find({
      $or: [
        { employeeName: { $regex: query, $options: "i" } },
        { employeeId: { $regex: query, $options: "i" } },
        { department: { $regex: query, $options: "i" } },
      ],
    }).populate("assetId");

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: "Search failed",
      error: error.message,
    });
  }
};

// ✅ Export assignments as CSV
exports.exportAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("assetId");

    const data = assignments.map((a) => ({
      AssetTag: a.assetId?.assetTag || "",
      AssetName: a.assetId?.name || "",
      EmployeeName: a.employeeName,
      EmployeeID: a.employeeId,
      Department: a.department,
      AssignmentDate: a.assignmentDate,
      ReturnedDate: a.returnedDate || "",
      AssignedBy: a.assignedBy,
      Status: a.status,
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("assignments.csv");
    return res.send(csv);
  } catch (error) {
    res.status(500).json({
      message: "Failed to export assignments",
      error: error.message,
    });
  }
};
