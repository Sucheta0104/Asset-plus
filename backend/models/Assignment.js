//Model/Assignment
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    assetId :{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        required: true
    },
    employeeName :{
        type: String,
        required: true,
        trim: true
    },
    employeeId :{
        type:String,
        required: true,
        trim: true
    },
    department :{
        type: String,
        required: true,
        trim: true
    },
    assignmentDate : {
        type : Date,
        required: true,
        default: Date.now
    },
    notes : {
        type:String,
        trim : true
    },
    returnedDate: {
    type: Date,
    default: null
  },
  assignedBy: {
    type: String,
    required: true,
    trim: true
  },
    status: {
    type: String,
    enum: ['Active', 'Returned'],
    default: 'Active'
  }
    
})

module.exports = mongoose.model('Assignment',assignmentSchema);