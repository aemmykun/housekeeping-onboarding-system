const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock database connection for local development
console.log('🔧 Running in LOCAL DEVELOPMENT mode (no MongoDB required)');
console.log('📝 Using mock data for testing');

// Routes
const authRoutes = require('./routes/auth');
const moduleRoutes = require('./routes/modules');
const leaderboardRoutes = require('./routes/leaderboard');

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Housekeeping Onboarding API is running',
        mode: 'LOCAL_DEVELOPMENT',
        database: 'Mock Data (No MongoDB)',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🏨 Housekeeping Onboarding System API`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`\n⚠️  LOCAL MODE: No database connection required`);
    console.log(`✅ Ready for frontend development and testing!\n`);
});

module.exports = app;
