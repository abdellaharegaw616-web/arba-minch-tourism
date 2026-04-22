const Booking = require('../models/Booking');
const User = require('../models/User');
const { services } = require('../../client/src/data/services');

// Create new booking
const createBooking = async (req, res) => {
  try {
    console.log('📅 Creating booking for user:', req.user.email);

    const {
      name,
      email,
      phone,
      nationality,
      arrivalDate,
      arrivalTime,
      departureDate,
      flightNumber,
      numberOfGuests,
      hotelPreference,
      specialRequests,
      services: selectedServices,
      totalPrice
    } = req.body;

    // Validate required fields
    if (!selectedServices || selectedServices.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please select at least one service'
      });
    }

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      name,
      email,
      phone,
      nationality,
      arrivalDate,
      arrivalTime,
      departureDate,
      flightNumber,
      numberOfGuests,
      hotelPreference,
      specialRequests,
      services: selectedServices,
      totalPrice,
      status: 'pending',
      bookingReference: generateBookingReference()
    });

    await booking.save();

    // Populate user data for response
    await booking.populate('user', 'name email phone');

    console.log('✅ Booking created successfully:', booking.bookingReference);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('❌ Create booking error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all bookings (admin only)
const getAllBookings = async (req, res) => {
  try {
    // Check if user is admin
    const requestingUser = await User.findById(req.user.id);
    if (requestingUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('❌ Get all bookings error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('❌ Get user bookings error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user owns the booking or is admin
    const requestingUser = await User.findById(req.user.id);
    if (booking.user._id.toString() !== req.user.id && requestingUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('❌ Get booking error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Update status
    booking.status = status;
    booking.updatedAt = new Date();
    await booking.save();

    console.log(`📅 Booking ${booking.bookingReference} status updated to: ${status}`);

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('❌ Update booking status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel completed booking'
      });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    await booking.save();

    console.log(`❌ Booking ${booking.bookingReference} cancelled`);

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('❌ Cancel booking error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get booking statistics
const getBookingStats = async (req, res) => {
  try {
    // Check if user is admin
    const requestingUser = await User.findById(req.user.id);
    if (requestingUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const stats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      stats: {
        totalBookings,
        totalUsers,
        pendingBookings,
        statusBreakdown: stats,
        totalRevenue: stats.reduce((sum, stat) => sum + (stat.totalRevenue || 0), 0)
      }
    });
  } catch (error) {
    console.error('❌ Get booking stats error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Generate booking reference
const generateBookingReference = () => {
  const prefix = 'AMT';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

module.exports = {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getBookingStats
};
