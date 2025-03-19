class HasPermission {
  static hasPermission(permission) {
    throw new Error("Method 'hasPermission()' must be implemented.");
  }
}

class HasFeature extends HasPermission {
  static hasPermission(permission, feature) {
    return permission.features.includes(feature);
  }
}

//Permission
class Permission {
  constructor() {
    this.role,
    this.features = [];
  }

  setPermission(features) {
    this.features = features;
  }
}

// Init
// User Management Class
userManage = new Permission(
  "userManage",
  [
    "delete user",
    "edit role",
    "assign solar plant",
    "get user role"
  ]
)

// Fetch Data Class
fetchData = new Permission(
  "fetchData",
  [
    "user api",
    "get result"
  ]
)

// Task Management Class
taskManage = new Permission(
  "taskManage",
  [
    "task create",
    "task edit",
    "get result"
  ]
)

// Solar Plant Management Class
solarPlantManage = new Permission(
  "solarPlantManage",
  [
    "manage solar plant",
    "manage zone",
    "get solar plant"
  ]
)

// Maintenance Class
maintenance = new Permission(
  "maintenance",
  [
    "maintenance"
  ]
)

permissionList = { "userManage" : userManage, "fetchData" : fetchData, "taskManage" : taskManage, "solarPlantManage" : solarPlantManage, "maintenance" : maintenance};
module.exports = {permissionList, Permission, HasFeature};

