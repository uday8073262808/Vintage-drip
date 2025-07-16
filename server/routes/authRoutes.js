// server/routes/authRoutes.js
require('dotenv').config(); // ✅ FIRST LINE
console.log('[ENV CHECK] JWT_SECRET:', process.env.JWT_SECRET);

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
const pool = require('../db');
const router = express.Router();

// 🔐 Generate JWT Token
const generateToken = (user) => {
  console.log('[DEBUG] JWT_SECRET:', process.env.JWT_SECRET); // ✅ DEBUG LINE
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '3d' }
  );
};

// 📝 Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ message: 'User already exists' });

    await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashed]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔓 Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('[LOGIN] Incoming:', { email });

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      userId: user.id,
      email: user.email,
    });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔗 Google OAuth Initiation
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// 🔁 Google OAuth Callback
router.get('/google/callback', 
  (req, res, next) => {
    console.log('🔁 Google callback query:', req.query);
    next();
  }, 
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    const token = generateToken(req.user);
    // Use client URL from env or fallback
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    res.redirect(`${clientUrl}?token=${token}`);
  }
);


// ✅ Export router LAST
module.exports = router;
