require("dotenv").config();

const express = require("express");
const prisma = require("./configs/prisma");
const passport = require("./configs/passport");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const index = require("./modules/auth/routes/index");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

["uploads/profiles"].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// API calling
app.use("/api/auth", index);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Zameen 360 API v1.0" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Zameen 360 running on http://localhost:${PORT}`);
});