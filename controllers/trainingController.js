const supabase = require("../supabaseClient");

exports.getTrainings = async (req, res) => {
  try {
    const { data, error } = await supabase.from("trainings").select("*").order("id", { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

exports.addTraining = async (req, res) => {
  try {
    const { icon, name } = req.body;
    const { data, error } = await supabase.from("trainings").insert([{ icon, name }]);
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

exports.updateTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const { icon, name } = req.body;
    const { data, error } = await supabase.from("trainings").update({ icon, name }).eq("id", id);
    if (error) throw error;
    res.json(data[0] || { message: "Not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

exports.deleteTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("trainings").delete().eq("id", id);
    if (error) throw error;
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};
