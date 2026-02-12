const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const dotenv = require('dotenv');
const Badge = require('./models/Badge');

dotenv.config({ path: '../.env' });

const badges = [
    {
        name: 'Safe Hands',
        description: 'Completed the safety training module with a perfect score.',
        icon: '🛡️',
        category: 'safety',
        tier: 'bronze',
        pointsReward: 50,
        criteria: {
            type: 'quiz-score',
            value: 100,
            description: '100% on Safety Quiz'
        }
    },
    {
        name: 'Cleaning Pro',
        description: 'Completed 5 room cleaning modules.',
        icon: '🧹',
        category: 'quality',
        tier: 'silver',
        pointsReward: 100,
        criteria: {
            type: 'module-completion',
            value: 5,
            description: 'Complete 5 Modules'
        }
    },
    {
        name: 'Rising Star',
        description: 'Reached 200 activity points.',
        icon: '⭐',
        category: 'milestone',
        tier: 'gold',
        pointsReward: 200,
        criteria: {
            type: 'points-milestone',
            value: 200,
            description: 'Earn 200 Points'
        }
    },
    {
        name: 'Service Hero',
        description: 'Excellence in customer service training.',
        icon: '🏅',
        category: 'service',
        tier: 'platinum',
        pointsReward: 500,
        criteria: {
            type: 'custom',
            value: 'service-expert',
            description: 'Service Expert Status'
        }
    }
];

const seedBadges = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        // Clear existing badges
        await Badge.deleteMany();
        console.log('Deleted existing badges.');

        // Insert new badges
        await Badge.insertMany(badges);
        console.log('Successfully seeded badges!');

        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedBadges();
