const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { SolarPlant } = require("../models/SolarPlant"); 
const { Component } = require("../models/Component"); 
const ZoneModel = mongoose.model("Zone"); 
const TransformerModel = mongoose.model("Transformer");
const SolarCellModel =  mongoose.model("SolarCell");
const InverterModel = mongoose.model("Inverter"); 
const { Zone } = require("../models/SolarPlantClass");
const { Transformer, Inverter, SolarCell } = require("../models/SolarPlantClass");

// สร้าง solarplant 
router.post("/", async (req, res) => {
    const { name, location, transformer, inverter } = req.body;
    const thisDay = new Date().toISOString();
    
    try {
        const newPlant = new SolarPlant({
            name,
            location,
            zones: [],
            transformer: [],
            inverter: [],
        });

        //สร้าง Transformer, Inverter
        for (let index = 0; index < transformer; index++) {
            const transformerInstance = new Transformer(location, thisDay, 100);
            const newTransformer = await TransformerModel.create(transformerInstance);
            newPlant.transformer.push(newTransformer._id);
        }

        for (let index = 0; index < inverter; index++) {
            const inverterInstance = new Inverter(location, thisDay, 100);
            const newInverter = await InverterModel.create(inverterInstance);
            newPlant.inverter.push(newInverter._id);
        }

        await newPlant.save();
        res.status(201).json(newPlant);
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
    const thisDay = new Date().toISOString();

    //สร้าง SolarCell push เข้า Array
    for (let x = 0; x < numSolarX; x++) {
        for (let y = 0; y < numSolarY; y++) {
            const position = `Column: ${x}, Row: ${y}`;
            const solarCell = new SolarCell(position, thisDay, 100);
            const newSolarCell = await SolarCellModel.create(solarCell);
            zoneInstance.solarCellPanel.push(newSolarCell._id);
        }
    }

    const newZone = await ZoneModel.create({ zoneObj: zoneInstance });
    plant.zones.push(newZone._id);
    await plant.save();
    await newZone.save();

    res.json({ zoneId: newZone._id });
});

// ดึง solarplant ทั้งหมด
router.get("/", async (req, res) => {
    try {
        const plants = await SolarPlant.find().populate("zones");
        res.json(plants);
    } catch (err) {
        console.error("Failed to fetch plants:", err);
        res.status(500).json({ error: "Failed to fetch solar plants" });
    }
});

// ดึง zones ตาม plant ID
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

// GET ALL transformers and inverters by plant ID
//axios.get(`${process.env.REACT_APP_BACKEND}/solarplants/${plantId}/components`)
router.get("/:plantId/components", async (req, res) => {
    try {
        const plant = await SolarPlant.findById(req.params.plantId)
            .populate("transformer")
            .populate("inverter");

        res.json({
            transformers: plant.transformer,
            inverters: plant.inverter
        });
    } catch (err) {
        console.error("Failed to fetch components:", err);
        res.status(500).json({ error: "Failed to fetch components" });
    }
});

// Mantenance component by ID
router.patch("/:plantId/:type/maintain/:id", async (req, res) => {
    const { plantId, type, id } = req.params;
    const { efficiency } = req.body; // รับ efficiency จาก frontend

    try {
        let updatedComponent;
        const updateData = {
            lastMaintenance: new Date(), // ใช้วันที่ปัจจุบัน
            efficiency: efficiency       // กำหนดค่าประสิทธิภาพ
        };

        if (type === "transformer") {
            updatedComponent = await TransformerModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            );
        } else if (type === "inverter") {
            updatedComponent = await InverterModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            );
        } else {
            return res.status(400).json({ error: "Invalid component type" });
        }

        if (!updatedComponent) {
            return res.status(404).json({ error: "Component not found" });
        }

        res.json(updatedComponent);
    } catch (err) {
        console.error("Failed to update component:", err);
        res.status(500).json({ error: "Failed to update component" });
    }
});

// แก้ไขข้อมูล solar plant (NEW)
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, location, transformer, inverter } = req.body;

    try {
        const updated = await SolarPlant.findByIdAndUpdate(
            id,
            {
                ...(name !== undefined && { name }),
                ...(location !== undefined && { location }),
                ...(transformer !== undefined && { transformer }),
                ...(inverter !== undefined && { inverter }),
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Solar plant not found" });
        }

        res.json(updated);
    } catch (err) {
        console.error("Failed to update solar plant:", err);
        res.status(500).json({ error: "Failed to update solar plant" });
    }
});

// DELETE a solar plant by ID
router.delete("/:id", async (req, res) => {
    try {
        const plant = await SolarPlant.findById(req.params.id);
        if (!plant) {
            return res.status(404).json({ error: "Plant not found" });
        }

        await TransformerModel.deleteMany({ solarPlantId: plant._id });
        await InverterModel.deleteMany({ solarPlantId: plant._id });
        await ZoneModel.deleteMany({ _id: { $in: plant.zones } });

        await plant.deleteOne();
        res.json({ message: "Solar plant deleted successfully" });
    } catch (err) {
        console.error("Failed to delete plant:", err);
        res.status(500).json({ error: "Failed to delete plant" });
    }
});

module.exports = router;