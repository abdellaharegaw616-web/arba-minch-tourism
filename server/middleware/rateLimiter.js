const rateLimit = require('express-rate-limit');

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Booking rate limiter
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each user to 10 bookings per hour
  message: {
    success: false,
    error: 'Too many booking attempts. Please try again after 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? `user_${req.user.id}` : req.ip;
  },
});

// API rate limiter for external APIs
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 API requests per minute
  message: {
    success: false,
    error: 'API rate limit exceeded. Please try again after 1 minute.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// File upload rate limiter
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each user to 20 uploads per hour
  message: {
    success: false,
    error: 'Too many file uploads. Please try again after 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? `user_${req.user.id}` : req.ip;
  },
});

// Create custom rate limiter
const createCustomLimiter = (options) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    message: {
      success: false,
      error: options.message || 'Rate limit exceeded. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: options.keyGenerator || ((req) => req.ip),
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
  });
};

// Rate limiter for specific routes
const createRouteLimiter = (routeName, windowMs, max) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: `Rate limit exceeded for ${routeName}. Please try again later.`
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return req.user ? `${routeName}_user_${req.user.id}` : `${routeName}_${req.ip}`;
    },
  });
};

// Memory store for rate limiting (for development)
const memoryStore = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Maximum number of entries
  check: (options) => {
    const now = Date.now();
    const windowStart = now - (options.windowMs || 15 * 60 * 1000);
    
    return {
      totalHits: Object.keys(memoryStore.store).length,
      resetTime: windowStart + (options.windowMs || 15 * 60 * 1000)
    };
  },
  increment: (key) => {
    const now = Date.now();
    const record = memoryStore.store[key] || { count: 0, resetTime: now };
    
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + (15 * 60 * 1000);
    } else {
      record.count++;
    }
    
    memoryStore.store[key] = record;
    return record;
  },
  decrement: (key) => {
    const record = memoryStore.store[key];
    if (record && record.count > 0) {
      record.count--;
    }
  },
  resetKey: (key) => {
    delete memoryStore.store[key];
  },
  resetAll: () => {
    memoryStore.store = {};
  },
  store: {}
};

// Rate limiter with memory store (for development)
const memoryLimiter = createCustomLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP. Please try again after 15 minutes.',
  store: memoryStore
});

// Rate limiter status checker
const getRateLimitStatus = (req) => {
  const key = req.user ? `user_${req.user.id}` : req.ip;
  const record = memoryStore.store[key];
  
  if (record) {
    const now = Date.now();
    const remainingTime = Math.max(0, record.resetTime - now);
    const remainingRequests = Math.max(0, 100 - record.count);
    
    return {
      limit: 100,
      remaining: remainingRequests,
      resetTime: record.resetTime,
      remainingTime: remainingTime
    };
  }
  
  return {
    limit: 100,
    remaining: 100,
    resetTime: Date.now() + (15 * 60 * 1000),
    remainingTime: 15 * 60 * 1000
  };
};

module.exports = {
  generalLimiter,
  authLimiter,
  bookingLimiter,
  apiLimiter,
  uploadLimiter,
  createCustomLimiter,
  createRouteLimiter,
  memoryLimiter,
  getRateLimitStatus,
  memoryStore
};
