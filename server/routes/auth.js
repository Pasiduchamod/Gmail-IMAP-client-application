const express = require('express');
const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Store credentials in session (encrypted in production)
    req.session.user = {
      email,
      password // In production, encrypt this
    };

    res.json({ 
      success: true, 
      message: 'Logged in successfully',
      email 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Check auth status
router.get('/status', (req, res) => {
  if (req.session.user) {
    res.json({ 
      authenticated: true, 
      email: req.session.user.email 
    });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
