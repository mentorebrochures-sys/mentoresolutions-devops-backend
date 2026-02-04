const supabase = require('../supabaseClient');

exports.getAll = async (req, res) => {
    const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });
    
    res.status(200).json(error ? { error: error.message } : data);
};

exports.create = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "Please upload a file" });

        const file = req.file;
        const fileName = `${Date.now()}_${file.originalname.replace(/\s/g, '_')}`; // Space kadhun taka

        // 1. Upload to Storage
        const { error: upErr } = await supabase.storage
            .from(process.env.CERTIFICATE_BUCKET)
            .upload(fileName, file.buffer, { 
                contentType: file.mimetype,
                upsert: true // Jar file pahilech asel tar overwrite karel
            });

        if (upErr) {
            console.error("Storage Error:", upErr);
            throw upErr;
        }

        // 2. Get Public URL
        const { data: urlData } = supabase.storage
            .from(process.env.CERTIFICATE_BUCKET)
            .getPublicUrl(fileName);

        // 3. Insert into Database
        // 'image' ani 'file_name' he columns table madhe asne garjeche aahe
        const { data: dbData, error: dbErr } = await supabase
            .from('certificates')
            .insert([{ image: urlData.publicUrl, file_name: fileName }])
            .select(); // Insert nantar data return karnyasaathi

        if (dbErr) {
            console.error("Database Insert Error:", dbErr);
            return res.status(400).json({ error: dbErr.message });
        }

        res.status(201).json(dbData);
    } catch (err) { 
        console.error("Global Error:", err);
        res.status(500).json({ error: err.message }); 
    }
};

exports.delete = async (req, res) => {
    try {
        const { data: cert, error: fetchErr } = await supabase
            .from('certificates')
            .select('file_name')
            .eq('id', req.params.id)
            .single();

        if (cert && cert.file_name) {
            await supabase.storage.from(process.env.CERTIFICATE_BUCKET).remove([cert.file_name]);
        }

        const { error: delErr } = await supabase.from('certificates').delete().eq('id', req.params.id);
        
        if (delErr) throw delErr;

        res.status(200).json({ message: "Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};