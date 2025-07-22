const express = require('express');
const router = express.Router();

const AssignmentController = require('../controllers/assignmentController');
const authMiddleware = require('../middleware/authMiddleware');

// -----------------------------
// 📌 Functional / Custom Routes
// -----------------------------

// Get assignments filtered by status (Active, Returned, All)
router.get('/filter/status', authMiddleware, AssignmentController.getAssignmentsByStatus);

// Get only returned assignments
router.get('/returned', authMiddleware, AssignmentController.getReturnedAssignments);

// Get summary: total, active, returned, available
router.get('/summary', authMiddleware, AssignmentController.getAssignmentSummary);

// Search assignments
router.get('/search', authMiddleware, AssignmentController.searchAssignments);

// ✅ Export assignments as CSV
router.get('/export', authMiddleware, AssignmentController.exportAssignments); // <-- ADDED

// -----------------------------
// 📌 CRUD Routes
// -----------------------------

// Create a new assignment
router.post('/', authMiddleware, AssignmentController.createAssignment);

// Get all assignments
router.get('/', authMiddleware, AssignmentController.getAllAssignments);

// Get assignment by ID
router.get('/:id', authMiddleware, AssignmentController.getAssignmentById);

// Update assignment by ID
router.put('/:id', authMiddleware, AssignmentController.updateAssignment);

// Delete assignment by ID
router.delete('/:id', authMiddleware, AssignmentController.deleteAssignment);

module.exports = router;
