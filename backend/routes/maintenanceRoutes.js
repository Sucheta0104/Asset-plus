const express = require('express');
const router = express.Router();

const {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance
} = require('../controllers/maintenanceController');

//  Create a new maintenance record
router.post('/', createMaintenance);

//  Get all maintenance records
router.get('/', getAllMaintenance);


//  Get a single maintenance record by ID
router.get('/:id', getMaintenanceById);


//  Update maintenance record by ID
router.put('/:id', updateMaintenance);


//  Delete maintenance record by ID
router.delete('/:id', deleteMaintenance);

module.exports = router;
