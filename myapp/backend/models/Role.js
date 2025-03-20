const { Permission } = require('./Permission');
const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }]
}, { timestamps: true });

RoleSchema.methods.hasFeature = function (feature) {
    this.permissions.forEach(permission => {
      result = permission.hasFeature(feature);
      if (result) {
        return true;
      }
    });
    return false;
};

RoleSchema.methods.setPermissions = function (permissions) {
  this.permissions = permissions;
  this.save();
};

const Role = mongoose.model('Role', RoleSchema);
module.exports = Role;
