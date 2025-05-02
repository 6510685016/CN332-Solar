const mongoose = require("mongoose");


//เอาไว้เก็บ solarCells ทั้งหมดภายใน Zone
const ZoneSchema = new mongoose.Schema({
  zoneObj: {
    type: mongoose.Schema.Types.Mixed,
  }
});

const SolarPlantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  zones: [{ type: mongoose.Schema.Types.ObjectId, ref: "Zone" }]
});


const SolarPlant = mongoose.model("SolarPlant", SolarPlantSchema);
const Zone = mongoose.model("Zone", ZoneSchema);

module.exports = { SolarPlant, Zone };
