import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import Translator from './pages/Translator';
import Admin from './pages/Admin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Services from './components/Services';
import ArbaMinchGallery from './components/ArbaMinchGallery';
import AIItinerary from './components/AIItinerary';
import ThreeDGallery from './components/ThreeDGallery';
import VirtualTour from './components/VirtualTour';
import LiveTracking from './components/LiveTracking';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/3d-gallery" element={<ThreeDGallery />} />
            <Route path="/virtual-tour" element={<VirtualTour />} />
            <Route path="/live-tracking" element={<LiveTracking />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/translator" element={<Translator />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/ai-itinerary" element={<AIItinerary />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
