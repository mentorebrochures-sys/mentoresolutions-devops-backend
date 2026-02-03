const db = require("../db");

// ================= GET =================
exports.getContacts = (req, res) => {
  db.query("SELECT * FROM contacts ORDER BY id ASC", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

// ================= ADD =================
exports.addContact = (req, res) => {
  const { email, mobile, instagram, linkedin } = req.body;

  const sql =
    "INSERT INTO contacts (email, mobile, instagram, linkedin) VALUES (?,?,?,?)";

  db.query(sql, [email, mobile, instagram, linkedin], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId });
  });
};

// ================= UPDATE =================
exports.updateContact = (req, res) => {
  const { id } = req.params;
  const { email, mobile, instagram, linkedin } = req.body;

  const sql =
    "UPDATE contacts SET email=?, mobile=?, instagram=?, linkedin=? WHERE id=?";

  db.query(sql, [email, mobile, instagram, linkedin, id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Updated" });
  });
};

// ================= DELETE =================
exports.deleteContact = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM contacts WHERE id=?", [id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted" });
  });
};
