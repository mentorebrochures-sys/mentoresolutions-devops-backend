const supabase = require("../supabaseClient");

/* ===============================
   IMAGE UPLOAD (ONLY)
=============================== */
exports.uploadCertificateImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const file = req.file;
    const safeName = file.originalname.replace(/\s+/g, "-");
    const fileName = `certificates/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage
      .from("certificates-images")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("certificates-images")
      .getPublicUrl(fileName);

    res.json({ image: data.publicUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   CRUD OPERATIONS
=============================== */

// GET all certificates
exports.getCertificates = async (req, res) => {
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .order("id", { ascending: true });

  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};

// ADD certificate (image URL only)
exports.addCertificate = async (req, res) => {
  const { image } = req.body;

  const { data, error } = await supabase
    .from("certificates")
    .insert([{ image }]);

  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json(data[0]);
};

// UPDATE certificate
exports.updateCertificate = async (req, res) => {
  const { id } = req.params;
  const { image } = req.body;

  const { data, error } = await supabase
    .from("certificates")
    .update({ image })
    .eq("id", id);

  if (error) return res.status(500).json({ message: error.message });
  res.json(data[0] || { message: "Not found" });
};

// DELETE certificate
exports.deleteCertificate = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("certificates")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: "Deleted successfully" });
};
