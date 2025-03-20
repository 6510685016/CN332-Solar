require("dotenv").config();
const mongoose = require('mongoose');
const Permission = require('../models/Permission');
const Role = require('../models/Role');

// เชื่อมต่อกับ MongoDB
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

// ฟังก์ชันเพิ่มข้อมูล Permission
async function seedPermissions() {
  const permissions = [
    { name: 'userManage', features: ['delete user', 'edit role', 'assign solar plant', 'get user role'] },
    { name: 'fetchData', features: ['user api', 'get result'] },
    { name: 'taskManage', features: ['task create', 'task edit', 'get result'] },
    { name: 'solarPlantManage', features: ['manage solar plant', 'manage zone', 'get solar plant'] },
    { name: 'maintenance', features: ['maintenance'] }
  ];

  for (const permission of permissions) {
    const exists = await Permission.findOne({ name: permission.name });
    if (!exists) {
      await Permission.create(permission);
      console.log(`Created Permission: ${permission.name}`);
    }
  }
}

// ฟังก์ชันเพิ่มข้อมูล Role
async function seedRoles() {
  const permissions = await Permission.find();

  const permissionMap = permissions.reduce((acc, perm) => {
    acc[perm.name] = perm._id;
    return acc;
  }, {});

  const roles = [
    { 
      name: 'SuperAdmin', 
      permissions: [
        permissionMap.userManage,
        permissionMap.fetchData,
        permissionMap.taskManage,
        permissionMap.solarPlantManage,
        permissionMap.maintenance
      ] 
    },
    { 
      name: 'Admin', 
      permissions: [
        permissionMap.userManage,
        permissionMap.solarPlantManage
      ] 
    },
    { name: 'Analyst', permissions: [permissionMap.fetchData] },
    { name: 'DroneController', permissions: [permissionMap.taskManage] },
    { name: 'Maintenancer', permissions: [permissionMap.maintenance] }
  ];

  for (const role of roles) {
    const exists = await Role.findOne({ name: role.name });
    if (!exists) {
      await Role.create(role);
      console.log(`Created Role: ${role.name}`);
    }
  }
}

// เรียกใช้ทั้งสองฟังก์ชัน
async function seedDatabase() {
  try {
    await seedPermissions();
    await seedRoles();
    console.log('Database seeding completed successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

seedDatabase();
