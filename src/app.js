const express = require("express");
require("dotenv").config();
const cors = require("cors");

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const studentRoutes = require("./routes/student.routes");
app.use("/api/students", studentRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Student Management API is running 🚀");
});

// Error Middleware (LAST)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
