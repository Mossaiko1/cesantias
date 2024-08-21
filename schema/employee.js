const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    identity: { type: Number, unique: true, required: true, minlength: 5, maxlength: 15 },
    name: { type: String, required: true },
    dateEntry: { type: Date, required: true },
    dateEnd: { type: Date, required: true },
    salary: { type: Number, required: true },
    dayWorked: { type: Number, required: true },
    severancePay: { type: Number, required: true },
});

module.exports = mongoose.model('Employee', employeeSchema, 'Employee');