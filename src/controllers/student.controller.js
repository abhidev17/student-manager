const studentService = require("../services/student.service");
const asyncHandler = require("../utils/asyncHandler");
const { getIo } = require("../socket");
const { z } = require("zod");

const studentSchema = z.object({
    name: z.string().min(1),
    age: z.number().int().positive(),
    course: z.string().min(1),
    gpa: z.number().min(0).max(10)
});

const updateStudentSchema = z.object({
    name: z.string().min(1).optional(),
    age: z.number().int().positive().optional(),
    course: z.string().min(1).optional(),
    gpa: z.number().min(0).max(10).optional()
});

// GET all
const getStudents = asyncHandler(async (req, res) => {
    const students = await studentService.getAllStudents(req.user.id, req.user.role === "admin");
    res.json(students);
});

// GET by ID
const getStudent = asyncHandler(async (req, res) => {
    const student = await studentService.getStudentById(req.params.id, req.user.id, req.user.role === "admin");

    if (!student) {
        return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
});

// CREATE
const addStudent = asyncHandler(async (req, res) => {
    const parsed = studentSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid student data" });
    }

    const { name, age, course, gpa } = parsed.data;

    const newStudent = await studentService.createStudent({
        name,
        age,
        course,
        gpa
    }, req.user.id);

    const io = getIo();
    if (io) {
        io.emit("studentAdded", newStudent);
    }

    res.status(201).json({
        message: "Student added successfully ✅",
        student: newStudent
    });
});

// UPDATE
const updateStudent = asyncHandler(async (req, res) => {
    const parsed = updateStudentSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid student data" });
    }

    const updated = await studentService.updateStudent(
        req.params.id,
        parsed.data,
        req.user.id,
        req.user.role === "admin"
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
    const deleted = await studentService.deleteStudent(req.params.id, req.user.id, req.user.role === "admin");

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
