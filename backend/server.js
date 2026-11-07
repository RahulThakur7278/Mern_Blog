// ============================================
// FILE: server.js
// PURPOSE: Main entry point for the backend server.
// ============================================

// --------------------
// 1. IMPORTS
// --------------------
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet'); // <-- ADDED IMPORT
const rateLimit = require('express-rate-limit'); // <-- ADDED IMPORT

// Import route files
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/adminRoutes');

// --------------------
// 2. CREATE EXPRESS APP
// --------------------
const app = express();

// --------------------
// 3. MIDDLEWARE SETUP
// --------------------

// Security Headers (Helmet)
// crossOriginResourcePolicy is relaxed to allow your frontend to fetch images/assets if needed
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Rate Limiting
// 1. Global limiter (for general API requests)
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // Limit each IP to 100 requests per windowMs
  standardHeaders: true, 
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

// 2. Strict limiter (for Auth routes - prevents brute-force login attempts)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 login/register attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' },
});

// Apply global limiter to all requests
app.use(globalLimiter);

// --------------------
// 4. MOUNT ROUTES
// --------------------

// Auth routes — use the strict limiter here to stop brute-force attacks
app.use('/api/auth', authLimiter, authRoutes);

// Blog routes — prefix: /api/blog
app.use('/api/blog', blogRoutes);

// Admin routes — prefix: /api/admin
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'MERN Blog Backend is running!' });
});

// --------------------
// 5. GLOBAL ERROR HANDLER
// --------------------
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate value. This record already exists.' });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format.' });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token.' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired. Please login again.' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Server error. Please try again later.'
  });
});

// --------------------
// 6. CONNECT TO MONGODB AND START SERVER
// --------------------
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });