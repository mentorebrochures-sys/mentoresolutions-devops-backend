const supabase = require('../supabaseClient');

exports.create = async (req, res) => {
    try {
        const { name, role, company, pkg } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ error: "Image file is required!" });

        // 1. Upload Image to Supabase Storage
        const bucketName = process.env.PLACEMENT_BUCKET; 
        const fileName = `placements/${Date.now()}_${file.originalname}`;

        const { data: upData, error: upErr } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file.buffer, { contentType: file.mimetype });

        if (upErr) throw upErr;

        // 2. Get Public URL
        const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
        const imageUrl = urlData.publicUrl;

        // 3. Save to Database
        const { data, error: dbErr } = await supabase
            .from('placements')
            .insert([{ name, role, company, pkg, image: imageUrl }])
            .select();

        if (dbErr) throw dbErr;

        res.status(201).json({ message: "Placement added!", data: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const { data, error } = await supabase.from('placements').select('*').order('id', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        // Optional: Add logic to delete from storage as well
        const { error } = await supabase.from('placements').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};