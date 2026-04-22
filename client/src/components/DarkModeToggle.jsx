import React from 'react';
import { useTheme } from '../context/ThemeContext';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="relative inline-flex items-center justify-center w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none"
      style={{ backgroundColor: darkMode ? '#4ade80' : '#d1d5db' }}
    >
      <span
        className={`absolute left-1 inline-block w-5 h-5 transform rounded-full bg-white transition-transform duration-300 ${
          darkMode ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
      <span className="absolute left-1 text-xs">
        {darkMode ? '🌙' : '☀️'}
      </span>
    </button>
  );
};

export default DarkModeToggle;
