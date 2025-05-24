const express = require('express');
const router = express.Router();
const { Zone } = require('../models/SolarPlant');
const { SolarCell: SolarCellModel } = require('../models/Component');
const { SolarCell } = require('../models/SolarPlantClass');

router.get("/get/:zoneId", async (req, res) => {
  const { zoneId } = req.params;

  try {
    const zone = await Zone.findById(zoneId).populate({
        path: 'zoneObj.solarCellPanel',
    });

    if (!zone) {
      return res.status(404).json({ error: "Zone not found" });
    }

    res.json(zone);
  } catch (error) {
    console.error("Error fetching zone:", error);
    res.status(500).json({ error: "Failed to fetch zone" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const zone = await Zone.findById(zoneId).populate({
        path: 'zoneObj.solarCellPanel',
    });

    if (!zone) return res.status(404).json({ error: "Zone not found" });
    res.json(zone);
  } catch (err) {
    console.error("Failed to fetch zone:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

router.patch("/:zoneId/:row/:col", async (req, res) => {
  try {
    const { zoneId, row, col } = req.params;
    const { efficiency, lastMaintenance } = req.body;
    //console.log("PATCH called:", req.params);

    //console.log("Looking for zone with ID:", zoneId);
    const zone = await Zone.findById(zoneId);

    if (!zone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    // ตรวจสอบ index ใน grid
    const x = parseInt(row, 10);
    const y = parseInt(col, 10);
    const index = y * zone.zoneObj.numSolarX + x;

    if (index >= zone.zoneObj.solarCellPanel.length) {
      return res.status(400).json({ message: "Invalid solar panel coordinates" });
    }

    const solarCellId = zone.zoneObj.solarCellPanel[index]._id;
    // console.log("Looking for solarCell with ID:", solarCellId);

    // สมมุติว่าคุณมีโมเดลชื่อ SolarCell
    const updated = await SolarCellModel.findByIdAndUpdate(
      solarCellId,
      { $set: { efficiency: efficiency, lastMaintenance: lastMaintenance} },
      { new: true }
    );

    res.status(200).json({ message: "Updated successfully", data: updated });
  } catch (error) {
    console.error("Error updating solar cell maintenance:", error);
    res.status(500).json({ message: "Server error" });
  }
});

