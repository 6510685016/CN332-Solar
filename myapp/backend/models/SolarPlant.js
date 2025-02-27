const mongoose = require("mongoose");

// สร้าง Schema สำหรับ SolarPlant
const SolarPlantSchema = new mongoose.Schema({
  solarPlantId: { type: String, required: true, unique: true },
  name: { type: String, required: true }
});

module.exports = mongoose.model("SolarPlant", SolarPlantSchema);