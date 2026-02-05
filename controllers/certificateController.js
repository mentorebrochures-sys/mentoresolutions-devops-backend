const supabase = require('../supabaseClient');

// 1. GET ALL CERTIFICATES - Database madhun certificates fetch karne
exports.getAll = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('certificates') // Table Name
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. CREATE NEW CERTIFICATE - Storage madhe upload ani DB madhe entry
exports.create = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Certificate image missing!" });
        }

        const bucketName = process.env.CERTIFICATE_BUCKET; // .env madhun 'certificate-images' gheil
        const fileName = `${Date.now()}_${req.file.originalname}`;
        
        // --- STORAGE SECTION: Image Upload ---
        const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: true
            });

        if (uploadError) throw uploadError;

        // Image chi Public URL milvane
        const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        const publicUrl = urlData.publicUrl;

        // --- DATABASE SECTION: URL Save karne ---
        const { data, error: dbError } = await supabase
            .from('certificates') // Table Name
            .insert([{ image: publicUrl }])
            .select();

        if (dbError) throw dbError;

        res.status(201).json({ message: "Certificate added successfully!", data: data[0] });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. DELETE CERTIFICATE - Storage ani DB doghun madhun kadhne
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const bucketName = process.env.CERTIFICATE_BUCKET;

        // Aadhi record check kara jene karun image URL milel
        const { data: record, error: fetchError } = await supabase
            .from('certificates')
            .select('image')
            .eq('id', id)
            .single();

        if (fetchError || !record) {
            return res.status(404).json({ error: "Certificate not found!" });
        }

        // STORAGE madhun photo delete karne
        const fileName = record.image.split('/').pop();
        await supabase.storage
            .from(bucketName)
            .remove([fileName]);

        // DATABASE madhun row delete karne
        const { error: dbError } = await supabase
            .from('certificates')
            .delete()
            .eq('id', id);

        if (dbError) throw dbError;

        res.status(200).json({ message: "Certificate and image deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};