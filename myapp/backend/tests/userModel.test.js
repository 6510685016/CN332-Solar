const mongoose = require("mongoose");
const { User, ROLE } = require("../models/User");

describe("User Model Test", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany(); // ล้าง Users ก่อนเริ่มแต่ละเทสต์
  });

  it("ควรสร้าง User ได้", async () => {
    const user = new User({
      username: "testuser",
      email: "test@example.com",
      password: "hashedpassword",
      authProvider: "local",
      roles: [ROLE.DRONE_CONTROLLER],
    });

    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe("test@example.com");
  }, 10000);

  it("ควรป้องกันการสร้าง User ซ้ำ (email ซ้ำกัน)", async () => {
    const user1 = new User({
      username: "user1",
      email: "duplicate@example.com",
      password: "hashedpassword",
      authProvider: "local",
      roles: [ROLE.ADMIN],
    });
  
    const user2 = new User({
      username: "user2",
      email: "duplicate@example.com", // ซ้ำกับ user1
      password: "hashedpassword",
      authProvider: "local",
      roles: [ROLE.ADMIN],
    });
  
    let error = null;
    try {
      await user1.save();
      await user2.save();
    } catch (err) {
      error = err;
      console.error("MongoDB Error:", err); // 🔍 แสดง error ที่แท้จริง
    }
  
    expect(error).not.toBeNull(); // ตรวจสอบว่ามี error
    expect(error.name).toBe("MongoServerError"); // ตรวจสอบชนิดของ error
    expect(error.code).toBe(11000); // ตรวจสอบ error code ว่าเป็น duplicate key
  }, 10000);
});
