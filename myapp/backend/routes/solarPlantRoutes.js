const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { SolarPlant } = require("../models/SolarPlant"); // ✅ ใช้ชื่อให้ตรง
const ZoneModel = mongoose.model("Zone"); // ✅ ดึง Zone model ที่ถูก register ไว้แล้ว
const { Zone } = require("../models/SolarPlantClass");

//สร้าง solarplant 
router.post("/", async (req, res) => {
    const { name, location } = req.body;

    try {
        const newPlant = new SolarPlant({
            name,
            location,
            zones: []
        });

        await newPlant.save();
        res.json(newPlant);
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

    res.json({ message: "Zone created", plant });
});

module.exports = router;
