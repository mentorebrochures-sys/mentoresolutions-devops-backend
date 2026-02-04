const express = require("express");
const cors = require("cors");
require("dotenv").config();

// ================= ROUTES =================
const trainingRoutes = require("./routes/trainingRoutes");
const courseRoutes = require("./routes/courseRoutes");
const placementRoutes = require("./routes/placementRoutes");
const contactRoutes = require("./routes/contactRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= API ROUTES =================
app.use("/api/trainings", trainingRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/certificates", certificateRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("Supabase Backend running 🚀");
});

// ❌ Vercel वर app.listen() वापरायचं नाही
// ✅ serverless साठी app export करायचं
module.exports = app;


