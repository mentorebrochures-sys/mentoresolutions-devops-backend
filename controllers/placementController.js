const supabase = require('../supabaseClient');

// GET ALL PLACEMENTS
exports.getAll = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('placements')
            .select('*')
            .order('id', { ascending: false });
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CREATE PLACEMENT
exports.create = async (req, res) => {
    try {
        const { name, role, company, pkg } = req.body;
        if (!req.file) return res.status(400).json({ error: "Image is required" });

        const bucketName = process.env.PLACEMENT_BUCKET; 
        const fileName = `placements/${Date.now()}_${req.file.originalname}`;

        // 1. Upload to Supabase Storage
        const { error: upErr } = await supabase.storage
            .from(bucketName)
            .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

        if (upErr) throw upErr;

        // 2. Get Public URL
        const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);

        // 3. Insert into Database
        const { data, error: dbErr } = await supabase
            .from('placements')
            .insert([{ name, role, company, pkg, image: urlData.publicUrl }])
            .select();

        if (dbErr) throw dbErr;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE PLACEMENT
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const bucketName = process.env.PLACEMENT_BUCKET;

        const { data: record } = await supabase.from('placements').select('image').eq('id', id).single();
        if (record) {
            const fileName = record.image.split('/').pop();
            await supabase.storage.from(bucketName).remove([`placements/${fileName}`]);
        }

        const { error } = await supabase.from('placements').delete().eq('id', id);
        if (error) throw error;
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};