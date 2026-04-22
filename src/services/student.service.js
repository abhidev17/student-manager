const Student = require("../models/student.model");

// Get all students
const getAllStudents = async (userId, isAdmin = false) => {
    return await Student.find(isAdmin ? {} : { user: userId });
};

// Get student by ID
const getStudentById = async (id, userId, isAdmin = false) => {
    return await Student.findOne(isAdmin ? { _id: id } : { _id: id, user: userId });
};

// Create student
const createStudent = async (data, userId) => {
    return await Student.create({
        ...data,
        user: userId
    });
};

// Update student
const updateStudent = async (id, data, userId, isAdmin = false) => {
    return await Student.findOneAndUpdate(isAdmin ? { _id: id } : { _id: id, user: userId }, data, {
        new: true,
        runValidators: true
    });
};

// Delete student
const deleteStudent = async (id, userId, isAdmin = false) => {
    return await Student.findOneAndDelete(isAdmin ? { _id: id } : { _id: id, user: userId });
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};
