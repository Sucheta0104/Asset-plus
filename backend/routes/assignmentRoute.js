const express = require('express');
const router = express.Router();

const AssignmentController = require('../controllers/assignmentController');

// POST /api/assignment
router.post('/', AssignmentController.createAssignment);

// GET /api/assignment
router.get('/', AssignmentController.getAllAssignments);

// GET /api/assignment/:id
router.get('/:id', AssignmentController.getAssignmentById);

// PUT /api/assignment/:id
router.put('/:id', AssignmentController.updateAssignment);

// DELETE /api/assignment/:id
router.delete('/:id', AssignmentController.deleteAssignment);

module.exports = router;
