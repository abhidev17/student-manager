const express = require("express");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error.middleware");
const { setIo } = require("./socket");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

setIo(io);

// Connect Database
connectDB();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cors({
    origin: "*"
}));
app.use("/api/", limiter);

// Routes
const studentRoutes = require("./routes/student.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

io.on("connection", (socket) => {
    console.log("User connected");
});

// Root route
app.get("/", (req, res) => {
    res.send("Student Management API is running 🚀");
});

// Error Middleware (LAST)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { app, server, io };
