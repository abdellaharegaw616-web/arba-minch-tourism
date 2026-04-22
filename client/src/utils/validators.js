// Validation utilities for forms and data

export const validateBookingForm = (formData) => {
  const errors = {};

  // Personal Information Validation
  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }

  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.phone || !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!formData.nationality || formData.nationality.trim().length < 2) {
    errors.nationality = 'Nationality is required';
  }

  // Flight Details Validation
  if (!formData.arrivalDate) {
    errors.arrivalDate = 'Arrival date is required';
  }

  if (!formData.arrivalTime) {
    errors.arrivalTime = 'Arrival time is required';
  }

  if (!formData.flightNumber || formData.flightNumber.trim().length < 3) {
    errors.flightNumber = 'Flight number is required';
  }

  if (!formData.numberOfGuests || formData.numberOfGuests < 1) {
    errors.numberOfGuests = 'Number of guests must be at least 1';
  }

  if (formData.numberOfGuests > 20) {
    errors.numberOfGuests = 'Maximum 20 guests allowed';
  }

  // Date Validation
  if (formData.arrivalDate && formData.departureDate) {
    const arrival = new Date(formData.arrivalDate);
    const departure = new Date(formData.departureDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (arrival < today) {
      errors.arrivalDate = 'Arrival date cannot be in the past';
    }

    if (departure <= arrival) {
      errors.departureDate = 'Departure date must be after arrival date';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRegistrationForm = (formData) => {
  const errors = {};

  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }

  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.password || formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!formData.phone || !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!formData.nationality || formData.nationality.trim().length < 2) {
    errors.nationality = 'Nationality is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateLoginForm = (formData) => {
  const errors = {};

  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateServiceSelection = (selectedServices) => {
  const errors = {};

  if (!selectedServices || Object.keys(selectedServices).length === 0) {
    errors.services = 'Please select at least one service';
  }

  const hasSelectedService = Object.values(selectedServices).some(selected => selected);
  if (!hasSelectedService) {
    errors.services = 'Please select at least one service';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
