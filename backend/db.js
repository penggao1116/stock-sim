const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for cloud databases like Render
  },
});

// Function to execute the queries from queries.sql
const initializeDB = async () => {
  try {
    const queries = fs.readFileSync(path.join(__dirname, "queries.sql"), "utf8");
    await pool.query(queries);
    console.log("✅ Database tables created or already exist.");
  } catch (error) {
    console.error("❌ Database initialization error:", error);
  }
};

// Run database initialization
initializeDB();

module.exports = pool;
