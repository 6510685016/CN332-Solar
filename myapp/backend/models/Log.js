const mongoose = require("mongoose");

// สร้าง Schema สำหรับ Log
const LogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = { LogSchema };