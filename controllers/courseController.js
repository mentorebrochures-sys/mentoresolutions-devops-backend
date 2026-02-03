const db = require("../db");

// ===============================
// GET ALL COURSES
// ===============================
exports.getCourses = (req, res) => {
  db.query("SELECT * FROM courses ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

// ===============================
// ADD COURSE
// ===============================
exports.addCourse = (req, res) => {
  const { duration, startDate } = req.body;

  if (!duration || !startDate) {
    return res.status(400).json({ message: "Duration and Start Date required" });
  }

  const sql = "INSERT INTO courses (duration, start_date) VALUES (?, ?)";

  db.query(sql, [duration, startDate], (err, result) => {
    if (err) return res.status(500).json(err);

    res.status(201).json({
      id: result.insertId,
      duration,
      startDate
    });
  });
};

// ===============================
// UPDATE COURSE
// ===============================
exports.updateCourse = (req, res) => {
  const { id } = req.params;
  const { duration, startDate } = req.body;

  const sql =
    "UPDATE courses SET duration = ?, start_date = ? WHERE id = ?";

  db.query(sql, [duration, startDate, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Course updated" });
  });
};

// ===============================
// DELETE COURSE
// ===============================
exports.deleteCourse = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM courses WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Course deleted" });
  });
};
