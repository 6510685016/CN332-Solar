const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { Parser } = require('json2csv');
const Zone = require('../models/SolarPlant');

//สร้าง task
router.post('/', async (req, res) => {
    try {
        const generateTaskId = () => {
            return 'task-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 8);
          };
        const { taskName, taskDetail, submitDate, solarPlantID, zoneID, dueDate, avgEfficiency } = req.body;

        const newTask = new Task({
            taskId : generateTaskId(),
            taskName,
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
            taskName: task.taskName,
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
// แก้ไข task
router.put("/edittasks/:taskId", async (req, res) => {
    try {
        const { taskName, taskDetail, dueDate, solarPlantID, zoneID } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.taskId,
            {
                taskName,
                taskDetail,
                dueDate,
                solarPlantID,
                zoneID,
            },
            { new: true } // return task ที่อัปเดตแล้ว
        );

        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Failed to update task" });
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

//แปลงข้อมูล Task เป็น csv (ตาม TaskID)
router.get("/export/csv/:taskId", async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId)
            .populate("solarPlantID", "name")
            .populate("zoneID");

        if (!task || !task.zoneID) {
            return res.status(404).json({ message: "Task or Zone not found" });
        }

        const zone = task.zoneID;
        const solarCells = zone.zoneObj?.solarCellPanel || [];

        if (solarCells.length === 0) {
            return res.status(404).json({ message: "No solar cells in this zone" });
        }

        const rows = solarCells.map(cell => ({
            SolarPlant: task.solarPlantID?.name || "N/A",
            Zone: zone.zoneObj?.zoneName,
            SolarCellPosition: cell.position,
            LastMaintenance: cell.lastMaintenance?.split('T')[0] || "N/A",
            Efficiency: cell.efficiency ?? "N/A"
        }));

        const parser = new Parser();
        const csv = parser.parse(rows);

        res.header('Content-Type', 'text/csv');
        res.attachment(`task_${task._id}_solarcell.csv`);
        return res.send(csv);
    } catch (err) {
        console.error("CSV Export Error:", err);
        res.status(500).json({ message: "Failed to export solar cell data" });
    }
});




module.exports = router;
