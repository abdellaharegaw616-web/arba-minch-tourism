import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0
  });

  // Fetch data when component mounts
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch bookings
      const bookingsRes = await axios.get('http://localhost:5000/api/bookings/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(bookingsRes.data.bookings || []);
      
      // Fetch users
      const usersRes = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(usersRes.data.users || []);
      
      // Calculate stats
      const allBookings = bookingsRes.data.bookings || [];
      setStats({
        totalUsers: usersRes.data.users?.length || 0,
        totalBookings: allBookings.length,
        pendingBookings: allBookings.filter(b => b.status === 'pending').length,
        totalRevenue: allBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  // Export data functions
  const exportToCSV = (data, filename) => {
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportBookings = () => {
    const bookingData = bookings.map(booking => ({
      'Date': new Date(booking.createdAt).toLocaleDateString(),
      'Customer': booking.user?.name || 'Guest',
      'Email': booking.user?.email || '',
      'Services': booking.services?.length || 0,
      'Total Price': `$${booking.totalPrice || 0}`,
      'Status': booking.status,
      'Phone': booking.user?.phone || '',
      'Nationality': booking.user?.nationality || ''
    }));
    
    exportToCSV(bookingData, `bookings_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportUsers = () => {
    const userData = users.map(user => ({
      'Name': user.name,
      'Email': user.email,
      'Role': user.role,
      'Phone': user.phone || '',
      'Nationality': user.nationality || '',
      'Joined Date': new Date(user.createdAt).toLocaleDateString()
    }));
    
    exportToCSV(userData, `users_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportAllData = () => {
    // Create a comprehensive export with all data
    const exportData = {
      'export_date': new Date().toISOString(),
      'stats': stats,
      'users': users.map(user => ({
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        nationality: user.nationality,
        joined: new Date(user.createdAt).toLocaleDateString()
      })),
      'bookings': bookings.map(booking => ({
        date: new Date(booking.createdAt).toLocaleDateString(),
        customer: booking.user?.name || 'Guest',
        email: booking.user?.email || '',
        services: booking.services?.length || 0,
        totalPrice: booking.totalPrice || 0,
        status: booking.status,
        phone: booking.user?.phone || '',
        nationality: booking.user?.nationality || ''
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `arba_minch_data_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <Link to="/" className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-green-800 to-emerald-800 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-green-200">Welcome back, {user?.name}!</p>
            </div>
            <Link to="/" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
              View Website
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex flex-wrap border-b">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'dashboard' 
                  ? 'border-b-2 border-green-600 text-green-600' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'bookings' 
                  ? 'border-b-2 border-green-600 text-green-600' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              📅 Bookings
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'users' 
                  ? 'border-b-2 border-green-600 text-green-600' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              👥 Users
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'settings' 
                  ? 'border-b-2 border-green-600 text-green-600' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalBookings}</p>
                  </div>
                  <div className="text-4xl">📅</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Pending Bookings</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</p>
                  </div>
                  <div className="text-4xl">⏳</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600">${stats.totalRevenue}</p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Recent Bookings</h2>
              </div>
              <div className="p-4">
                {bookings.slice(0, 5).map(booking => (
                  <div key={booking._id} className="flex justify-between items-center py-3 border-b last:border-0">
                    <div>
                      <p className="font-semibold">{booking.user?.name || 'Guest'}</p>
                      <p className="text-sm text-gray-500">{booking.services?.length || 0} services</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded text-xs text-white ${
                        booking.status === 'pending' ? 'bg-yellow-500' :
                        booking.status === 'confirmed' ? 'bg-green-500' :
                        booking.status === 'completed' ? 'bg-blue-500' : 'bg-red-500'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No bookings yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Services</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {bookings.map(booking => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{booking.user?.name}</p>
                        <p className="text-xs text-gray-500">{booking.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {booking.services?.length || 0} services
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        ${booking.totalPrice || 0}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                        No bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map(userItem => (
                    <tr key={userItem._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{userItem.name}</td>
                      <td className="px-4 py-3 text-sm">{userItem.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          userItem.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          userItem.role === 'guide' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {userItem.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{userItem.phone || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(userItem.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Admin Settings</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">Website Settings</h3>
                <p className="text-gray-600 text-sm">Manage website content and configurations</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">Service Prices</h3>
                <p className="text-gray-600 text-sm">Update service pricing</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">Gallery Management</h3>
                <p className="text-gray-600 text-sm">Add or remove gallery images</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Backup Database</h3>
                <p className="text-gray-600 text-sm mb-4">Export data for backup and analysis</p>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={exportBookings}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
                    disabled={bookings.length === 0}
                  >
                    📊 Export Bookings
                  </button>
                  <button 
                    onClick={exportUsers}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center gap-2"
                    disabled={users.length === 0}
                  >
                    👥 Export Users
                  </button>
                  <button 
                    onClick={exportAllData}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition flex items-center gap-2"
                    disabled={bookings.length === 0 && users.length === 0}
                  >
                    💾 Export All Data
                  </button>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  <p>• Bookings: CSV format with customer details and status</p>
                  <p>• Users: CSV format with user information</p>
                  <p>• All Data: JSON format with complete database backup</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
