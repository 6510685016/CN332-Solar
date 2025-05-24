// backend/models/SolarPlant.js
const mongoose = require("mongoose");

const ZoneSchema = new mongoose.Schema({
  zoneObj: {
    zoneName: String,
    numSolarX: Number,
    numSolarY: Number,
    solarCellPanel: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SolarCell'
    }]
  }
});

const SolarPlantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  zones: [{ type: mongoose.Schema.Types.ObjectId, ref: "Zone" }],
  transformer: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transformer" }],
  inverter: [{ type: mongoose.Schema.Types.ObjectId, ref: "Inverter" }],
});

const SolarPlant = mongoose.model("SolarPlant", SolarPlantSchema);
const Zone = mongoose.model("Zone", ZoneSchema);

module.exports = { SolarPlant, Zone };
