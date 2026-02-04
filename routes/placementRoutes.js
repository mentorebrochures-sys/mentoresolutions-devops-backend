const express = require("express");
const upload = require("../multer");
const controller = require("../controllers/placementController");

const router = express.Router();

// IMAGE UPLOAD
router.post(
  "/upload",
  upload.single("image"),
  controller.uploadPlacementImage
);

// CRUD ROUTES
router.get("/", controller.getPlacements);
router.post("/", controller.addPlacement);
router.put("/:id", controller.updatePlacement);
router.delete("/:id", controller.deletePlacement);

module.exports = router;
