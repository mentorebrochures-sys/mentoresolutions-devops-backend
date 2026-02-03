const express = require("express");
const router = express.Router();

const {
  getTrainings,
  addTraining,
  updateTraining,
  deleteTraining
} = require("../controllers/trainingController");

router.get("/", getTrainings);
router.post("/", addTraining);
router.put("/:id", updateTraining);
router.delete("/:id", deleteTraining);

module.exports = router;
