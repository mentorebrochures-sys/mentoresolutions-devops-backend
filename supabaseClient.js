const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,             // must be full URL: https://your-project.supabase.co
  process.env.SUPABASE_SERVICE_ROLE_KEY // must be correct service role key
);

module.exports = supabase;
