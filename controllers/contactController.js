const supabase = require('../supabaseClient');

// 1. Sagle contacts milavne
exports.getContact = async (req, res) => {
    const { data, error } = await supabase.from('contacts').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

// 2. Navin contact record tayar karne
exports.createContact = async (req, res) => {
    // req.body madhe email, phone, address he asave
    const { data, error } = await supabase
        .from('contacts')
        .insert([req.body])
        .select(); // He garjeche aahe jyamule frontend la saved data lagech disto

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
};

// 3. Existing contact update karne
exports.updateContact = async (req, res) => {
    const { data, error } = await supabase
        .from('contacts')
        .update(req.body)
        .eq('id', req.params.id)
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};