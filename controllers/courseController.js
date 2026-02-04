const supabase = require('../supabaseClient');

// 1. Sagle courses milavne (Correct aahe)
exports.getAll = async (req, res) => {
    const { data, error } = await supabase.from('courses').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

// 2. Navin course add karne (Mi mashi sangitlyapramane update kela aahe)
exports.create = async (req, res) => {
    const { duration, start_date } = req.body; 
    const { data, error } = await supabase
        .from('courses')
        .insert([{ duration, start_date }])
        .select(); // Insert nantar data parat milavnyasathi .select() garjeche aahe

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
};

// 3. Update karne (Ithe .select() add kela aahe jyamule updated data return hoil)
exports.update = async (req, res) => {
    const { data, error } = await supabase
        .from('courses')
        .update(req.body)
        .eq('id', req.params.id)
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

// 4. Delete karne (Correct aahe)
exports.delete = async (req, res) => {
    const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Course Deleted Successfully" });
};