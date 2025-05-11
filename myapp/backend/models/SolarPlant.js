// backend/models/SolarPlant.js
const mongoose = require("mongoose");

const ZoneSchema = new mongoose.Schema({
  zoneObj: { type: mongoose.Schema.Types.Mixed },
});

const SolarPlantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  zones: [{ type: mongoose.Schema.Types.ObjectId, ref: "Zone" }],
  // Optional: directly attached to plant
  transformer: { type: Number },
  inverter: { type: Number },
});

const SolarPlant = mongoose.model("SolarPlant", SolarPlantSchema);
const Zone = mongoose.model("Zone", ZoneSchema);

module.exports = { SolarPlant, Zone };
