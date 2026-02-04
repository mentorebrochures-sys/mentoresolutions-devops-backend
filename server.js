const express = require("express");
const cors = require("cors");

// Routes
const trainingRoutes = require("./routes/trainingRoutes");
const courseRoutes = require("./routes/courseRoutes");
const placementRoutes = require("./routes/placementRoutes");
const contactRoutes = require("./routes/contactRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/trainings", trainingRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/certificates", certificateRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Supabase Backend running 🚀");
});

// Serverless export
module.exports = app;
