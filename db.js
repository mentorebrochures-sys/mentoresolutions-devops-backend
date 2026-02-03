// db.js
import pkg from "pg";
const { Pool } = pkg;

// Supabase PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // set in Vercel env vars
  ssl: { rejectUnauthorized: false },         // required for Vercel + Supabase
});

export default pool;
