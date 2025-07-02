
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema for admin
const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
});

// Middleware: Hash password before saving
adminSchema.pre('save', async function(next) {
    // Only hash if password is new or modified
    if (!this.isModified('password')) {
        return next();
    }
    
    // Hash password with 12 salt rounds
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Method: Compare password for login
adminSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Export the model
module.exports = mongoose.model('Admin', adminSchema);