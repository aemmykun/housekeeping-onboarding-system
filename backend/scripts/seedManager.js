/**
 * Seed Manager Script
 * Usage: node scripts/seedManager.js
 *
 * Creates a manager user in MongoDB if one doesn't already exist.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const MANAGER = {
    firstName: 'Admin',
    lastName: 'Manager',
    email: process.env.SEED_MANAGER_EMAIL || 'manager@property.com',
    password: process.env.SEED_MANAGER_PASSWORD || 'Manager123!',
    role: 'manager',
};

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ MongoDB connected');

        const existing = await User.findOne({ email: MANAGER.email });
        if (existing) {
            console.log(`✓ Manager already exists: ${MANAGER.email}`);
            console.log(`  Role: ${existing.role}`);
            process.exit(0);
        }

        const user = await User.create(MANAGER);
        console.log('✓ Manager created successfully!');
        console.log(`  Email:    ${user.email}`);
        console.log(`  Password: ${MANAGER.password}`);
        console.log(`  Role:     ${user.role}`);
        console.log('\nYou can now log in at http://localhost:3000/login');
    } catch (err) {
        console.error('✗ Seed failed:', err.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
