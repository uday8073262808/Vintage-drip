const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../db');
require('dotenv').config();

console.log('[GOOGLE OAUTH] clientID:', process.env.GOOGLE_CLIENT_ID);
console.log('[GOOGLE OAUTH] clientSecret:', process.env.GOOGLE_CLIENT_SECRET ? '***' : 'MISSING');
console.log('[GOOGLE OAUTH] callbackURL:', process.env.GOOGLE_CALLBACK_URL);

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
  console.log('[GOOGLE PROFILE]', profile); // Add this line to debug
  try {
    const email = profile.emails[0].value;
    const name = profile.displayName;
    const avatar = profile.photos[0].value;
    const googleId = profile.id;

    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existing.length > 0) {
      return done(null, existing[0]);
    } else {
      const [result] = await pool.query(
        'INSERT INTO users (email, name, avatar, google_id) VALUES (?, ?, ?, ?)',
        [email, name, avatar, googleId]
      );
      const newUser = { id: result.insertId, email, name, avatar };
      return done(null, newUser);
    }
  } catch (err) {
    return done(err, null);
  }
}));

// Log the callback URL and code at runtime for debugging
const originalAuthenticate = passport.authenticate;
passport.authenticate = function(strategy, options, callback) {
  if (strategy === 'google' && options && options.callbackURL) {
    console.log('[GOOGLE OAUTH] Runtime callbackURL:', options.callbackURL);
  }
  return originalAuthenticate.apply(this, arguments);
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});
