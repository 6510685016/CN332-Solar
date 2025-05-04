const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

//สร้าง task
router.post('/', async (req, res) => {
    try {
        const { taskDetail, submitDate, solarPlantID, zoneID, dueDate, avgEfficiency } = req.body;

        const newTask = new Task({
            taskDetail,
            submitDate,
            solarPlantID,
            zoneID,
            dueDate,
            avgEfficiency
        });

        const savedTask = await newTask.save();
        res.status(201).json({ message: 'Task saved', task: savedTask });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save task' });
    }
});

// ดึงข้อมูล Task จาก MongoDB โดยใช้ taskId ที่ส่งมาจาก URL
router.get("/viewtasks/:taskId", async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId)
            .populate("solarPlantID", "name")
            .populate("zoneID", "zoneObj.zoneName");

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(task);
    } catch (err) {
        console.error("Error fetching task:", err);
        res.status(500).json({ error: "Failed to fetch task" });
    }
});

//ดึงข้อมูล Task
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("solarPlantID", "name")
            .populate("zoneID", "zoneObj.zoneName")
            .sort({ dueDate: -1 });

        const formatted = tasks.map(task => ({
            _id: task._id,
            taskId: task.taskId || task._id,
            solarPlantName: task.solarPlantID?.name || "N/A",
            zone: task.zoneID?.zoneObj?.zoneName || "N/A",
            status: task.status || "Created",
            dueDate: task.dueDate || "N/A"
        }));

        res.json(formatted);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
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
        console.error("Error editing task:", error);
        res.status(500).json({ message: "Error updating task", error });
    }
});

// start task
router.put("/starttasks/:taskId", async (req, res) => {
    const { status } = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.taskId,
            { status: status || "Waiting" },
            { new: true }
        );
        res.json(updatedTask);
    } catch (error) {
        console.error("Error updating task status:", error);
        res.status(500).json({ message: "Error updating status", error });
    }
});



module.exports = router;
