const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ต้องเข้ารหัสก่อนบันทึก
  roles: [{ type: String, enum: ["admin", "DC", "Anal"], default: "none" }], // รองรับหลาย Role
  permissions: [{ type: String , enum:["user board","solar board","task board","create task","zone board","analysis result","api board"]}] // รองรับหลาย Permission
});

// เข้ารหัสรหัสผ่านก่อนบันทึก
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const bcrypt = require("bcryptjs");
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", UserSchema);
