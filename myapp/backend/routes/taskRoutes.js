const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

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
router.get('/viewtasks/:taskId', async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    } catch (err) {
        console.error("Error fetching task:", err);
        res.status(500).json({ error: "Failed to fetch task" });
    }
});


module.exports = router;
