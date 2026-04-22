const studentService = require("../services/student.service");
const asyncHandler = require("../utils/asyncHandler");

// GET all
const getStudents = asyncHandler(async (req, res) => {
    const students = await studentService.getAllStudents(req.user.id);
    res.json(students);
});

// GET by ID
const getStudent = asyncHandler(async (req, res) => {
    const student = await studentService.getStudentById(req.params.id, req.user.id);

    if (!student) {
        return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
});

// CREATE
const addStudent = asyncHandler(async (req, res) => {
    const { name, age, course, gpa } = req.body;

    if (!name || !age || !course || gpa === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const newStudent = await studentService.createStudent({
        name,
        age,
        course,
        gpa
    }, req.user.id);

    res.status(201).json({
        message: "Student added successfully ✅",
        student: newStudent
    });
});

// UPDATE
const updateStudent = asyncHandler(async (req, res) => {
    const updated = await studentService.updateStudent(
        req.params.id,
        req.body,
        req.user.id
    );

    if (!updated) {
        return res.status(404).json({ error: "Student not found" });
    }

    res.json({
        message: "Student updated successfully ✏️",
        student: updated
    });
});

// DELETE
const deleteStudent = asyncHandler(async (req, res) => {
    const deleted = await studentService.deleteStudent(req.params.id, req.user.id);

    if (!deleted) {
        return res.status(404).json({ error: "Student not found" });
    }

    res.json({
        message: "Student deleted successfully 🗑️",
        student: deleted
    });
});

module.exports = {
    getStudents,
    getStudent,
    addStudent,
    updateStudent,
    deleteStudent
};
