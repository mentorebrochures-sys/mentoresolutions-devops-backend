const supabase = require('../supabaseClient');

// 1. सर्व कोर्सेस मिळवणे
exports.getAll = async (req, res) => {
    const { data, error } = await supabase.from('courses').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

// 2. नवीन कोर्स ॲड करणे (batch_time समाविष्ट केला आहे)
exports.create = async (req, res) => {
    // १. रिक्वेस्ट बॉडीमधून batch_time सुद्धा घ्या
    const { duration, start_date, batch_time } = req.body; 

    const { data, error } = await supabase
        .from('courses')
        .insert([{ duration, start_date, batch_time }]) // २. इथे batch_time ॲड करा
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
};

// 3. अपडेट करणे
exports.update = async (req, res) => {
    // update मध्ये req.body वापरल्यामुळे तिथे batch_time असेल तर तो आपोआप अपडेट होईल
    const { data, error } = await supabase
        .from('courses')
        .update(req.body)
        .eq('id', req.params.id)
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

// 4. डिलीट करणे
exports.delete = async (req, res) => {
    const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Course Deleted Successfully" });
};