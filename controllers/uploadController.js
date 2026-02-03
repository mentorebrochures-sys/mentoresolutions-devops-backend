const supabase = require("../supabaseClient");
const path = require("path");

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.random()}${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: true });

    if (uploadError) return res.status(500).json({ message: "Upload failed" });

    const { data } = supabase.storage.from("images").getPublicUrl(fileName);
    res.status(201).json({ url: data.publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
