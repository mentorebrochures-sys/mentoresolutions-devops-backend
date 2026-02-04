const supabase = require('../supabaseClient');

exports.getAll = async (req, res) => {
    const { data, error } = await supabase.from('placements').select('*');
    res.json(error ? { error: error.message } : data);
};

exports.create = async (req, res) => {
    try {
        const { name, role, company, package } = req.body;
        const fileName = `${Date.now()}_${req.file.originalname}`;
        await supabase.storage.from(process.env.PLACEMENT_BUCKET).upload(fileName, req.file.buffer);
        const { data: url } = supabase.storage.from(process.env.PLACEMENT_BUCKET).getPublicUrl(fileName);

        const { data, error } = await supabase.from('placements').insert([{ name, role, company, package, image: url.publicUrl }]);
        res.status(201).json(error ? { error: error.message } : data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
    const { data, error } = await supabase.from('placements').update(req.body).eq('id', req.params.id);
    res.json(error ? { error: error.message } : data);
};

exports.delete = async (req, res) => {
    const { error } = await supabase.from('placements').delete().eq('id', req.params.id);
    res.json({ message: "Deleted" });
};