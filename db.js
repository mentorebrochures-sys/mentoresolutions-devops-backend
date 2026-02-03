// db.js
const mysql = require("mysql2");

let pool;

// Create pool once (serverless-safe)
if (!pool) {
  pool = mysql.createPool({
    uri: process.env.DATABASE_URL, // Railway MySQL connection URL
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }).promise();
}

// Optional: connection test ONLY in development
if (process.env.NODE_ENV !== "production") {
  pool
    .getConnection()
    .then((connection) => {
      console.log("✅ Railway MySQL Connected");
      connection.release();
    })
    .catch((err) => {
      console.error("❌ DB Connection Failed:", err.message);
    });
}

module.exports = pool;
