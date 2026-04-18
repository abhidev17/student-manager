const express = require("express");
const router = express.Router();
const fs = require("fs");

const FILE = "./data/students.json";

// Helper: read file
function readData() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

// Helper: write file
function writeData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// GET all
router.get("/", (req, res) => {
  res.json(readData());
});

// POST add
router.post("/", (req, res) => {
  const students = readData();
  const newStudent = { id: Date.now(), ...req.body };
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
  students = students.map(s =>
    s.id == req.params.id ? { ...s, ...req.body } : s
  );
  writeData(students);
  res.json({ message: "Updated" });
});

module.exports = router;