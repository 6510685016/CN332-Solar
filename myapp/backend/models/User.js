const {Role} = require('./Role');
const { LogSchema } = require('./Log');
const mongoose = require("mongoose");
const { reject } = require('firebase-tools/lib/utils');

/*
const roleMapping = { 
  "superAdmin": superAdmin, 
  "admin": admin, 
  "analyst": analyst, 
  "droneController": droneController, 
  "maintenancer": maintenancer
};
*/

// สร้าง Schema สำหรับ User
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, sparse: true},
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Encode
  authProvider: { type: String, enum: ['local', 'google'], required: true },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
  logs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Log' }],
  assignedSolarPlants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SolarPlant' }]
}, {
  timestamps: true // createdAt, updatedAt
});

// สรุป permissions ของ User จาก roles ที่กำหนด โดยใช้ middleware
// UserSchema.pre('save', function (next) {
//   this.permissions = this.roles.flatMap(role => PERMISSIONS[role] || []);
//   next();
// });

/*
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
*/

// สร้าง static method สำหรับการตรวจสอบสิทธิ์ของ User
UserSchema.methods.hasFeature = async function (feature, solarPlantId = null) {
  if (!solarPlantId || (solarPlantId && this.assignedSolarPlants.some(id => id.toString() === solarPlantId.toString()))) {
    // roles ทั้งหมดที่ user มีประกอบด้วย feature ไหม
    this.roles.forEach(role => {
      if (role.hasFeature(feature)) {
        return true;
      }
    });
  }
  return false;
};

UserSchema.methods.setRole = async function (roles) {
  this.roles = roles;
  this.save();
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
