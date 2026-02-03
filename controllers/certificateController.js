const supabase = require("../supabaseClient");

exports.getCertificates = async (req, res) => {
  const { data, error } = await supabase.from("certificates").select("*").order("id", { ascending: true });
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};

exports.addCertificate = async (req, res) => {
  const { image } = req.body;
  const { data, error } = await supabase.from("certificates").insert([{ image }]);
  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json(data[0]);
};

exports.updateCertificate = async (req, res) => {
  const { id } = req.params;
  const { image } = req.body;
  const { data, error } = await supabase.from("certificates").update({ image }).eq("id", id);
  if (error) return res.status(500).json({ message: error.message });
  res.json(data[0] || { message: "Not found" });
};

exports.deleteCertificate = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("certificates").delete().eq("id", id);
  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: "Deleted successfully" });
};
