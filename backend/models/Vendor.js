const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: true,
    trim: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  companyAddress: {
    type: String,
    required: true,
  },
  gstNumber: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
