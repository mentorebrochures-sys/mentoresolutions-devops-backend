const express = require("express");
const router = express.Router();

/*
  ⚠️ Important:
  - Multer / diskStorage वापरत नाही
  - Vercel serverless filesystem read-only आहे
  - Image upload ImgBB वर frontend कडून होतो
  - Backend ला फक्त image URL (string) मिळतो
*/

const placementController = require("../controllers/placementController");

// ================= PLACEMENT ROUTES =================

// Add placement
// Expects body:
// {
//   name: string,
//   role: string,
//   company: string,
//   package: string,
//   image: "https://i.ibb.co/..."
// }
router.post("/", placementController.addPlacement);

// Get all placements
router.get("/", placementController.getPlacements);

// Update placement by ID
// Expects same body as add (image optional)
router.put("/:id", placementController.updatePlacement);

// Delete placement by ID
router.delete("/:id", placementController.deletePlacement);

module.exports = router;
