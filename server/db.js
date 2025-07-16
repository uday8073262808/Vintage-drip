// server/db.js
require('dotenv').config(); // ✅ this must be FIRST

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.getConnection()
  .then(() => console.log('✅ Connected to MySQL database'))
  .catch((err) => {
    console.error('❌ MySQL Connection Error:', err.message);
    process.exit(1);
  });

module.exports = pool;
