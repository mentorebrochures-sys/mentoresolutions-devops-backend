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
        const fileName = `${Date.now()}_${file.originalname}`;

        // 1. Upload to Storage
        const { error: upErr } = await supabase.storage
            .from(process.env.CERTIFICATE_BUCKET)
            .upload(fileName, file.buffer, { contentType: file.mimetype });

        if (upErr) throw upErr;

        // 2. Get Public URL
        const { data: urlData } = supabase.storage
            .from(process.env.CERTIFICATE_BUCKET)
            .getPublicUrl(fileName);

        // 3. Insert into Database
        const { data, error } = await supabase
            .from('certificates')
            .insert([{ image: urlData.publicUrl, file_name: fileName }]); // fileName pan save kara delete sathi

        res.status(201).json(error ? { error: error.message } : data);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};

exports.delete = async (req, res) => {
    try {
        // Optional: Pahile database madhun file_name milva jyaamule storage madhun delete karta yeil
        const { data: cert } = await supabase.from('certificates').select('file_name').eq('id', req.params.id).single();

        if (cert && cert.file_name) {
            await supabase.storage.from(process.env.CERTIFICATE_BUCKET).remove([cert.file_name]);
        }

        const { error } = await supabase.from('certificates').delete().eq('id', req.params.id);
        
        res.status(200).json(error ? { error: error.message } : { message: "Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};