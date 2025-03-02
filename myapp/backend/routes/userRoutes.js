const express = require("express");
const router = express.Router();
const User = require("../models/User");

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

        if (!Array.isArray(newRoles)) {
            return res.status(400).json({ message: "newRoles must be an array" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { roles: newRoles },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.json({ message: "Role updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating role", error });
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