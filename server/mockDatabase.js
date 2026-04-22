// server/mockDatabase.js - Complete working mock database
class MockDatabase {
  constructor() {
    // Initialize with sample data
    this.users = [
      {
        _id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        password: '$2b$10$YourHashedPasswordHere', // "password123"
        role: 'user',
        createdAt: new Date('2024-01-01')
      },
      {
        _id: '2',
        name: 'Admin User',
        email: 'admin@example.com',
        password: '$2b$10$YourHashedPasswordHere', // "admin123"
        role: 'admin',
        createdAt: new Date('2024-01-01')
      }
    ];

    this.tours = [
      {
        _id: '1',
        name: 'Lake Chamo Boat Tour',
        description: 'Beautiful boat tour on Lake Chamo seeing crocodiles and hippos',
        price: 1500,
        duration: '3 hours',
        location: 'Lake Chamo',
        available: true,
        images: ['https://via.placeholder.com/400x300'],
        createdAt: new Date()
      },
      {
        _id: '2',
        name: 'Nech Sar National Park Safari',
        description: 'Full day wildlife safari in Nech Sar National Park',
        price: 2500,
        duration: 'Full day',
        location: 'Nech Sar',
        available: true,
        images: ['https://via.placeholder.com/400x300'],
        createdAt: new Date()
      },
      {
        _id: '3',
        name: 'Bridge of God (40 Springs)',
        description: 'Visit the famous 40 Springs Bridge',
        price: 800,
        duration: '2 hours',
        location: 'Arba Minch',
        available: true,
        images: ['https://via.placeholder.com/400x300'],
        createdAt: new Date()
      },
      {
        _id: '4',
        name: 'Dorze Village Tour',
        description: 'Cultural tour to Dorze village to see traditional bamboo houses',
        price: 1200,
        duration: '4 hours',
        location: 'Dorze Village',
        available: true,
        images: ['https://via.placeholder.com/400x300'],
        createdAt: new Date()
      }
    ];

    this.bookings = [];
    this.nextId = 5;
  }

  // User methods
  async findUserByEmail(email) {
    return this.users.find(u => u.email === email) || null;
  }

  async findUserById(id) {
    return this.users.find(u => u._id === id) || null;
  }

  async createUser(userData) {
    const newUser = {
      _id: String(this.nextId++),
      ...userData,
      role: 'user',
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  // Tour methods
  async getAllTours() {
    return this.tours;
  }

  async getTourById(id) {
    return this.tours.find(t => t._id === id) || null;
  }

  async createTour(tourData) {
    const newTour = {
      _id: String(this.nextId++),
      ...tourData,
      available: true,
      createdAt: new Date()
    };
    this.tours.push(newTour);
    return newTour;
  }

  // Booking methods
  async createBooking(bookingData) {
    const newBooking = {
      _id: String(this.nextId++),
      ...bookingData,
      status: 'pending',
      createdAt: new Date()
    };
    this.bookings.push(newBooking);
    return newBooking;
  }

  async getUserBookings(userId) {
    return this.bookings.filter(b => b.userId === userId);
  }

  async getAllBookings() {
    return this.bookings;
  }

  async updateBookingStatus(bookingId, status) {
    const booking = this.bookings.find(b => b._id === bookingId);
    if (booking) {
      booking.status = status;
      return booking;
    }
    return null;
  }
}

module.exports = new MockDatabase();
