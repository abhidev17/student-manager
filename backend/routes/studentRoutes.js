const express = require("express");
const router = express.Router();
const fs = require("fs");
const validationLimits = require("../constants/validationLimits.json");

const FILE = "./data/students.json";
const MAX_NAME_LENGTH = validationLimits.maxNameLength;
const MAX_COURSE_LENGTH = validationLimits.maxCourseLength;
const MIN_AGE = validationLimits.minAge;
const MAX_AGE = validationLimits.maxAge;
const MIN_GPA = validationLimits.minGpa;
const MAX_GPA = validationLimits.maxGpa;

// Helper: read file
function readData() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

// Helper: write file
function writeData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// Helper: validate/sanitize payload
function validateStudentPayload(payload) {
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const course = typeof payload.course === "string" ? payload.course.trim() : "";
  const age = Number(payload.age);
  const hasGpa = payload.gpa !== undefined && payload.gpa !== null && payload.gpa !== "";
  const gpa = hasGpa ? Number(payload.gpa) : undefined;

  if (!name) {
    return { error: "Name is required" };
  }
  if (name.length > MAX_NAME_LENGTH) {
    return { error: `Name must be ${MAX_NAME_LENGTH} characters or fewer` };
  }
  if (!Number.isInteger(age) || age < MIN_AGE || age > MAX_AGE) {
    return { error: `Age must be an integer between ${MIN_AGE} and ${MAX_AGE}` };
  }
  if (!course) {
    return { error: "Course is required" };
  }
  if (course.length > MAX_COURSE_LENGTH) {
    return { error: `Course must be ${MAX_COURSE_LENGTH} characters or fewer` };
  }
  if (hasGpa && (!Number.isFinite(gpa) || gpa < MIN_GPA || gpa > MAX_GPA)) {
    return { error: `GPA must be between ${MIN_GPA.toFixed(1)} and ${MAX_GPA.toFixed(1)}` };
  }

  return {
    value: {
      name,
      age,
      course,
      ...(hasGpa ? { gpa } : {})
    }
  };
}

// GET all
router.get("/", (req, res) => {
  res.json(readData());
});

// POST add
router.post("/", (req, res) => {
  const students = readData();
  const result = validateStudentPayload(req.body);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  const newStudent = { id: Date.now(), ...result.value };
  students.push(newStudent);
  writeData(students);
  res.json(newStudent);
});

// DELETE
router.delete("/:id", (req, res) => {
  let students = readData();
  students = students.filter(s => s.id != req.params.id);
  writeData(students);
  res.json({ message: "Deleted" });
});

// PUT update
router.put("/:id", (req, res) => {
  let students = readData();
  const result = validateStudentPayload(req.body);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  const targetId = Number(req.params.id);
  const exists = students.some(s => Number(s.id) === targetId);
  if (!exists) {
    return res.status(404).json({ error: "Student not found" });
  }

  students = students.map(s =>
    Number(s.id) === targetId ? { ...s, ...result.value } : s
  );
  writeData(students);
  res.json({ message: "Updated" });
});

module.exports = router;