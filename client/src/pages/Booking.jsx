import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { services } from '../data/services';

const Booking = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    nationality: user?.nationality || '',
    arrivalDate: '',
    arrivalTime: '',
    departureDate: '',
    flightNumber: '',
    numberOfGuests: 1,
    hotelPreference: 'mid-range',
    specialRequests: ''
  });
  const [selectedServices, setSelectedServices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Toggle service selection
  const toggleService = (serviceId) => {
    setSelectedServices({
      ...selectedServices,
      [serviceId]: !selectedServices[serviceId]
    });
  };

  // Calculate total price
  const calculateTotal = () => {
    let total = 0;
    Object.keys(selectedServices).forEach(serviceId => {
      if (selectedServices[serviceId]) {
        const service = services.find(s => s.id === parseInt(serviceId));
        if (service) {
          total += service.price;
        }
      }
    });
    return total;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Get selected services list
    const selectedServicesList = Object.keys(selectedServices)
      .filter(key => selectedServices[key])
      .map(key => ({
        id: parseInt(key),
        name: services.find(s => s.id === parseInt(key))?.name,
        price: services.find(s => s.id === parseInt(key))?.price
      }));

    if (selectedServicesList.length === 0) {
      setError('Please select at least one service');
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        ...formData,
        services: selectedServicesList,
        totalPrice: calculateTotal(),
        status: 'pending'
      };

      const response = await axios.post('http://localhost:5000/api/bookings', bookingData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });

      if (response.data.success) {
        alert('✅ Booking confirmed! We will contact you within 24 hours.');
        navigate('/');
      } else {
        setError(response.data.error || 'Booking failed');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold mb-2">Please Login First</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to make a booking.</p>
          <Link to="/login" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 inline-block">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-800 to-blue-900 relative overflow-hidden py-12">

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Book Your Trip to Arba Minch</h1>
          
          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= s ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {s}
                </div>
                {s < 4 && <div className="w-16 h-1 bg-gray-300 mx-2"></div>}
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Full Name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">�</span>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📱</span>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="WhatsApp Number" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      required 
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🌍</span>
                    <input 
                      type="text" 
                      name="nationality" 
                      placeholder="Nationality" 
                      value={formData.nationality} 
                      onChange={handleChange} 
                      required 
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Flight Details */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Flight Details</h2>
                <div className="space-y-4">
                  <input 
                    type="date" 
                    name="arrivalDate" 
                    placeholder="Arrival Date" 
                    value={formData.arrivalDate} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-3 border rounded-lg"
                  />
                  <input 
                    type="time" 
                    name="arrivalTime" 
                    placeholder="Arrival Time" 
                    value={formData.arrivalTime} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-3 border rounded-lg"
                  />
                  <input 
                    type="text" 
                    name="flightNumber" 
                    placeholder="Flight Number" 
                    value={formData.flightNumber} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-3 border rounded-lg"
                  />
                  <input 
                    type="date" 
                    name="departureDate" 
                    placeholder="Departure Date" 
                    value={formData.departureDate} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-3 border rounded-lg"
                  />
                  <input 
                    type="number" 
                    name="numberOfGuests" 
                    placeholder="Number of Guests" 
                    value={formData.numberOfGuests} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Select Services */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Select Services</h2>
                <div className="space-y-3">
                  {services.map(service => (
                    <label key={service.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={selectedServices[service.id] || false} 
                          onChange={() => toggleService(service.id)} 
                          className="mr-3 w-5 h-5"
                        />
                        <div>
                          <span className="font-medium">{service.icon} {service.name}</span>
                          <p className="text-xs text-gray-500">{service.duration}</p>
                        </div>
                      </div>
                      <span className="text-green-600 font-semibold">${service.price}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-6">
                  <label className="block font-semibold mb-2">Hotel Preference</label>
                  <select 
                    name="hotelPreference" 
                    value={formData.hotelPreference} 
                    onChange={handleChange} 
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="luxury">Luxury (Paradise Lodge, Haile Resort)</option>
                    <option value="mid-range">Mid-Range (Swaynes Hotel, Emerald Resort)</option>
                    <option value="budget">Budget (Arba Minch Hotel, Tourist Hotel)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 4: Review & Confirm */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Review & Confirm</h2>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold mb-2">Personal Details</h3>
                  <p><strong>Name:</strong> {formData.name}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                  <p><strong>Nationality:</strong> {formData.nationality}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold mb-2">Flight Details</h3>
                  <p><strong>Arrival:</strong> {formData.arrivalDate} at {formData.arrivalTime}</p>
                  <p><strong>Flight:</strong> {formData.flightNumber}</p>
                  <p><strong>Guests:</strong> {formData.numberOfGuests}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold mb-2">Selected Services</h3>
                  {Object.keys(selectedServices).filter(k => selectedServices[k]).map(serviceId => {
                    const service = services.find(s => s.id === parseInt(serviceId));
                    return service ? (
                      <p key={serviceId}>✓ {service.icon} {service.name} - ${service.price}</p>
                    ) : null;
                  })}
                  <p className="mt-2 font-bold text-green-600">Total: ${calculateTotal()}</p>
                </div>

                <div className="mt-4">
                  <textarea 
                    name="specialRequests" 
                    placeholder="Special Requests (optional)" 
                    value={formData.specialRequests} 
                    onChange={handleChange} 
                    className="w-full p-3 border rounded-lg" 
                    rows="3"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={() => setStep(step - 1)} 
                  className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Back
                </button>
              )}
              {step < 4 ? (
                <button 
                  type="button" 
                  onClick={() => setStep(step + 1)} 
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ml-auto"
                >
                  Next
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ml-auto disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
