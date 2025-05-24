const mongoose = require("mongoose");

const options = { discriminatorKey: "componentType", collection: "components" };

const toDay = new Date().toISOString();

const ComponentSchema = new mongoose.Schema({
    position: { type: String, default: null },
    lastMaintenance: { type: Date, default: toDay },
    efficiency: { type: Number, default: 100},
    maintenanceHelper: { type: String, ref: "Maintenance", required: true }
}, options);

// Base Model
const Component = mongoose.model("Component", ComponentSchema);

// Subtypes 
const Inverter = Component.discriminator(
    "Inverter",
    new mongoose.Schema({}, { _id: false })
);
const Transformer = Component.discriminator(
    "Transformer",
    new mongoose.Schema({}, { _id: false })
);
const SolarCell = Component.discriminator(
    "SolarCell",
    new mongoose.Schema({}, { _id: false })
);

module.exports = {
    Component,
    Inverter,
    Transformer,
    SolarCell
};
