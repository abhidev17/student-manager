const express = require("express");
const router = express.Router();

const studentController = require("../controllers/student.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// Protect all routes
router.use(authMiddleware);

// Routes
router.get("/", studentController.getStudents);
router.get("/:id", studentController.getStudent);
router.post("/", studentController.addStudent);
router.put("/:id", studentController.updateStudent);
router.delete("/:id", roleMiddleware("admin"), studentController.deleteStudent);

module.exports = router;
