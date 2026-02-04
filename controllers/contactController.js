const supabase = require("../supabaseClient");

exports.getContacts = async (req, res) => {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("id", { ascending: true });

  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};

exports.addContact = async (req, res) => {
  const { email, mobile, instagram, linkedin } = req.body;

  if (!email || !mobile) {
    return res.status(400).json({ message: "Email and mobile are required" });
  }

  const { data, error } = await supabase
    .from("contacts")
    .insert([{ email, mobile, instagram, linkedin }])
    .select();

  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json(data[0]);
};

exports.updateContact = async (req, res) => {
  const { id } = req.params;
  const { email, mobile, instagram, linkedin } = req.body;

  if (!email || !mobile) {
    return res.status(400).json({ message: "Email and mobile are required" });
  }

  const { data, error } = await supabase
    .from("contacts")
    .update({ email, mobile, instagram, linkedin })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ message: error.message });
  res.json(data[0] || { message: "Not found" });
};

exports.deleteContact = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: "Deleted successfully" });
};
