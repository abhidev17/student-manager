const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const User = require("../models/user.model");

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const refreshSchema = z.object({
  token: z.string().min(1)
});

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// SIGNUP
const signup = async (req, res) => {
  const parsed = authSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid email or password format" });
  }

  const { email, password } = parsed.data;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashed
    });

    res.json({ message: "User created ✅" });
  } catch (error) {
    res.status(500).json({ error: "Signup failed" });
  }
};

// LOGIN
const login = async (req, res) => {
  const parsed = authSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid email or password format" });
  }

  const { email, password } = parsed.data;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT secret is not configured" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      token: accessToken
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

// REFRESH ACCESS TOKEN
const refresh = async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  const { token } = parsed.data;

  try {
    const user = await User.findOne({ refreshToken: token });

    if (!user) {
      return res.status(403).json({ error: "Invalid token" });
    }

    jwt.verify(token, process.env.JWT_SECRET);

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken, token: newAccessToken });
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = { signup, login, refresh };
