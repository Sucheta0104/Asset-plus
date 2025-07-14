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

// GET /api/assignment/returned
router.get("/returned", AssignmentController.getReturnedAssignments);

// GET /api/assignment/filter/status?status=Active or Returned or All
router.get('/filter/status', AssignmentController.getAssignmentsByStatus);


module.exports = router;
