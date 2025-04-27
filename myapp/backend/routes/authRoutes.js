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

//สร้างใหม่
router.post("/tasks", async (req, res) => {
  const { taskId } = req.body; // รับ taskId ที่ส่งมา

  try {
    const task = new Task({
      taskId, // ใช้ taskId ที่ส่งมา
      status: "Created", // สถานะเริ่มต้นเป็น pending
      createdAt: new Date(),
    });

    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
});

// API route ใน backend เพื่อดึงข้อมูล task
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find(); // ดึง task ทั้งหมดจากฐานข้อมูล
    res.json(tasks); // ส่งข้อมูลกลับไปยัง frontend
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});
//แก้ไขตาม id
router.put("/edittasks/:taskId", async (req, res) => {
  const { taskName, status } = req.body; // ✅ เพิ่ม taskName ด้วย
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { taskId: taskName, status }, // ✅ เปลี่ยน field taskId ถ้า taskName หมายถึงชื่อ task
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

// ดึงข้อมูล task ตาม id
router.get("/viewtasks/:taskId", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error });
  }
});
// start task
router.put("/starttasks/:taskId", async (req, res) => {
  const { status } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, { status }, { new: true });
    res.json(task); // ส่งกลับ task ที่อัปเดตแล้ว
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});


module.exports = router;
