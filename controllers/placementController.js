const supabase = require("../supabaseClient");

exports.getPlacements = async (req, res) => {
  const { data, error } = await supabase.from("placements").select("*").order("id", { ascending: true });
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};

exports.addPlacement = async (req, res) => {
  const { name, role, company, package: pkg, image } = req.body;
  const { data, error } = await supabase.from("placements").insert([{ name, role, company, package: pkg, image }]);
  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json(data[0]);
};

exports.updatePlacement = async (req, res) => {
  const { id } = req.params;
  const { name, role, company, package: pkg, image } = req.body;
  const { data, error } = await supabase.from("placements").update({ name, role, company, package: pkg, image }).eq("id", id);
  if (error) return res.status(500).json({ message: error.message });
  res.json(data[0] || { message: "Not found" });
};

exports.deletePlacement = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("placements").delete().eq("id", id);
  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: "Deleted successfully" });
};
