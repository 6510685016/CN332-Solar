const TaskSchema = new mongoose.Schema({
    taskId: { type: String, required: true, unique: true },
    detail: { type: String },
    relatedComponent: { type: mongoose.Schema.Types.ObjectId, ref: "Component" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", TaskSchema);
