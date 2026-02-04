const supabase = require("../supabaseClient");

exports.getCourses = async (req, res) => {
  const { data, error } = await supabase.from("courses").select("*").order("id", { ascending: false });
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};

exports.addCourse = async (req, res) => {
  const { duration, startDate } = req.body;
  if (!duration || !startDate) return res.status(400).json({ message: "Duration and start date are required" });

  const { data, error } = await supabase.from("courses").insert([{ duration, start_date: startDate }]).select();
  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json(data[0]);
};

exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { duration, startDate } = req.body;
  if (!duration || !startDate) return res.status(400).json({ message: "Duration and start date are required" });

  const { data, error } = await supabase.from("courses").update({ duration, start_date: startDate }).eq("id", id).select();
  if (error) return res.status(500).json({ message: error.message });
  res.json(data[0] || { message: "Not found" });
};

exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: "Deleted successfully" });
};
