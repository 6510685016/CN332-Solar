const mongoose = require("mongoose");

const ROLE = {
    ADMIN: 'admin',
    DRONE_CONTROLLER: 'dc',
    DATA_ANALYST: 'da'
};

// list ของ permissions ที่ระบบรองรับ
const LP = {
  MANAGE_USERS: 'manage_users',
  VIEW_REPORTS: 'view_reports',
  CONTROL_DRONES: 'control_drones',
  MANAGE_SOLAR_PLANTS: 'manage_solar_plants',
  VIEW_SOLAR_PLANTS: 'view_solar_plants',
  ANALYZE_DATA: 'analyze_data'
};

// กำหนดสิทธิ์ของแต่ละ Role
const PERMISSIONS = {
  [ROLE.ADMIN]: [LP.MANAGE_USERS, LP.VIEW_REPORTS, LP.CONTROL_DRONES, LP.MANAGE_SOLAR_PLANTS],
  [ROLE.DRONE_CONTROLLER]: [LP.CONTROL_DRONES, LP.VIEW_SOLAR_PLANTS],
  [ROLE.DATA_ANALYST]: [LP.VIEW_REPORTS, LP.ANALYZE_DATA]
};

module.exports = { ROLE, LP, PERMISSIONS };