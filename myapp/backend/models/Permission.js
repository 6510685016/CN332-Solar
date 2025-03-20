const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  features: [{ type: String, required: true }]
});

PermissionSchema.methods.hasFeature = async function (feature) {
  return this.features.includes(feature);
};

PermissionSchema.methods.setFeature = async function (features) {
  this.features = features;
  this.save();
};

const Permission = mongoose.model('Permission', PermissionSchema);
module.exports = Permission;
