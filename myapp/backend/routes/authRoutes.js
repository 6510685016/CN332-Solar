const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const { jwtDecode } = require('jwt-decode')
const Task = require("../models/Task");

// 📌 Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

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

router.get("/user", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => { // เพิ่ม async ตรงนี้
    if (err) return res.status(403).json({ msg: "Forbidden" });

    try {
      const user = await User.findById(decoded.id).populate({ // populate roles and permissions
        path: 'roles',
        populate: {  // populate permissions inside roles
          path: 'permissions',
          model: 'Permission' // Specify the model name
        }
      });

      if (!user) return res.status(404).json({ msg: "User not found" });

      const roleNames = [];
      const permissionNames = [];

      for (const role of user.roles) { // Use for...of for iterating arrays
        roleNames.push(role.name);
        for (const permission of role.permissions) {
          permissionNames.push(permission.name);
        }
      }
      res.json({ username: user.username, roles: roleNames, permissions: permissionNames });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ msg: "Internal server error" }); // เพิ่ม error handling
    }
  });
});

router.get('/userboard', async (req, res) => {
  try {
    const userlist = await User.find({}, 'username roles').populate('roles', 'name'); // ดึงข้อมูลผู้ใช้ทั้งหมดจากฐานข้อมูล
    const simplifiedUsers = userlist.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles.map(roles => roles.name), // ดึงชื่อ role ออกมา
    }));
    res.json({users : simplifiedUsers});
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to retrieve users", error: error }); // ส่งข้อผิดพลาดกลับ
  }
});

// 📌 Google Login
router.post('/google', async (req, res) => {
  // Generate JWT token
  const { credential } = req.body.credential;
  const decoded = jwtDecode(credential);
  const useremail = decoded.email;
  let user = await User.findOne({email: useremail});

  if (!user) {
    user = await User.create({
      username: decoded.name,
      email: decoded.email,
      authProvider: "google"
    });
  };

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

router.post("/tasks", async (req, res) => {
  const { taskName, solarPlantId, zone } = req.body;

  try {
    const task = new Task({
      taskName,
      solarPlantId: solarPlantId || null,  // ถ้าไม่มีข้อมูล solarPlantId ให้เป็น null
      zone: zone || null,  // ถ้าไม่มีข้อมูล zone ให้เป็น null
      status: "pending",   // ค่าเริ่มต้นเป็น pending
      createdAt: new Date(),
    });

    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
});

module.exports = router;
