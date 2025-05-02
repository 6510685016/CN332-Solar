const Maintenance = require("./Maintenance");

// SolarPlantComponent (Abstract)
class SolarPlantComponent {
  constructor(position, lastMaintenance, efficiency) {
    if (new.target === SolarPlantComponent) {
      throw new Error("Cannot instantiate abstract class.");
    }
    this.position = position;
    this.lastMaintenance = lastMaintenance;
    this.efficiency = efficiency;
    this.maintenanceHelper = new Maintenance(this);
  }

  get_info() {
    throw new Error("Method 'get_info()' must be implemented.");
  }

  get_efficiency() {
    throw new Error("Method 'get_efficiency()' must be implemented.");
  }

  set_efficiency() {
    throw new Error("Method 'set_efficiency()' must be implemented.");
  }

  performMaintenance() {
    return this.maintenanceHelper.maintenance();
  }
}

// ComponentMaintenance (Abstract)
class ComponentMaintenance {
  constructor() {
    if (new.target === ComponentMaintenance) {
      throw new Error("Cannot instantiate abstract class.");
    }
  }

  maintenance() {
    throw new Error("Method 'maintenance()' must be implemented.");
  }
}

module.exports = { SolarPlantComponent, ComponentMaintenance };