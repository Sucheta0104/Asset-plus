const express = require('express');
const router = express.Router();

const AssignmentController = require('../controllers/assignmentController');


// -----------------------------
// 📌 Functional / Custom Routes
// -----------------------------

// Get assignments filtered by status (Active, Returned, All)
router.get('/filter/status', AssignmentController.getAssignmentsByStatus);

// Get only returned assignments
router.get('/returned', AssignmentController.getReturnedAssignments);

// Get summary: total, active, returned, available
router.get('/summary', AssignmentController.getAssignmentSummary);

// Search assignments
router.get('/search', AssignmentController.searchAssignments);


// -----------------------------
// 📌 CRUD Routes
// -----------------------------

// Create a new assignment
router.post('/', AssignmentController.createAssignment);

// Get all assignments
router.get('/', AssignmentController.getAllAssignments);

// Get assignment by ID
router.get('/:id', AssignmentController.getAssignmentById);

// Update assignment by ID
router.put('/:id', AssignmentController.updateAssignment);

// Delete assignment by ID
router.delete('/:id', AssignmentController.deleteAssignment);


module.exports = router;
