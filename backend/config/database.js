const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        console.error('Error code:', error.code);

        // Provide helpful error messages
        if (error.code === 8000) {
            console.error('\n🔑 Authentication failed. Please check:');
            console.error('   1. Database username and password in .env');
            console.error('   2. User permissions in MongoDB Atlas');
            console.error('   3. Database name in connection string\n');
        } else if (error.name === 'MongoServerSelectionError') {
            console.error('\n🌐 Cannot reach MongoDB server. Please check:');
            console.error('   1. Network connection');
            console.error('   2. IP whitelist in MongoDB Atlas');
            console.error('   3. Connection string format\n');
        }

        process.exit(1);
    }
};

module.exports = connectDB;
