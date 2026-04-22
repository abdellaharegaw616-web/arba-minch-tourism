// server/server.js - Complete working server with mock database
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import mock database (NO MongoDB!)
const db = require('./mockDatabase');

const app = express();

// CORS - Allow all origins for now (you can restrict later)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'unknown'}`);
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'arba_minch_tourism_secret_key_2024';

// ========== HEALTH CHECKS ==========
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Arba Minch Tourism API is LIVE!',
    mockMode: true,
    database: 'Mock Database (No MongoDB)',
    status: 'running',
    endpoints: {
      test: '/api/test',
      tours: '/api/tours',
      auth: '/api/auth/login, /api/auth/register',
      bookings: '/api/bookings'
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API test endpoint working!',
    mockMode: true,
    availableEndpoints: [
      'GET /',
      'GET /api/test',
      'GET /api/tours',
      'GET /api/tours/:id',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/bookings',
      'GET /api/bookings/:userId'
    ]
  });
});

// ========== AUTH ROUTES ==========
app.post('/api/auth/register', async (req, res) => {
  console.log('Register attempt:', req.body);
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email and password'
      });
    }

    // Check if user exists
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.createUser({
      name,
      email,
      password: hashedPassword
    });

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed: ' + error.message
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    // Find user
    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password (for demo accounts, accept known passwords)
    let validPassword = false;
    if (email === 'demo@example.com' && password === 'password123') {
      validPassword = true;
    } else if (email === 'admin@example.com' && password === 'admin123') {
      validPassword = true;
    } else {
      validPassword = await bcrypt.compare(password, user.password);
    }

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed: ' + error.message
    });
  }
});

// ========== TOUR ROUTES ==========
app.get('/api/tours', async (req, res) => {
  try {
    const tours = await db.getAllTours();
    res.json({
      success: true,
      count: tours.length,
      tours
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/tours/:id', async (req, res) => {
  try {
    const tour = await db.getTourById(req.params.id);
    if (!tour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }
    res.json({
      success: true,
      tour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/tours', async (req, res) => {
  try {
    const tour = await db.createTour(req.body);
    res.json({
      success: true,
      message: 'Tour created successfully',
      tour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ========== BOOKING ROUTES ==========
app.post('/api/bookings', async (req, res) => {
  try {
    const { userId, tourId, date, guests } = req.body;
    
    // Get tour details
    const tour = await db.getTourById(tourId);
    if (!tour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    const totalPrice = tour.price * guests;

    const booking = await db.createBooking({
      userId,
      tourId,
      tourName: tour.name,
      date,
      guests,
      totalPrice
    });

    res.json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/bookings/:userId', async (req, res) => {
  try {
    const bookings = await db.getUserBookings(req.params.userId);
    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ========== 404 HANDLER ==========
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      'GET /',
      'GET /api/test',
      'GET /api/tours',
      'GET /api/tours/:id',
      'POST /api/tours',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/bookings',
      'GET /api/bookings/:userId'
    ]
  });
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log('🚀 Server Running Successfully!');
  console.log('='.repeat(50));
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📝 Test API: http://localhost:${PORT}/api/test`);
  console.log(`🎭 Database Mode: MOCK DATABASE (No MongoDB)`);
  console.log(`✅ Status: FULLY FUNCTIONAL`);
  console.log('='.repeat(50));
  console.log('📋 Available Endpoints:');
  console.log('  - GET  /');
  console.log('  - GET  /api/test');
  console.log('  - GET  /api/tours');
  console.log('  - POST /api/auth/register');
  console.log('  - POST /api/auth/login');
  console.log('  - POST /api/bookings');
  console.log('='.repeat(50));
  console.log('🔐 Demo Credentials:');
  console.log('  Email: demo@example.com');
  console.log('  Password: password123');
  console.log('='.repeat(50));
});
