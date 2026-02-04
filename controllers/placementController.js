const supabase = require('../supabaseClient');

// 1. GET ALL
exports.getAll = async (req, res) => {
    const { data, error } = await supabase
        .from('placements')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

// 2. CREATE (Data + Image Storage)
exports.create = async (req, res) => {
    try {
        const { name, role, company, package } = req.body;
        
        if (!req.file) return res.status(400).json({ error: "Image is required" });

        // File name unique banva
        const fileName = `${Date.now()}_${req.file.originalname}`;
        
        // Supabase Storage madhe upload करा
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(process.env.PLACEMENT_BUCKET)
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype
            });

        if (uploadError) throw uploadError;

        // Public URL मिळवा
        const { data: urlData } = supabase.storage
            .from(process.env.PLACEMENT_BUCKET)
            .getPublicUrl(fileName);

        // Database madhe entry kara
        const { data, error } = await supabase
            .from('placements')
            .insert([{ 
                name, 
                role, 
                company, 
                package, 
                image: urlData.publicUrl 
            }]);

        if (error) throw error;
        res.status(201).json({ message: "Created!", data });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. UPDATE
exports.update = async (req, res) => {
    try {
        const { name, role, company, package } = req.body;
        let updateData = { name, role, company, package };

        // Jar navin image aali asel tar upload kara
        if (req.file) {
            const fileName = `${Date.now()}_${req.file.originalname}`;
            await supabase.storage.from(process.env.PLACEMENT_BUCKET).upload(fileName, req.file.buffer);
            const { data: urlData } = supabase.storage.from(process.env.PLACEMENT_BUCKET).getPublicUrl(fileName);
            updateData.image = urlData.publicUrl;
        }

        const { data, error } = await supabase
            .from('placements')
            .update(updateData)
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: "Updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. DELETE
exports.delete = async (req, res) => {
    try {
        const { error } = await supabase
            .from('placements')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};