const mongoose = require("mongoose");

const ZoneSchema = new mongoose.Schema({
  borderPosition: { type: String, required: true }
});

const SolarPlantSchema = new mongoose.Schema({
  solarPlantId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String },
  zones: [ZoneSchema]
});

module.exports = mongoose.model("SolarPlant", SolarPlantSchema);
