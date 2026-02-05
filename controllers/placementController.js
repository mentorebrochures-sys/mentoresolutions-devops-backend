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

// 2. CREATE PLACEMENT
exports.create = async (req, res) => {
    try {
        const { name, role, company, pkg } = req.body;
        if (!req.file) return res.status(400).json({ error: "Image is required" });

        const bucketName = process.env.PLACEMENT_BUCKET; 
        const fileName = `student_${Date.now()}_${req.file.originalname.replace(/\s/g, '_')}`;

        // Step 1: Upload to Supabase Storage
        const { error: upErr } = await supabase.storage
            .from(bucketName)
            .upload(fileName, req.file.buffer, { 
                contentType: req.file.mimetype,
                upsert: false 
            });

        if (upErr) throw upErr;

        // Step 2: Get Public URL
        const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);

        // Step 3: Insert into Table
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

// 3. UPDATE PLACEMENT
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, company, pkg } = req.body;
        let imageUrl = req.body.image; 
        const bucketName = process.env.PLACEMENT_BUCKET;

        // जर नवीन फाईल अपलोड केली असेल तर
        if (req.file) {
            // १. जुनी इमेज मिळवून ती डिलीट करा (Optional but Recommended)
            const { data: oldRecord } = await supabase
                .from('placements')
                .select('image')
                .eq('id', id)
                .single();

            if (oldRecord && oldRecord.image) {
                const oldFileName = oldRecord.image.split('/').pop();
                await supabase.storage.from(bucketName).remove([oldFileName]);
            }

            // २. नवीन इमेज अपलोड करा
            const fileName = `student_${Date.now()}_${req.file.originalname.replace(/\s/g, '_')}`;
            const { error: upErr } = await supabase.storage
                .from(bucketName)
                .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

            if (upErr) throw upErr;
            const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
            imageUrl = urlData.publicUrl;
        }

        const { data, error } = await supabase
            .from('placements')
            .update({ name, role, company, pkg, image: imageUrl })
            .eq('id', id)
            .select();

        if (error) throw error;
        res.status(200).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. DELETE PLACEMENT
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const bucketName = process.env.PLACEMENT_BUCKET;

        // १. प्रथम रेकॉर्ड मधून इमेज पाथ मिळवा
        const { data: record, error: fetchErr } = await supabase
            .from('placements')
            .select('image')
            .eq('id', id)
            .single();

        if (fetchErr) throw fetchErr;

        // २. जर इमेज असेल तर स्टोरेज मधून डिलीट करा
        if (record && record.image) {
            const fileName = record.image.split('/').pop();
            const { error: storageErr } = await supabase.storage
                .from(bucketName)
                .remove([fileName]);
            
            if (storageErr) console.error("Storage Delete Error:", storageErr.message);
        }

        // ३. आता डेटाबेसमधून रेकॉर्ड डिलीट करा
        const { error: dbErr } = await supabase
            .from('placements')
            .delete()
            .eq('id', id);

        if (dbErr) throw dbErr;

        res.status(200).json({ message: "Placement record and image deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};