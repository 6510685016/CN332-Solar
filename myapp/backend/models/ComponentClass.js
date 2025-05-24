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

  async saveToDB() {
    const { Inverter, Transformer, SolarCell } = require('./Component');

    let ComponentModel;
    switch (this.constructor.name) {
      case 'Inverter':
        ComponentModel = Inverter;
        break;
      case 'Transformer':
        ComponentModel = Transformer;
        break;
      case 'SolarCell':
        ComponentModel = SolarCell;
        break;
      default:
        throw new Error("Unknown subclass for saving.");
    }

    const doc = new ComponentModel({
      position: this.position,
      lastMaintenance: this.lastMaintenance,
      efficiency: this.efficiency,
      maintenanceHelper: this.maintenanceHelper
    });

    return await doc.save();
  }


}

module.exports = { SolarPlantComponent };