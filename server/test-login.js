const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Test creating a user with known password
    const testEmail = 'test123@example.com';
    const testPassword = 'test123';
    
    // Check if user exists, if not create
    let user = await User.findOne({ email: testEmail });
    
    if (!user) {
      console.log('📝 Creating test user...');
      user = new User({
        name: 'Test User',
        email: testEmail,
        password: testPassword,
        role: 'tourist'
      });
      await user.save();
      console.log('✅ Test user created\n');
    } else {
      console.log('✅ Test user already exists\n');
    }
    
    // Show stored password hash
    console.log('📊 Stored password hash:', user.password);
    console.log('📝 Plain text password:', testPassword);
    console.log('');
    
    // Test password comparison
    const isMatch = await bcrypt.compare(testPassword, user.password);
    console.log('🔐 Password match result:', isMatch);
    
    if (isMatch) {
      console.log('✅ Login would succeed!');
    } else {
      console.log('❌ Login would fail! Password mismatch');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testLogin();
