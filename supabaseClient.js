const { createClient } = require('@supabase/supabase-js');
// dotenv इथून काढून टाका कारण server.js मध्ये ते आधीच लोड होतंय

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// कीज नसतील तर एरर थ्रो करा जेणेकरून Logs मध्ये समजेल
if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase Environment Variables on Vercel!");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;