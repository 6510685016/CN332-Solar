const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server"); // Import your Express app
const User = require("../models/User");

// jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../config/passport", () => {}); //ไม่สน passport

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

describe("Auth Routes", () => {
  test("should register a new user", async () => {

    const res = await request(app).post("/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.msg).toBe("User registered successfully");

    const user = await User.findOne({ email: "test@example.com" });
    expect(user).toBeTruthy();
    expect(await bcrypt.compare("password123", user.password)).toBeTruthy();
  });

  test("should not register with existing email", async () => {
    await User.create({ 
        username: "testuser", 
        email: "test@example.com", 
        password: "hashedpassword", 
        authProvider: "local", 
    });

    const res = await request(app).post("/auth/register").send({
      username: "testuser2",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Email already exists");
  });

  test("should login a user with valid credentials", async () => {
    jwt.sign.mockReturnValue("mocked_token");

    await User.create({
      username: "testuser",
      email: "test@example.com",
      password: await bcrypt.hash("password123", 10),
      authProvider: "local",
    });

    const res = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe("mocked_token");
  });

  test("should not login with incorrect password", async () => {

    await User.create({
      username: "testuser",
      email: "test@example.com",
      password: await bcrypt.hash("password123", 10),
      authProvider: "local",
    });

    const res = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("Invalid credentials");
  });

  test("should not login if user doesn't exist", async () => {

    await User.create({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      authProvider: "local",
    });

    const res = await request(app).post("/auth/login").send({
      email: "test2@example.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("User not found");
  });

  test("should get user data with valid token", async () => {
    const user = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: "hashedpassword",
      authProvider: "local",
      roles: ["admin"],
    });

    jwt.verify.mockImplementation((token, secret, callback) => callback(null, { id: user._id }));

    const res = await request(app)
      .get("/auth/user")
      .set("Authorization", "Bearer valid_token");

    expect(res.status).toBe(200);
    expect(res.body.roles).toContain("admin");
    expect(res.body.permissions).toContain("manage_users");
  });

  test("should reject user data request if error occur", async () => {
    jwt.verify.mockImplementation((token, secret, callback) => callback(new Error("Invalid token"), null));

    const res = await request(app)
      .get("/auth/user")
      .set("Authorization", "Bearer invalid_token");

    expect(res.status).toBe(403);
    expect(res.body.msg).toBe("Forbidden");
  });

  test("should reject user data request with invalid token", async () => {
    const user = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      authProvider: "local",
      roles: ["admin"],
    });

    jwt.verify.mockImplementation((token, secret, callback) => callback(null, { id: new mongoose.Types.ObjectId() }));

    const res = await request(app)
      .get("/auth/user")
      .set("Authorization", "Bearer valid_token");

    expect(res.status).toBe(404);
    expect(res.body.msg).toBe("User not found");
  });
});
