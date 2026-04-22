const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const notificationService = require('../services/notification');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'your_secret_key_here',
    { expiresIn: '7d' }
  );
};

// REGISTER
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Register request:', req.body.email);
    
    const { name, email, password, role, phone, nationality } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'Password must be at least 6 characters' 
      });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }
    
    // Create user
    const user = new User({
      name,
      email,
      password,
      role: role || 'tourist',
      phone: phone || '',
      nationality: nationality || ''
    });
    
    // Save user (password will be hashed automatically)
    await user.save();
    
    console.log('✅ User created:', user.email);
    console.log('   Password hash stored:', user.password.substring(0, 20) + '...');
    
    // Generate token
    const token = generateToken(user);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        nationality: user.nationality
      }
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Registration failed'
    });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login request:', req.body.email);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
    
    console.log('✅ User found:', user.email);
    console.log('   Stored hash:', user.password.substring(0, 20) + '...');
    
    // Compare password
    const isMatch = await user.comparePassword(password);
    console.log('   Password match:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
    
    console.log('✅ Login successful:', user.email);
    
    // Generate token
    const token = generateToken(user);
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        nationality: user.nationality
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Login failed'
    });
  }
});

// GET CURRENT USER
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'No token provided' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    res.json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        nationality: user.nationality
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ 
      success: false, 
      error: 'Invalid token' 
    });
  }
});

// TEST ROUTE
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Auth API is working!',
    time: new Date().toISOString()
  });
});

// CREATE ADMIN USER (Run once)
router.post('/create-admin', async (req, res) => {
  try {
    const adminExists = await User.findOne({ email: 'admin@arbaminch.com' });
    if (adminExists) {
      return res.json({ message: 'Admin already exists' });
    }
    
    const admin = new User({
      name: 'Admin',
      email: 'admin@arbaminch.com',
      password: 'admin123',
      role: 'admin',
      phone: '+251911111111',
      nationality: 'Ethiopian'
    });
    
    await admin.save();
    res.json({ success: true, message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL USERS (Admin only)
router.get('/users', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here');
    
    // Check if admin
    const admin = await User.findById(decoded.id);
    if (admin.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin only' });
    }
    
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Forgot Password - Request Reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal that user doesn't exist for security
      return res.json({ 
        success: true, 
        message: 'If your email is registered, you will receive a reset link' 
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Save to database
    await PasswordReset.create({
      email: user.email,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 3600000) // 1 hour
    });
    
    // Send reset email
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #15803d, #065f46); color: white; padding: 20px; text-align: center;">
          <h1>🔐 Reset Your Password</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hello ${user.name},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #15803d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This link expires in 1 hour.</p>
          <hr style="margin: 20px 0;" />
          <p style="font-size: 12px; color: #6b7280;">Arba Minch Tourist Assistance</p>
        </div>
      </div>
    `;
    
    // Send email if configured
    if (notificationService.transporter) {
      await notificationService.transporter.sendMail({
        from: `"Arba Minch Tourism" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Reset Your Password - Arba Minch Tourism',
        html: emailHtml
      });
      console.log('📧 Reset email sent to:', user.email);
    } else {
      console.log('📧 Reset link (email not configured):', resetUrl);
    }
    
    res.json({ 
      success: true, 
      message: 'If your email is registered, you will receive a reset link',
      devResetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Reset Password - Verify Token and Set New Password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Hash the token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Find valid reset request
    const resetRequest = await PasswordReset.findOne({
      token: hashedToken,
      used: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!resetRequest) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    
    // Find user and update password
    const user = await User.findOne({ email: resetRequest.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update password
    user.password = password;
    await user.save();
    
    // Mark token as used
    resetRequest.used = true;
    await resetRequest.save();
    
    // Send confirmation email
    if (notificationService.transporter) {
      await notificationService.transporter.sendMail({
        from: `"Arba Minch Tourism" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Password Reset Successful - Arba Minch Tourism',
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>Password Reset Successful!</h2>
            <p>Hello ${user.name},</p>
            <p>Your password has been successfully reset. You can now login with your new password.</p>
            <p>If you didn't make this change, please contact us immediately.</p>
          </div>
        `
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Password reset successful. You can now login with your new password.' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check if token is valid
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    const resetRequest = await PasswordReset.findOne({
      token: hashedToken,
      used: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!resetRequest) {
      return res.status(400).json({ valid: false, error: 'Invalid or expired token' });
    }
    
    res.json({ valid: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
