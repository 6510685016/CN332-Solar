const mongoose = require("mongoose");
require('./Component.js');
const SolarCellModel =  mongoose.model("SolarCell");
const { SolarPlantComponent } = require("./ComponentClass");

class Zone {
    constructor(zoneName, numSolarX, numSolarY) {
        this.zoneName = zoneName;
        this.numSolarX = numSolarX;
        this.numSolarY = numSolarY;
        this.solarCellPanel = [];
    }

    setZoneName(newName) {
        this.zoneName = newName;
    }

    getZoneName() {
        return this.zoneName;
    }

    getSoCellPanel() {
        return this.solarCellPanel;
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
    constructor(position, lastMaintenance, efficiency) {
        super(position, lastMaintenance, efficiency);
    }

    get_info() {
        return `Inverter at ${this.position}, last maintenance: ${this.lastMaintenance}, efficiency: ${this.efficiency}`;
    }

    get_efficiency() {
        return `${this.efficiency}%`;
    }

    set_efficiency(value) {
        this.efficiency = value;
    }
}

class Transformer extends SolarPlantComponent {
    constructor(position, lastMaintenance, efficiency) {
        super(position, lastMaintenance, efficiency);
    }

    get_info() {
        return `Transformer at ${this.position}, last maintenance: ${this.lastMaintenance}, efficiency: ${this.efficiency}`;
    }

    get_efficiency() {
        return `${this.efficiency}%`;
    }

    set_efficiency(value) {
        this.efficiency = value;
    }
}

class SolarCell extends SolarPlantComponent {
    constructor(position, lastMaintenance, efficiency) {
        super(position, lastMaintenance, efficiency);
    }

    get_info() {
        return `SolarCell at ${this.position}, last maintenance: ${this.lastMaintenance}, efficiency: ${this.efficiency}`;
    }

    get_efficiency() {
        return `${this.efficiency}%`;
    }

    set_efficiency(value) {
        this.efficiency = value;
    }
}

module.exports = {
    Zone,
    SolarCell,
    Inverter,
    Transformer,
    SolarPlant
};