const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const habitRoutes = require("./routes/habits");
const todoRoutes = require("./routes/todos");

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/todos", todoRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Winter Arc Backend is running! ❄️",
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });