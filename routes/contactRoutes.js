const express = require("express");
const router = express.Router();

const {
  getContacts,
  addContact,
  updateContact,
  deleteContact
} = require("../controllers/contactController");

// GET all contacts
router.get("/", getContacts);

// ADD a contact
router.post("/", addContact);

// UPDATE a contact by ID
router.put("/:id", updateContact);

// DELETE a contact by ID
router.delete("/:id", deleteContact);

module.exports = router;
