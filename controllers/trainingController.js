const supabase = require("../supabaseClient");

exports.getTrainings = async (req, res) => {
  const { data, error } = await supabase.from("trainings").select("*").order("id", { ascending: false });
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};

exports.addTraining = async (req, res) => {
  const { name, duration, startDate } = req.body;
  if (!name || !duration || !startDate) return res.status(400).json({ message: "Name, duration and start date are required" });

  const { data, error } = await supabase.from("trainings").insert([{ name, duration, start_date: startDate }]).select();
  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json(data[0]);
};

exports.updateTraining = async (req, res) => {
  const { id } = req.params;
  const { name, duration, startDate } = req.body;
  if (!name || !duration || !startDate) return res.status(400).json({ message: "Name, duration and start date are required" });

  const { data, error } = await supabase.from("trainings").update({ name, duration, start_date: startDate }).eq("id", id).select();
  if (error) return res.status(500).json({ message: error.message });
  res.json(data[0] || { message: "Not found" });
};

exports.deleteTraining = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("trainings").delete().eq("id", id);
  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: "Deleted successfully" });
};
