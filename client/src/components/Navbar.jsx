import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DarkModeToggle from './DarkModeToggle';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`sticky top-0 z-40 shadow-lg transition-colors duration-300 ${
      darkMode ? 'bg-dark-100' : 'bg-white'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between py-3 gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌴</span>
            <span className={`text-xl font-bold ${
              darkMode ? 'text-green-400' : 'text-green-700'
            }`}>Arba Minch Tours</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`${
              darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
            } transition`}>Home</Link>
            <Link to="/services" className={`${
              darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
            } transition`}>Services</Link>
            <Link to="/gallery" className={`${
              darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
            } transition`}>Gallery</Link>
            <Link to="/booking" className={`${
              darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
            } transition`}>Book Now</Link>
            <Link to="/translator" className={`${
              darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
            } transition`}>Chat</Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block w-80">
            <SearchBar />
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            <DarkModeToggle />
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {user?.role === 'admin' && (
                  <Link to="/admin" className={`${
                    darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
                  } transition text-sm`}>Admin</Link>
                )}
                <Link to="/dashboard" className={`${
                  darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
                } transition text-sm`}>
                  👤 {user?.name?.split(' ')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className={`${
                  darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
                } transition`}>Login</Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`md:hidden ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 border-t ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex flex-col space-y-3">
              <Link to="/" className={`${
                darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
              } transition`}>Home</Link>
              <Link to="/services" className={`${
                darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
              } transition`}>Services</Link>
              <Link to="/gallery" className={`${
                darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
              } transition`}>Gallery</Link>
              <Link to="/booking" className={`${
                darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
              } transition`}>Book Now</Link>
              <Link to="/translator" className={`${
                darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
              } transition`}>Chat</Link>
              
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className={`${
                      darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
                    } transition`}>Admin</Link>
                  )}
                  <span className={`${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Welcome, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={`${
                    darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
                  } transition`}>Login</Link>
                  <Link
                    to="/register"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
