const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

// Set DNS servers to Google for MongoDB Atlas reliability
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✓ MongoDB connected to:', process.env.MONGODB_URI.split('@')[1]))
  .catch(err => {
    console.error('✗ MongoDB connection error:', err.message);
  });

// ── Routes ──────────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const moduleRoutes = require('./routes/modules');
const leaderboardRoutes = require('./routes/leaderboard');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const taskRoutes = require('./routes/tasks');
const staffRoutes = require('./routes/staff');

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'PMS API is running',
    timestamp: new Date().toISOString(),
  });
});

// Existing routes
app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// PMS routes
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/staff', staffRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🏨 Lean PMS — Room & Staff Management`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health`);
});

module.exports = app;
