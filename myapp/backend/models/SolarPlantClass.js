const { SolarPlantComponent } = require('./SolarPlantComponentClass.js');

class Zone {
    constructor(zoneName, numSolarX, numSolarY) {
        this.zoneName = zoneName;
        this.numSolarX = numSolarX;
        this.numSolarY = numSolarY;
        this.solarCellPanel = [];
    }

    //สร้าง SolarCell push เข้า Array
    generateSolarCells() {
        for (let x = 0; x < this.numSolarX; x++) {
            for (let y = 0; y < this.numSolarY; y++) {
                const position = `Column: ${x}, Row: ${y}`;
                const thisDay = new Date().toISOString();
                const solarCell = new SolarCell(position, thisDay);
                this.solarCellPanel.push(solarCell);
            }
        }
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

    //ทำให้ solaplant เก็บ Zone ได้
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
        return this.efficiency;
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
        return this.efficiency;
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
        return this.efficiency;
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