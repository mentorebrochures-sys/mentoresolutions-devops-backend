const supabase = require('../supabaseClient');

exports.getAll = async (req, res) => {
    const { data, error } = await supabase.from('trainings').select('*');
    res.json(error ? { error: error.message } : data);
};

exports.create = async (req, res) => {
    try {
        const fileName = `icon_${Date.now()}`;
        await supabase.storage.from(process.env.TRAINING_BUCKET).upload(fileName, req.file.buffer);
        const { data: url } = supabase.storage.from(process.env.TRAINING_BUCKET).getPublicUrl(fileName);

        const { data, error } = await supabase.from('trainings').insert([{ name: req.body.name, icon: url.publicUrl }]);
        res.status(201).json(error ? { error: error.message } : data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.delete = async (req, res) => {
    await supabase.from('trainings').delete().eq('id', req.params.id);
    res.json({ message: "Deleted" });
};