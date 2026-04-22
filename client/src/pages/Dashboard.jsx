import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { bookingAPI } from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings();
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-green-800 to-emerald-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-green-200">Welcome back, {user?.name}!</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl mb-2">📅</div>
            <p className="text-gray-500 text-sm">Total Bookings</p>
            <p className="text-2xl font-bold">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl mb-2">✅</div>
            <p className="text-gray-500 text-sm">Confirmed</p>
            <p className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl mb-2">⏳</div>
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl mb-2">💰</div>
            <p className="text-gray-500 text-sm">Total Spent</p>
            <p className="text-2xl font-bold text-green-600">
              ${bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-3 font-semibold ${
                  activeTab === 'bookings'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600'
                }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 font-semibold ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-3 font-semibold ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600'
                }`}
              >
                Settings
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'bookings' && (
              <div>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No bookings yet</p>
                    <Link to="/booking" className="bg-green-600 text-white px-6 py-2 rounded-lg">
                      Book Your First Trip
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map(booking => (
                      <div key={booking._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-lg">
                              Booking #{booking._id.slice(-6)}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Arrival Date</p>
                            <p className="font-medium">
                              {booking.arrivalDate ? new Date(booking.arrivalDate).toLocaleDateString() : 'Not set'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Flight Number</p>
                            <p className="font-medium">{booking.flightNumber || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Services</p>
                            <p className="font-medium">{booking.services?.length || 0} services</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Price</p>
                            <p className="font-medium text-green-600">${booking.totalPrice}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex gap-3">
                          <button className="text-green-600 hover:text-green-700 text-sm">
                            View Details
                          </button>
                          {booking.status === 'pending' && (
                            <button className="text-red-600 hover:text-red-700 text-sm">
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-3xl text-white">
                    {user?.name?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{user?.name}</h2>
                    <p className="text-gray-500">{user?.email}</p>
                    <p className="text-gray-500">{user?.phone || 'No phone added'}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-500">Full Name</label>
                      <p className="font-medium">{user?.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">Email</label>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">Phone</label>
                      <p className="font-medium">{user?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">Nationality</label>
                      <p className="font-medium">{user?.nationality || 'Not provided'}</p>
                    </div>
                  </div>
                  <button className="mt-4 text-green-600 hover:text-green-700">
                    Edit Profile →
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h3 className="font-semibold mb-4">Notification Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span>Email Notifications</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-green-600" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span>SMS Notifications</span>
                    <input type="checkbox" className="w-5 h-5 text-green-600" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span>Promotional Emails</span>
                    <input type="checkbox" className="w-5 h-5 text-green-600" />
                  </label>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <h3 className="font-semibold mb-4">Change Password</h3>
                  <div className="space-y-3">
                    <input type="password" placeholder="Current Password" className="w-full p-2 border rounded" />
                    <input type="password" placeholder="New Password" className="w-full p-2 border rounded" />
                    <input type="password" placeholder="Confirm New Password" className="w-full p-2 border rounded" />
                    <button className="bg-green-600 text-white px-4 py-2 rounded">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
