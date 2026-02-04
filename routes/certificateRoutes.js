const express = require("express");
const upload = require("../multer"); // ← correct path to utils/multer.js
const controller = require("../controllers/certificateController");

const router = express.Router();

router.post("/upload", upload.single("image"), controller.uploadCertificateImage);
router.get("/", controller.getCertificates);
router.post("/", controller.addCertificate);
router.put("/:id", controller.updateCertificate);
router.delete("/:id", controller.deleteCertificate);

module.exports = router;
