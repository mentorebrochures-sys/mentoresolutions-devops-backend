const express = require("express");
const router = express.Router();

/*
  ⚠️ Important Notes:
  - Multer वापरत नाही (Vercel filesystem read-only आहे)
  - Image upload ImgBB वर frontend कडून होतो
  - Backend ला फक्त image URL मिळतो (string)
*/

const certificateController = require("../controllers/certificateController");

// ================= CERTIFICATE ROUTES =================

// Add certificate (expects: { image: "https://i.ibb.co/..." })
router.post("/", certificateController.addCertificate);

// Get all certificates
router.get("/", certificateController.getCertificates);

// Update certificate by ID (expects: { image: "https://i.ibb.co/..." })
router.put("/:id", certificateController.updateCertificate);

// Delete certificate by ID
router.delete("/:id", certificateController.deleteCertificate);

module.exports = router;
