require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("cookie-session");
require("./config/passport");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());
app.use(cors());

// 📌 ใช้ Session สำหรับ Google Login
app.use(
  session({
    name: "session",
    keys: ["randomkey"],
    maxAge: 24 * 60 * 60 * 1000, // 1 วัน
  })
);
app.use(passport.initialize());
app.use(passport.session());

// 📌 MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// 📌 Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
