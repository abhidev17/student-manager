const Student = require("../models/student.model");

// Get all students
const getAllStudents = async (userId) => {
    return await Student.find({ user: userId });
};

// Get student by ID
const getStudentById = async (id, userId) => {
    return await Student.findOne({ _id: id, user: userId });
};

// Create student
const createStudent = async (data, userId) => {
    return await Student.create({
        ...data,
        user: userId
    });
};

// Update student
const updateStudent = async (id, data, userId) => {
    return await Student.findOneAndUpdate({ _id: id, user: userId }, data, {
        new: true,
        runValidators: true
    });
};

// Delete student
const deleteStudent = async (id, userId) => {
    return await Student.findOneAndDelete({ _id: id, user: userId });
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};
