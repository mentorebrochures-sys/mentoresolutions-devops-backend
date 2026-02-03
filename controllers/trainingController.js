const db = require("../db");

// ================= GET ALL TRAININGS =================
exports.getTrainings = (req, res) => {
  const sql = "SELECT * FROM trainings ORDER BY id ASC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// ================= ADD TRAINING =================
exports.addTraining = (req, res) => {
  const { icon, name } = req.body;

  if (!icon || !name) {
    return res.status(400).json({ message: "icon or name missing" });
  }

  const sql = "INSERT INTO trainings (icon, name) VALUES (?, ?)";
  db.query(sql, [icon, name], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      id: result.insertId,
      icon,
      name,
    });
  });
};

// ================= UPDATE TRAINING =================
exports.updateTraining = (req, res) => {
  const { id } = req.params;
  const { icon, name } = req.body;

  const sql = "UPDATE trainings SET icon=?, name=? WHERE id=?";
  db.query(sql, [icon, name, id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Training updated" });
  });
};

// ================= DELETE TRAINING =================
exports.deleteTraining = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM trainings WHERE id=?";
  db.query(sql, [id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Training deleted" });
  });
};
