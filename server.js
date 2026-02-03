const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Routes
const trainingRoutes = require("./routes/trainingRoutes");
const courseRoutes = require("./routes/courseRoutes");
const placementRoutes = require("./routes/placementRoutes");
const contactRoutes = require("./routes/contactRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

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
app.use("/api/upload", uploadRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("Supabase Backend running 🚀");
});

// ❌ Do not use app.listen() on Vercel

// ✅ Export app for serverless
module.exports = app;

// if (process.env.NODE_ENV !== "production") {
//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => {
//     console.log(`Server running locally at http://localhost:${PORT}`);
//   });
// }

