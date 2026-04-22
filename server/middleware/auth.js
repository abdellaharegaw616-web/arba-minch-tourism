const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    // Check if token format is correct
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. Invalid token format.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here');
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. User not found.'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Authentication error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Access denied. Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Access denied. Token expired.'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error during authentication.'
    });
  }
};

// Admin role middleware
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. Authentication required.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Admin privileges required.'
    });
  }

  next();
};

// Guide role middleware
const requireGuide = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. Authentication required.'
    });
  }

  if (!['admin', 'guide'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Guide privileges required.'
    });
  }

  next();
};

// Tourist role middleware
const requireTourist = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. Authentication required.'
    });
  }

  if (!['admin', 'guide', 'tourist'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Invalid user role.'
    });
  }

  next();
};

// Optional authentication middleware
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here');
      const user = await User.findById(decoded.id).select('-password');
      
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional routes
    next();
  }
};

// Check if user owns the resource
const checkOwnership = (resourceField = 'user') => {
  return (req, res, next) => {
    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // For now, we'll handle this in individual controllers
    // This middleware can be extended for specific resource checks
    next();
  };
};

// Rate limiting middleware placeholder
const rateLimit = (windowMs, maxRequests, message) => {
  const requests = new Map();

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Clean old requests
    for (const [ip, requestData] of requests.entries()) {
      if (now - requestData.timestamp > windowMs) {
        requests.delete(ip);
      }
    }
    
    // Check current requests
    const requestData = requests.get(key) || { count: 0, timestamp: now };
    
    if (requestData.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: message || 'Too many requests. Please try again later.'
      });
    }
    
    // Update request count
    requests.set(key, {
      count: requestData.count + 1,
      timestamp: now
    });
    
    next();
  };
};

module.exports = {
  authenticate,
  requireAdmin,
  requireGuide,
  requireTourist,
  optionalAuth,
  checkOwnership,
  rateLimit
};
