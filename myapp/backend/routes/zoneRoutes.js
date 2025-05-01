const express = require("express");
const router = express.Router();
const { Zone } = require("../models/SolarPlantClass");

router.post("/", (req, res) => {
    const { zoneName, numSolarX, numSolarY } = req.body;
    console.log("BODY:", req.body);

    try {
        const zone = new Zone(zoneName, numSolarX, numSolarY);
        zone.generateSolarCells();

        res.json({
            message: "Zone created successfully",
            zone
        });
    } catch (err) {
        console.error("Zone creation error:", err);
        res.status(500).json({ error: "Failed to create zone" });
    }
});


module.exports = router; 
