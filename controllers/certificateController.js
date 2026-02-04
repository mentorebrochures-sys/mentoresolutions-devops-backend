const supabase = require('../supabaseClient');

exports.getAll = async (req, res) => {
    const { data, error } = await supabase.from('certificates').select('*');
    res.json(error ? { error: error.message } : data);
};

exports.create = async (req, res) => {
    try {
        const file = req.file;
        const fileName = `certs/${Date.now()}_${file.originalname}`;
        const { data: upData, error: upErr } = await supabase.storage.from('images').upload(fileName, file.buffer);
        if (upErr) throw upErr;
        
        const { data: url } = supabase.storage.from('images').getPublicUrl(fileName);
        const { data, error } = await supabase.from('certificates').insert([{ image: url.publicUrl }]);
        res.status(201).json(error ? { error: error.message } : data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.delete = async (req, res) => {
    const { error } = await supabase.from('certificates').delete().eq('id', req.params.id);
    res.json(error ? { error: error.message } : { message: "Deleted" });
};