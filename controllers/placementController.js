const supabase = require('../supabaseClient');

// 1. GET ALL PLACEMENTS
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

// 2. CREATE NEW PLACEMENT
exports.create = async (req, res) => {
    try {
        const { name, role, company, pkg } = req.body; // Package badalun pkg kela

        if (!req.file) {
            return res.status(400).json({ error: "Image file is missing!" });
        }

        const fileName = `${Date.now()}_${req.file.originalname}`;
        
        // Storage upload
        const { error: uploadError } = await supabase.storage
            .from(process.env.PLACEMENT_BUCKET)
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: true
            });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
            .from(process.env.PLACEMENT_BUCKET)
            .getPublicUrl(fileName);

        const publicUrl = urlData.publicUrl;

        // Database entry (pkg column use kela aahe)
        const { data, error: dbError } = await supabase
            .from('placements')
            .insert([{ name, role, company, pkg, image: publicUrl }])
            .select();

        if (dbError) throw dbError;

        res.status(201).json({ message: "Placement created!", data: data[0] });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. UPDATE PLACEMENT
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, company, pkg } = req.body; // Pkg variable use kela

        const { data: existingData, error: fetchError } = await supabase
            .from('placements')
            .select('image')
            .eq('id', id)
            .single();

        if (fetchError || !existingData) {
            return res.status(404).json({ error: "Placement not found!" });
        }

        let imageUrl = existingData.image;

        if (req.file) {
            // Juni file delete kara
            const oldFileName = existingData.image.split('/').pop();
            await supabase.storage
                .from(process.env.PLACEMENT_BUCKET)
                .remove([oldFileName]);

            // Navin upload
            const newFileName = `${Date.now()}_${req.file.originalname}`;
            const { error: uploadError } = await supabase.storage
                .from(process.env.PLACEMENT_BUCKET)
                .upload(newFileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: true
                });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from(process.env.PLACEMENT_BUCKET)
                .getPublicUrl(newFileName);
            
            imageUrl = urlData.publicUrl;
        }

        // Database update
        const { data, error: dbError } = await supabase
            .from('placements')
            .update({ name, role, company, pkg, image: imageUrl })
            .eq('id', id)
            .select();

        if (dbError) throw dbError;

        res.status(200).json({ message: "Placement updated!", data: data[0] });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. DELETE PLACEMENT
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: record, error: fetchError } = await supabase
            .from('placements')
            .select('image')
            .eq('id', id)
            .single();

        if (fetchError || !record) {
            return res.status(404).json({ error: "Record not found!" });
        }

        const fileName = record.image.split('/').pop();
        await supabase.storage
            .from(process.env.PLACEMENT_BUCKET)
            .remove([fileName]);

        const { error: dbError } = await supabase
            .from('placements')
            .delete()
            .eq('id', id);

        if (dbError) throw dbError;

        res.status(200).json({ message: "Placement deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};