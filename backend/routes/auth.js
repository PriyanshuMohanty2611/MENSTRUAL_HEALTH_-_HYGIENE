const express = require('express');
const router = express.Router();
const User = require('../models/Users');

// Real-time Login/Auto-Registration
router.post('/login', async (req, res) => {
  try {
    const { email, role } = req.body;
    
    // Find or create user to make it "Real"
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({
        name: email.split('@')[0],
        email,
        role: role || 'CUSTOMER',
        lunaCoins: 1250,
        lastLogin: new Date()
      });
      await user.save();
      console.log(`✓ New User Registered: ${email}`);
    } else {
      user.lastLogin = new Date();
      await user.save();
      console.log(`✓ User Logged In: ${email}`);
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lunaCoins: user.lunaCoins
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

module.exports = router;
