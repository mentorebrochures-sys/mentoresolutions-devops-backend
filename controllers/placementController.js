const supabase = require("../supabaseClient");

/* ===============================
   IMAGE UPLOAD (ONLY)
=============================== */
exports.uploadPlacementImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const file = req.file;
    const safeName = file.originalname.replace(/\s+/g, "-");
    const fileName = `placements/${Date.now()}-${safeName}`;

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

    res.json({ image: data.publicUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   CRUD OPERATIONS
=============================== */

// GET all placements
exports.getPlacements = async (req, res) => {
  const { data, error } = await supabase
    .from("placements")
    .select("*")
    .order("id", { ascending: true });

  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};

// ADD placement
exports.addPlacement = async (req, res) => {
  const { name, role, company, package: pkg, image } = req.body;

  const { data, error } = await supabase
    .from("placements")
    .insert([{ name, role, company, package: pkg, image }]);

  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json(data[0]);
};

// UPDATE placement
exports.updatePlacement = async (req, res) => {
  const { id } = req.params;
  const { name, role, company, package: pkg, image } = req.body;

  const { data, error } = await supabase
    .from("placements")
    .update({ name, role, company, package: pkg, image })
    .eq("id", id);

  if (error) return res.status(500).json({ message: error.message });
  res.json(data[0] || { message: "Not found" });
};

// DELETE placement
exports.deletePlacement = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("placements")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: "Deleted successfully" });
};
