const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Routes
const trainingRoutes = require("./routes/trainingRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const placementRoutes = require("./routes/placementRoutes");
const courseRoutes = require("./routes/courseRoutes");
const contactRoutes = require("./routes/contactRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= API ROUTES =================
app.use("/api/trainings", trainingRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/upload", uploadRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ❌ DO NOT use app.listen() on Vercel

// ✅ Export app for Vercel serverless
module.exports = app;
