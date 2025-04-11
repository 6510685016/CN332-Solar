class Zone {
    constructor(borderPosition) {
        this.borderPosition = borderPosition;
    }
}

class SolarPlant {
    constructor(name, location) {
        this.name = name;
        this.location = location;
        this.zones = [];
    }

    addZone(zone) {
        this.zones.push(zone);
    }

    manageZone() {
        // logic for managing zones
    }

    getPowerPlant() {
        return {
            name: this.name,
            location: this.location,
            zones: this.zones
        };
    }
}

class Inverter extends SolarPlantComponent {
    constructor(position, lastMaintenance) {
        super(position, lastMaintenance);
    }

    get_info() {
        return `Inverter at ${this.position}, last maintenance: ${this.lastMaintenance}`;
    }
}

class Transformer extends SolarPlantComponent {
    constructor(position, lastMaintenance) {
        super(position, lastMaintenance);
    }

    get_info() {
        return `Transformer at ${this.position}, last maintenance: ${this.lastMaintenance}`;
    }
}

class SolarCell extends SolarPlantComponent {
    constructor(position, lastMaintenance) {
        super(position, lastMaintenance);
    }

    get_info() {
        return `SolarCell at ${this.position}, last maintenance: ${this.lastMaintenance}`;
    }
}
