const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskDetail: { type: String, required: true },
    submitDate: { type: Date, required: true },
    dueDate: { type: Date },
    solarPlantID: { type: String, required: true },
    zoneID: { type: String, required: true },
    avgEfficiency: { type: Number }
}, { timestamps: true });


module.exports = mongoose.model("Task", taskSchema);
