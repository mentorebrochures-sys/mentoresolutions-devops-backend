const express = require("express");
const router = express.Router();
const controller = require("../controllers/contactController");

router.get("/", controller.getContacts);
router.post("/", controller.addContact);
router.put("/:id", controller.updateContact);
router.delete("/:id", controller.deleteContact);

module.exports = router;
