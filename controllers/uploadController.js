const axios = require("axios");
const FormData = require("form-data");

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Convert file to base64
    const base64Image = file.buffer.toString("base64");

    // Prepare form-data for ImgBB
    const form = new FormData();
    form.append("image", base64Image);
    form.append("key", process.env.IMGBB_API_KEY);

    // Send POST request
    const response = await axios.post("https://api.imgbb.com/1/upload", form, {
      headers: form.getHeaders(),
    });

    res.json({ url: response.data.data.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Image upload failed" });
  }
};
