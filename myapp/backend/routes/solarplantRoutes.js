const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { SolarPlant } = require("../models/SolarPlant"); // ✅ ใช้ชื่อให้ตรง
const ZoneModel = mongoose.model("Zone"); // ✅ ดึง Zone model ที่ถูก register ไว้แล้ว
const { Zone } = require("../models/SolarPlantClass");
const { Transformer, Inverter } = require("../models/SolarPlantComponent");

//สร้าง solarplant 
router.post("/", async (req, res) => {
    const { name, location, transformer, inverter } = req.body;

    try {
        const newPlant = new SolarPlant({
            name,
            location,
            zones: [],
            transformer: transformer,
            inverter: inverter,            
        });
        await newPlant.save();

        res.json(newPlant);

        const newtransformer = new Transformer({
            position: location,
            lastMaintenance: 100,
            solarPlantId: newPlant._id
        });
        newtransformer.save();

        const newinverter = new Inverter({
            position: location,
            lastMaintenance: 100,
            solarPlantId: newPlant._id
        });
        newinverter.save();
    } catch (err) {
        console.error("Create plant failed:", err);
        res.status(500).json({ error: "Failed to create plant" });
    }
});

// add zone เข้า solarplant ตาม ID ที่ใช้อยู่
router.post("/:plantId/zones", async (req, res) => {
    const { plantId } = req.params;
    const { zoneName, numSolarX, numSolarY } = req.body;

    const plant = await SolarPlant.findById(plantId);
    if (!plant) return res.status(404).json({ error: "Plant not found" });

    const existingZones = await ZoneModel.find({ "zoneObj.zoneName": zoneName });

    const zoneIdList = plant.zones.map(z => z.toString());
    const isDuplicate = existingZones.some(z => zoneIdList.includes(z._id.toString()));

    if (isDuplicate) {
        return res.status(400).json({ error: "Zone name already exists in this plant" });
    }

    const zoneInstance = new Zone(zoneName, numSolarX, numSolarY);
    zoneInstance.generateSolarCells();

    const newZone = await ZoneModel.create({ zoneObj: zoneInstance });
    plant.zones.push(newZone._id);
    await plant.save();

    res.json({ zoneId: newZone._id });
});

//ดึง solarplant ทั้งหมด
router.get("/", async (req, res) => {
    try {
        const plants = await SolarPlant.find().populate("zones");
        res.json(plants);
    } catch (err) {
        console.error("Failed to fetch plants:", err);
        res.status(500).json({ error: "Failed to fetch solar plants" });
    }
});


//ดึง zones ตาม plant ID
router.get("/:plantId/zones", async (req, res) => {
    try {
        const plant = await SolarPlant.findById(req.params.plantId).populate("zones");
        if (!plant) return res.status(404).json({ error: "Plant not found" });

        const zones = plant.zones.map(z => ({
            _id: z._id,
            name: z.zoneObj.zoneName
        }));

        res.json(zones);
    } catch (err) {
        console.error("Failed to fetch zones:", err);
        res.status(500).json({ error: "Failed to fetch zones" });
    }
});

// DELETE a solar plant by ID
router.delete("/:id", async (req, res) => {
  try {
    const plant = await SolarPlant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ error: "Plant not found" });
    }

    await Transformer.deleteMany({ solarPlantId: plant._id });
    await Inverter.deleteMany({ solarPlantId: plant._id });
    await ZoneModel.deleteMany({ _id: { $in: plant.zones } });

    await plant.deleteOne();
    res.json({ message: "Solar plant deleted successfully" });
  } catch (err) {
    console.error("Failed to delete plant:", err);
    res.status(500).json({ error: "Failed to delete plant" });
  }
});


module.exports = router;