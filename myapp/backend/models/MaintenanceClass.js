class Maintenance extends ComponentMaintenance {
  constructor(component) {
    super();
    this.component = component;
  }

  maintenance() {
    const today = new Date().toISOString().split('T')[0];
    this.component.lastMaintenance = today;
    return `Maintenance done for ${this.component.constructor.name} at ${this.component.position} on ${today}`;
  }
}
