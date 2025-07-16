const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to check token
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, 'jwt_secret_key');
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.post('/', authMiddleware, async (req, res) => {
  const { cart } = req.body;
  const userId = req.user.id;

  try {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [result] = await db.query("INSERT INTO orders (user_id, total_amount) VALUES (?, ?)", [userId, total]);
    const orderId = result.insertId;

    const itemPromises = cart.map(item => {
      return db.query("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.id, item.quantity, item.price]
      );
    });

    await Promise.all(itemPromises);

    res.json({ message: 'Order placed successfully', orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Order failed' });
  }
});

module.exports = router;
