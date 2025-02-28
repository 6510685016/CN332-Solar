const mongoose = require("mongoose");
const { ROLE, PERMISSIONS, LP } = require("../models/Permission");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/User");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create(); // Ensure this is awaited
  const mongoUri = mongoServer.getUri(); // Make sure this gets a valid URI

  if (!mongoUri) {
    throw new Error("MongoMemoryServer did not return a URI"); // Debugging step
  }

  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});


describe("User Model", () => {
  test("should assign permissions based on roles", async () => {
    const user = new User({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      authProvider: "local",
      roles: [ROLE.ADMIN],
    });

    await user.save();

    // Assuming ROLE.ADMIN has specific permissions
    expect(user.permissions).toEqual(PERMISSIONS[ROLE.ADMIN]);
  });

  test("should throw error when updating permissions for ADMIN role", () => {
    expect(() =>
      User.updatePermissions(ROLE.ADMIN, [LP.CONTROL_DRONES])
    ).toThrow("Admin permissions cannot be modified");
  });

  test("should update permissions for a non-ADMIN role", () => {
    const newPermissions = [LP.MANAGE_USERS, LP.VIEW_REPORTS, LP.CONTROL_DRONES, LP.MANAGE_SOLAR_PLANTS];

    User.updatePermissions(ROLE.DATA_ANALYST, newPermissions);

    expect(PERMISSIONS[ROLE.DATA_ANALYST]).toEqual(newPermissions);
  });

  test("should validate user permission for a given action", async () => {
    const user = new User({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      authProvider: "local",
      roles: [ROLE.ADMIN],
      assignedSolarPlants: [new mongoose.Types.ObjectId()],
    });

    await user.save();

    const permissionCheck = User.hasPermission(user, LP.MANAGE_USERS);
    expect(permissionCheck).toBe(true); // Assuming user has LP.READ permission
  });

  test("should return false for user with missing permission", async () => {
    const newPermissions = [LP.VIEW_REPORTS, LP.ANALYZE_DATA];
    User.updatePermissions(ROLE.DATA_ANALYST, newPermissions);
    const user = new User({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      authProvider: "local",
      roles: [ROLE.DATA_ANALYST],
    });

    await user.save();
    console.log(user.permissions);
    const permissionCheck = User.hasPermission(user, LP.MANAGE_USERS);
    expect(permissionCheck).toBe(false);
  });

  test("should validate user permission for specific solar plant", async () => {
    const solarPlantId = new mongoose.Types.ObjectId();
    const user = new User({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      authProvider: "local",
      roles: [ROLE.ADMIN],
      assignedSolarPlants: [solarPlantId],
    });

    await user.save();

    const permissionCheck = User.hasPermission(user, LP.MANAGE_USERS, solarPlantId);
    expect(permissionCheck).toBe(true);
  });

  test("should reject user permission for unassigned solar plant", async () => {
    const solarPlantId = new mongoose.Types.ObjectId();
    const user = new User({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      authProvider: "local",
      roles: [ROLE.USER],
      assignedSolarPlants: [],
    });

    await user.save();

    const permissionCheck = User.hasPermission(user, LP.READ, solarPlantId);
    expect(permissionCheck).toBe(false);
  });
});
