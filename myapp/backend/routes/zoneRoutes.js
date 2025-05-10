const express = require('express');
const router = express.Router();
const { Zone } = require('../models/SolarPlant');
const { SolarCell } = require('../models/SolarPlantClass');

router.get("/get/:zoneId", async (req, res) => {
    const zoneId = req.params.zoneId;

    try {
        const zone = await Zone.findById(zoneId)

        res.json(zone);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

router.put("/update/:zoneId", async (req, res) => {
    const { zoneId,  solarCellPanel } = req.body;

    try {
        const zone = await Zone.findByIdAndUpdate(
            zoneId,
            { "zoneObj.solarCellPanel": solarCellPanel },
            { new: true }
        )

        res.json(zone);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

module.exports = router;
