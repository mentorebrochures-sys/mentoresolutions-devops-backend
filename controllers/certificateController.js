const supabase = require("../supabaseClient");

exports.uploadCertificateImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { data, error } = await supabase.storage
      .from("certificates") // your bucket name
      .upload(`public/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: req.file.mimetype,
      });

    if (error) throw error;

    res.json({ message: "File uploaded successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCertificates = async (req, res) => {
  // your logic
  res.json({ message: "Get all certificates" });
};

exports.addCertificate = async (req, res) => {
  // your logic
  res.json({ message: "Add a certificate" });
};

exports.updateCertificate = async (req, res) => {
  // your logic
  res.json({ message: "Update certificate" });
};

exports.deleteCertificate = async (req, res) => {
  // your logic
  res.json({ message: "Delete certificate" });
};
