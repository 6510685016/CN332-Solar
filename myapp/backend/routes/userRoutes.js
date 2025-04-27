const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Role = require('../models/Role');

// Fetch all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find().populate("assignedSolarPlants");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});

// Update user role
router.put("/update-role", async (req, res) => {
    try {
      const { userId, newRoles } = req.body;

      // ตรวจสอบว่า newRoles เป็นอาเรย์
      if (!Array.isArray(newRoles)) {
        return res.status(400).json({ message: "newRoles must be an array" });
      }

      // เปลี่ยนชื่อ role เป็น ObjectId ที่ตรงกับฐานข้อมูล
      const roleObjectIds = await Role.find({ name: { $in: newRoles } }).select('_id');

      if (roleObjectIds.length !== newRoles.length) {
        return res.status(400).json({ message: "Some roles are invalid" });
      }

      // ค้นหาและอัพเดตข้อมูล user โดยใช้ ObjectId ของ roles
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { roles: roleObjectIds.map(role => role._id) }, // ใช้ ObjectId แทนชื่อ
        { new: true }
      ).populate('roles', 'name');

      // หากไม่พบ user
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Role updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error during role update:", error); // log ข้อผิดพลาด
      res.status(500).json({ message: "Error updating role", error: error.message });
    }
});

  
  
// Delete user
router.delete("/delete/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
});

module.exports = router;