const supabase = require('../supabaseClient');

exports.getContact = async (req, res) => {
    const { data, error } = await supabase.from('contacts').select('*');
    res.json(error ? { error: error.message } : data);
};

exports.updateContact = async (req, res) => {
    const { data, error } = await supabase.from('contacts').update(req.body).eq('id', req.params.id);
    res.json(error ? { error: error.message } : data);
};

exports.createContact = async (req, res) => {
    const { data, error } = await supabase.from('contacts').insert([req.body]);
    res.json(error ? { error: error.message } : data);
};