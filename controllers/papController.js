const supabase = require('../supabaseClient');

// 1. Get all PAP Steps
exports.getAll = async (req, res) => {
    const { data, error } = await supabase
        .from('pap_steps')
        .select('*')
        .order('id', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

// 2. Create New PAP Step
exports.create = async (req, res) => {
    // status काढून टाकले आहे
    const { title, description } = req.body; 

    // इन्सर्ट करताना फक्त title आणि description पाठवा
    const { data, error } = await supabase
        .from('pap_steps')
        .insert([{ title, description }])
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
};

// 3. Update PAP Step
exports.update = async (req, res) => {
    const { title, description } = req.body;

    const { data, error } = await supabase
        .from('pap_steps')
        .update({ title, description }) // फक्त title आणि description अपडेट होईल
        .eq('id', req.params.id)
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

// 4. Delete PAP Step
exports.delete = async (req, res) => {
    const { error } = await supabase
        .from('pap_steps')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "PAP Step Deleted Successfully" });
};