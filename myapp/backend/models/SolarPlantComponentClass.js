// SolarPlantComponent (Abstract)
class SolarPlantComponent {
  constructor(position, lastMaintenance) {
    if (new.target === SolarPlantComponent) {
      throw new Error("Cannot instantiate abstract class.");
    }
    this.position = position;
    this.lastMaintenance = lastMaintenance;
  }

  get_info() {
    throw new Error("Method 'get_info()' must be implemented.");
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

