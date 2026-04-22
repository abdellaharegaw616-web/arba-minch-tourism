const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Sample data
const sampleUsers = [
  {
    name: 'John Tourist',
    email: 'john@demo.com',
    password: 'demo123',
    role: 'tourist',
    phone: '+251911000001',
    nationality: 'American'
  },
  {
    name: 'Sarah Guide',
    email: 'sarah@demo.com',
    password: 'demo123',
    role: 'guide',
    phone: '+251911000002',
    nationality: 'Ethiopian'
  },
  {
    name: 'Mike Visitor',
    email: 'mike@demo.com',
    password: 'demo123',
    role: 'tourist',
    phone: '+251911000003',
    nationality: 'British'
  },
  {
    name: 'Emma Explorer',
    email: 'emma@demo.com',
    password: 'demo123',
    role: 'tourist',
    phone: '+251911000004',
    nationality: 'Canadian'
  },
  {
    name: 'Ali Local Guide',
    email: 'ali@demo.com',
    password: 'demo123',
    role: 'guide',
    phone: '+251911000005',
    nationality: 'Ethiopian'
  }
];

const sampleBookings = [
  {
    user: null, // Will be set after creating users
    services: [
      { id: 1, name: 'Lake Chamo Boat Tour', price: 50 },
      { id: 2, name: 'Nech Sar National Park Safari', price: 80 }
    ],
    totalPrice: 130,
    status: 'confirmed',
    arrivalDate: '2024-12-15',
    arrivalTime: '10:00',
    departureDate: '2024-12-20',
    flightNumber: 'ET123',
    numberOfGuests: 2,
    hotelPreference: 'mid-range',
    specialRequests: 'Vegetarian meals please'
  },
  {
    user: null, // Will be set after creating users
    services: [
      { id: 3, name: 'Dorze Village Tour', price: 40 },
      { id: 4, name: 'Crocodile Ranch Visit', price: 30 }
    ],
    totalPrice: 70,
    status: 'pending',
    arrivalDate: '2024-12-18',
    arrivalTime: '14:00',
    departureDate: '2024-12-22',
    flightNumber: 'ET456',
    numberOfGuests: 1,
    hotelPreference: 'luxury',
    specialRequests: 'Airport pickup needed'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    console.log('🗑️ Cleared existing users');

    // Create Booking model (simplified version for seeding)
    const BookingSchema = new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      services: [{
        id: Number,
        name: String,
        price: Number
      }],
      totalPrice: Number,
      status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
      arrivalDate: String,
      arrivalTime: String,
      departureDate: String,
      flightNumber: String,
      numberOfGuests: Number,
      hotelPreference: String,
      specialRequests: String,
      createdAt: { type: Date, default: Date.now }
    });

    const Booking = mongoose.model('Booking', BookingSchema);
    await Booking.deleteMany({});
    console.log('🗑️ Cleared existing bookings');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@arbaminch.com',
      password: 'admin123',
      role: 'admin',
      phone: '+251911000000',
      nationality: 'Ethiopian'
    });
    await adminUser.save();
    console.log('✅ Admin user created');

    // Create sample users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name}`);
    }

    // Create sample bookings
    for (let i = 0; i < sampleBookings.length; i++) {
      const bookingData = { ...sampleBookings[i] };
      bookingData.user = createdUsers[i % createdUsers.length]; // Assign random users
      const booking = new Booking(bookingData);
      await booking.save();
      console.log(`✅ Created booking for ${createdUsers[i % createdUsers.length].name}`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@arbaminch.com / admin123');
    console.log('Tourist: john@demo.com / demo123');
    console.log('Guide: sarah@demo.com / demo123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding function
seedDatabase();
