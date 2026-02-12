const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

// Set DNS servers to Google DNS to bypass local ISP DNS issues with MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✓ MongoDB connected successfully to:', process.env.MONGODB_URI.split('@')[1]))
  .catch(err => {
    console.error('✗ MongoDB connection error!');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    if (err.reason) console.error('Reason:', err.reason);
  });

// Routes
const authRoutes = require('./routes/auth');
const moduleRoutes = require('./routes/modules');
const leaderboardRoutes = require('./routes/leaderboard');

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Housekeeping Onboarding API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// TODO: Add more route imports here
// const badgeRoutes = require('./routes/badges');
// app.use('/api/badges', badgeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🏨 Housekeeping Onboarding System API`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
