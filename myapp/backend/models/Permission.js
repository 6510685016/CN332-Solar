const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  features: [{ type: String, required: true }]
});

PermissionSchema.statics.hasFeature = async function (feature) {
  return this.permission.features.includes(feature);
};

const Permission = mongoose.model('Permission', PermissionSchema);
module.exports = Permission;
