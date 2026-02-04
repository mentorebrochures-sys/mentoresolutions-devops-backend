const supabase = require('../supabaseClient');

exports.getAll = async (req, res) => {
    const { data, error } = await supabase.from('courses').select('*');
    res.json(error ? { error: error.message } : data);
};

exports.create = async (req, res) => {
    const { data, error } = await supabase.from('courses').insert([req.body]);
    res.status(201).json(error ? { error: error.message } : data);
};

exports.update = async (req, res) => {
    const { data, error } = await supabase.from('courses').update(req.body).eq('id', req.params.id);
    res.json(error ? { error: error.message } : data);
};

exports.delete = async (req, res) => {
    await supabase.from('courses').delete().eq('id', req.params.id);
    res.json({ message: "Course Deleted" });
};