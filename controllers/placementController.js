const db = require("../db");

// ================= ADD PLACEMENT =================
exports.addPlacement = async (req, res) => {
  try {
    const { name, role, company, package: pkg, image } = req.body;

    // Basic validations
    if (!name || !role || !company || !pkg) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!image || typeof image !== "string" || !image.startsWith("http")) {
      return res.status(400).json({ message: "Valid image URL is required" });
    }

    const [result] = await db.query(
      "INSERT INTO placements (name, role, company, package, image) VALUES (?, ?, ?, ?, ?)",
      [name, role, company, pkg, image]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      role,
      company,
      package: pkg,
      image,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

// ================= GET PLACEMENTS =================
exports.getPlacements = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM placements ORDER BY id ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

// ================= UPDATE PLACEMENT =================
exports.updatePlacement = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, company, package: pkg, image } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    if (!name || !role || !company || !pkg) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let sql, values;

    if (image) {
      if (typeof image !== "string" || !image.startsWith("http")) {
        return res.status(400).json({ message: "Valid image URL is required" });
      }

      sql =
        "UPDATE placements SET name=?, role=?, company=?, package=?, image=? WHERE id=?";
      values = [name, role, company, pkg, image, id];
    } else {
      sql =
        "UPDATE placements SET name=?, role=?, company=?, package=? WHERE id=?";
      values = [name, role, company, pkg, id];
    }

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Placement not found" });
    }

    res.json({ message: "Placement updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

// ================= DELETE PLACEMENT =================
exports.deletePlacement = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const [result] = await db.query(
      "DELETE FROM placements WHERE id=?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Placement not found" });
    }

    res.json({ message: "Placement deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};
