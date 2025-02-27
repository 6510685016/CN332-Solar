const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const { ROLE, LP, PERMISSIONS } = require('./Permission');


const router = express.Router();

// 📌 Register
router.post("/register", async (req, res) => {
  const { username, email, password , authProvider} = req.body;
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
  res.json({ token, user });
});

// 📌 Google Login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// 📌 Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard"); // หลังจาก Login สำเร็จ
  }
);

module.exports = router;
