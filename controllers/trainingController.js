const supabase = require('../supabaseClient');

// 1. Sagle Trainings milavne
exports.getAll = async (req, res) => {
    const { data, error } = await supabase
        .from('trainings')
        .select('*');
    
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

// 2. Navin Training (Icon Class sobat) add karne
exports.create = async (req, res) => {
    try {
        const { name, icon } = req.body; // Multer chi garaj nahi, direct body madhun data yeil

        if (!name || !icon) {
            return res.status(400).json({ error: "Name and Icon are required!" });
        }

        const { data, error } = await supabase
            .from('trainings')
            .insert([{ name, icon }])
            .select();

        if (error) return res.status(400).json({ error: error.message });
        
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Training Delete karne
exports.delete = async (req, res) => {
    const { error } = await supabase
        .from('trainings')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Deleted Successfully" });
};