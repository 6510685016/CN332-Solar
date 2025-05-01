const mongoose = require("mongoose");


//เอาไว้เก็บ solarCells ทั้งหมดภายใน Zone
const ZoneSchema = new mongoose.Schema({
  zoneObjs: { type: Zone, required: true }
});

const SolarPlantSchema = new mongoose.Schema({
  solarPlantId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String },
  zones: [ZoneSchema]
});

module.exports = mongoose.model("SolarPlant", SolarPlantSchema);
