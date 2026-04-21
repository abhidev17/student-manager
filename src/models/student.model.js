const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    gpa: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    }
}, {
    timestamps: true // adds createdAt & updatedAt
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
