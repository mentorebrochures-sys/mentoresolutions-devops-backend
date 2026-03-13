const supabase = require("../supabaseClient");

exports.uploadCertificate = async (req, res) => {
  try {
    const file = req.file;

    const fileName = `certificates/${Date.now()}-${file.originalname}`;

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

    res.json({
      success: true,
      imageUrl: data.publicUrl,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.uploadPlacement = async (req, res) => {
  try {
    const file = req.file;

    const fileName = `placements/${Date.now()}-${file.originalname}`;

    const { error } = await supabase.storage
      .from("placements-images")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("placements-images")
      .getPublicUrl(fileName);

    res.json({
      success: true,
      imageUrl: data.publicUrl,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
