const { ROLE, LP, PERMISSIONS } = require('./Permission');
const { LogSchema } = require('./Log');
const mongoose = require("mongoose");


// สร้าง Schema สำหรับ User
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, sparse: true},
  email: { type: String, required: true, unique: true },
  password: { type: String }, // ต้องเข้ารหัสก่อนบันทึก
  authProvider: { type: String, enum: ['local', 'google'], required: true },
  roles: [{ type: String, enum: Object.values(ROLE) }], // รองรับหลาย Role
  permissions: [{ type: String }],
  logs: [LogSchema],
  assignedSolarPlants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SolarPlant' }]
}, {
  timestamps: true // สร้าง fields createdAt และ updatedAt
});

// สรุป permissions ของ User จาก roles ที่กำหนด โดยใช้ middleware
UserSchema.pre('save', function (next) {
  this.permissions = this.roles.flatMap(role => PERMISSIONS[role] || []);
  next();
});

// สร้าง static method สำหรับการแก้ไข Permissions 
UserSchema.statics.updatePermissions = function (role, newPermissions) {
  if (role === ROLE.ADMIN) {
    throw new Error('Admin permissions cannot be modified');
  }
  if (newPermissions.some(permission => !Object.values(LP).includes(permission))) {
    throw new Error('Invalid permission');
  }
  PERMISSIONS[role] = newPermissions;
};

// สร้าง static method สำหรับการตรวจสอบสิทธิ์ของ User
UserSchema.statics.hasPermission = function (user, permission, solarPlantId = null) {
  if (!user.permissions.includes(permission)) {
    return false;
  }
  if (solarPlantId) {
    return user.assignedSolarPlants.some(id => id.toString() === solarPlantId.toString());
  }
  return true;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
