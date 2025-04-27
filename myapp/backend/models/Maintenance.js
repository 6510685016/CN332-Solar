const MaintenanceSchema = new mongoose.Schema({
    componentId: { type: mongoose.Schema.Types.ObjectId, ref: "Component", required: true },
    date: { type: Date, required: true },
    description: { type: String }
});

module.exports = mongoose.model("Maintenance", MaintenanceSchema);
