const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskDetail: { type: String, required: true },
    dueDate: { type: Date },
    solarPlantID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SolarPlant",
        required: true
    },
    zoneID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Zone",
        required: true
    },
    avgEfficiency: { type: Number },
    status: {
        type: String,
        default: "Created"
    },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
