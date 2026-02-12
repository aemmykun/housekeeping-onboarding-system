const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const testConn = async () => {
    console.log('Testing connection to:', process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@'));
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('SUCCESS: Connected to MongoDB!');
        process.exit(0);
    } catch (err) {
        console.error('ERROR: Could not connect to MongoDB');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        process.exit(1);
    }
};

testConn();
