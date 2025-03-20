const { permissionList, Permission, HasFeature } = require('./PermissionClass');

userManage = permissionList["userManage"];
fetchData = permissionList["fetchData"];
taskManage = permissionList["taskManage"];
solarPlantManage = permissionList["solarPlantManage"]
maintenance = permissionList["maintenance"]

class Role {
  constructor(name, permissions) {
    this.name;
    this.permissions = [];
  }

  setPermission(permissions) {
    this.permissions = permissions;
  }

  hasFeature(feature) {
    this.permissions.forEach(permission => {
      result = HasFeature.hasPermission(permission, feature);
      if (result) {
        return true;
      }
    });
    return false;
  }
}

superAdmin = new Role(
  "SuperAdmin",
  [
    userManage,
    fetchData,
    taskManage,
    solarPlantManage,
    maintenance
  ]
)

admin = new Role(
  "Admin",
  [
    userManage,
    solarPlantManage,
  ]
)

analyst = new Role(
  "Analyst",
  [
    fetchData,
  ]
)
  
droneController = new Role(
  "DroneController",
  [
    taskManage,
  ]
)

maintenancer = new Role(
  "Maintenancer",
  [
    maintenance
  ]
)

module.exports = {Role, superAdmin, admin, analyst, droneController, maintenancer};
