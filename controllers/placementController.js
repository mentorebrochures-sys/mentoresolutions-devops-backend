const supabase = require('../supabaseClient');

// ---------------------------------------------------------
// 1. GET ALL PLACEMENTS (Read)
// ---------------------------------------------------------
exports.getAll = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('placements')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------------------------------------------------
// 2. CREATE PLACEMENT (Create)
// ---------------------------------------------------------
exports.create = async (req, res) => {
    try {
        const { name, role, company, pkg } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: "Student image is required" });
        }

        const bucketName = 'placement-images'; // Supabase Bucket Name
        const fileName = `student_${Date.now()}_${req.file.originalname}`;

        // Step 1: Upload image to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: true
            });

        if (uploadError) throw uploadError;

        // Step 2: Get Public URL of the uploaded image
        const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        const imageUrl = urlData.publicUrl;

        // Step 3: Insert data into Database Table
        const { data, error: dbError } = await supabase
            .from('placements')
            .insert([{ name, role, company, pkg, image: imageUrl }])
            .select();

        if (dbError) throw dbError;
        res.status(201).json({ message: "Placement added!", data: data[0] });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------------------------------------------------
// 3. UPDATE PLACEMENT (Update)
// ---------------------------------------------------------
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, company, pkg } = req.body;
        let imageUrl = req.body.image; // Juni image URL (jar navin upload nahi keli tar)

        // Jar navin image file aali asel tar
        if (req.file) {
            const bucketName = 'placement-images';
            const fileName = `student_${Date.now()}_${req.file.originalname}`;

            const { error: upErr } = await supabase.storage
                .from(bucketName)
                .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

            if (upErr) throw upErr;

            const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
            imageUrl = urlData.publicUrl;
        }

        // Database update karne
        const { data, error } = await supabase
            .from('placements')
            .update({ name, role, company, pkg, image: imageUrl })
            .eq('id', id)
            .select();

        if (error) throw error;
        res.status(200).json({ message: "Updated successfully", data: data[0] });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ---------------------------------------------------------
// 4. DELETE PLACEMENT (Delete)
// ---------------------------------------------------------
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const bucketName = 'placement-images';

        // Step 1: Database madhun image chi URL kadha (Storage madhun file delete karnyathi)
        const { data: record } = await supabase
            .from('placements')
            .select('image')
            .eq('id', id)
            .single();

        if (record && record.image) {
            const fileName = record.image.split('/').pop();
            await supabase.storage.from(bucketName).remove([fileName]);
        }

        // Step 2: Database madhun row delete kara
        const { error } = await supabase
            .from('placements')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.status(200).json({ message: "Placement deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};