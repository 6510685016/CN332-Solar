const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// 📌 Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ msg: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, email, password: hashedPassword , authProvider: "local"});

  res.json({ msg: "User registered successfully" });
});

// 📌 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

router.get("/user", (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from header
  if (!token) return res.status(401).json({ msg: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Forbidden" });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    console.log("response success")
    res.json({ username: user.username, roles: user.roles, permissions: user.permissions });
  });
});

// 📌 Google Login
router.post("/google", async (req, res) => {
  console.log("response success someone login google")
  const { accessToken } = req.body;
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
  );

  if (!response.ok) return res.status(400).json({ msg: "Fail to fetch user details" });

  const data = await response.json();
  const user = await User.findOne({ email: data.email });

  if (user) {
    //login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  }

  // register
  const newUser = await User.create({ 
    username: data.name, 
    email: data.email, 
    authProvider: "google",
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

module.exports = router;
