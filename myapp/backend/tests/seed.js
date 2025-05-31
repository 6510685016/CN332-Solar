require("dotenv").config();
const mongoose = require('mongoose');
const Permission = require('../models/Permission');
const Role = require('../models/Role');
const User = require('../models/User'); // นำเข้าโมเดล User
const bcrypt = require("bcryptjs");

// เชื่อมต่อกับ MongoDB
mongoose.connect(process.env.MONGO_URI);
// const uri = process.env.MONGO_URI;
// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// async function run() {
//   try {
//     // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
//     await mongoose.connect(uri, clientOptions);
//     await mongoose.connection.db.admin().command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await mongoose.disconnect();
//   }
// }
// run().catch(console.dir);

// ฟังก์ชันเพิ่มข้อมูล Permission
async function seedPermissions() {
  const permissions = [
    { name: 'userManage', features: ['nav-usermanage', 'manage-user'] },
    { name: 'fetchData', features: ['nav-fetchdata', 'fetchdata'] },
    { name: 'taskManage', features: ['nav-taskmanage', 'manage-task'] },
    { name: 'solarPlantManage', features: ['nav-solarmanage', 'manage-solarplant', 'manage-zone'] },
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
        permissionMap.maintenance,
      ]
    },
    {
      name: 'Admin',
      permissions: [
        permissionMap.userManage,
        permissionMap.solarPlantManage,
        permissionMap.maintenance,
      ]
    },
    { name: 'Analyst', permissions: [permissionMap.fetchData] },
    { name: 'DroneController', permissions: [permissionMap.taskManage] },
  ];

  for (const role of roles) {
    const exists = await Role.findOne({ name: role.name });
    if (!exists) {
      await Role.create(role);
      console.log(`Created Role: ${role.name}`);
    }
  }
}

// ฟังก์ชันสำหรับสร้างผู้ใช้ทดสอบ
async function seedTestUser() {
  const role = await Role.find();

  const roleMap = role.reduce((acc, perm) => {
    acc[perm.name] = perm._id;
    return acc;
  }, {});
  const userExists = await User.findOne({ email: 'test@example.com' });
  if (!userExists) {
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: await bcrypt.hash("hashedpassword", 10), // ในแอปพลิเคชันจริง รหัสผ่านนี้จะต้องถูกแฮช
      authProvider: 'local',
      roles: [roleMap.SuperAdmin] // คุณอาจต้องการกำหนดบทบาทที่นี่ หรือปล่อยว่างไว้
    });
    await testUser.save();
    // await testUser.setRole([roleMap.SuperAdmin]);
    console.log('Created test user: testuser');
  }
}

// เรียกใช้ทั้งสองฟังก์ชัน
async function seedDatabase() {
  try {
    await seedPermissions();
    await seedRoles();
    await seedTestUser(); // เพิ่มบรรทัดนี้
    console.log('Database seeding completed successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

seedDatabase();
