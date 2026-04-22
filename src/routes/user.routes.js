const express = require("express");
const router = express.Router();

const User = require("../models/user.model");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.get("/", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;
