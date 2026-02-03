const db = require("../db");

// ================= ADD CERTIFICATE =================
exports.addCertificate = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image || typeof image !== "string" || !image.startsWith("http")) {
      return res.status(400).json({ message: "Valid image URL is required" });
    }

    const [result] = await db.query(
      "INSERT INTO certificates (image) VALUES (?)",
      [image]
    );

    res.status(201).json({
      id: result.insertId,
      image,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

// ================= GET CERTIFICATES =================
exports.getCertificates = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM certificates ORDER BY id ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

// ================= UPDATE CERTIFICATE =================
exports.updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    if (!image || typeof image !== "string" || !image.startsWith("http")) {
      return res.status(400).json({ message: "Valid image URL is required" });
    }

    const [result] = await db.query(
      "UPDATE certificates SET image=? WHERE id=?",
      [image, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json({ message: "Certificate updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

// ================= DELETE CERTIFICATE =================
exports.deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const [result] = await db.query(
      "DELETE FROM certificates WHERE id=?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json({ message: "Certificate deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};
