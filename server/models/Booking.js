const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  services: [{
    type: {
      type: String,
      enum: ['airport_pickup', 'hotel_booking', 'city_tour', 'translation', 'custom_tour']
    },
    price: Number,
    details: Object
  }],
  flightDetails: {
    flightNumber: String,
    arrivalDate: Date,
    departureDate: Date,
    arrivalTime: String
  },
  hotelPreference: {
    type: String,
    enum: ['luxury', 'mid-range', 'budget'],
    default: 'mid-range'
  },
  numberOfGuests: {
    type: Number,
    default: 1
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  specialRequests: String,
  assignedGuide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
