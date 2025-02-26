const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ต้องเข้ารหัสก่อนบันทึก
  roles: [{ type: String, enum: ["admin", "DC", "Anal"], default: "none" }], // รองรับหลาย Role
  permissions: [{ 
    type: String,
    enum: ["user board", "solar board", "task board", "create task", "zone board", "analysis result", "api board"]
  }] // รองรับหลาย Permission
});


module.exports = mongoose.model("User", UserSchema);
