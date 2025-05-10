require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const zoneRoutes = require("./routes/zoneRoutes");
const solarPlantRoutes = require("./routes/solarplantRoutes");

const app = express();

app.use(express.json());

// cross-origin-access
app.use(cors());

// 📌 MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// 📌 Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/zones", zoneRoutes);
app.use("/solarplants", solarPlantRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
