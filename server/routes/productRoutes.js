const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Route: GET /api/products/search?q=...
router.get('/search', (req, res) => {
  const q = req.query.q || '';
  const sql = 'SELECT * FROM products WHERE name LIKE ?';
  db.query(sql, [`%${q}%`], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// ✅ Route: GET /api/products (to fetch all products by default)
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

module.exports = router;
