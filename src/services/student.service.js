const Student = require("../models/student.model");

// Get all students
const getAllStudents = async () => {
    return await Student.find();
};

// Get student by ID
const getStudentById = async (id) => {
    return await Student.findById(id);
};

// Create student
const createStudent = async (data) => {
    return await Student.create(data);
};

// Update student
const updateStudent = async (id, data) => {
    return await Student.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
};

// Delete student
const deleteStudent = async (id) => {
    return await Student.findByIdAndDelete(id);
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};
