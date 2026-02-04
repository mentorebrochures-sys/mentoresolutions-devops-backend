const supabase = require('../supabaseClient');

exports.getAll = async (req, res) => {
    const { data, error } = await supabase.from('certificates').select('*').order('created_at', { ascending: false });
    res.status(200).json(error ? { error: error.message } : data);
};

exports.create = async (req, res) => {
    try {
        const file = req.file;
        const fileName = `${Date.now()}_${file.originalname}`;
        const { error: upErr } = await supabase.storage.from(process.env.CERTIFICATE_BUCKET).upload(fileName, file.buffer);
        if (upErr) throw upErr;

        const { data: urlData } = supabase.storage.from(process.env.CERTIFICATE_BUCKET).getPublicUrl(fileName);
        const { data, error } = await supabase.from('certificates').insert([{ image: urlData.publicUrl }]);
        res.status(201).json(error ? { error: error.message } : data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.delete = async (req, res) => {
    const { error } = await supabase.from('certificates').delete().eq('id', req.params.id);
    res.status(200).json(error ? { error: error.message } : { message: "Deleted Successfully" });
};