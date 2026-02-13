const fs = require('fs');
const path = require('path');

// Storage location on C drive
const STORAGE_DIR = 'C:\\housekeeping-data';
const USERS_FILE = path.join(STORAGE_DIR, 'users.json');
const MODULES_FILE = path.join(STORAGE_DIR, 'modules.json');

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
    console.log(`✅ Created storage directory: ${STORAGE_DIR}`);
}

// File-based database with persistence
class FileDatabase {
    constructor() {
        this.users = new Map();
        this.modules = new Map();
        this.loadFromDisk();
    }

    // Load data from JSON files
    loadFromDisk() {
        try {
            // Load users
            if (fs.existsSync(USERS_FILE)) {
                const usersData = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
                usersData.forEach(user => {
                    this.users.set(user.email, user);
                });
                console.log(`📂 Loaded ${this.users.size} user(s) from disk`);
            }

            // Load modules
            if (fs.existsSync(MODULES_FILE)) {
                const modulesData = JSON.parse(fs.readFileSync(MODULES_FILE, 'utf8'));
                modulesData.forEach(module => {
                    this.modules.set(module.id, module);
                });
                console.log(`📂 Loaded ${this.modules.size} module(s) from disk`);
            }

            // If no data exists, initialize with sample data
            if (this.users.size === 0 && this.modules.size === 0) {
                this.initializeSampleData();
            }
        } catch (error) {
            console.error('❌ Error loading data from disk:', error.message);
            this.initializeSampleData();
        }
    }

    // Save data to JSON files
    saveToDisk() {
        try {
            // Save users
            const usersArray = Array.from(this.users.values());
            fs.writeFileSync(USERS_FILE, JSON.stringify(usersArray, null, 2));

            // Save modules
            const modulesArray = Array.from(this.modules.values());
            fs.writeFileSync(MODULES_FILE, JSON.stringify(modulesArray, null, 2));

            console.log('💾 Data saved to disk');
        } catch (error) {
            console.error('❌ Error saving data to disk:', error.message);
        }
    }

    // Initialize with sample data
    initializeSampleData() {
        console.log('🔧 Initializing with sample data...');

        // Sample user
        const sampleUser = {
            id: Date.now().toString(),
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@example.com',
            password: 'password123',
            role: 'trainee',
            department: 'Housekeeping',
            points: 250,
            level: 2,
            badges: ['first-login', 'quick-learner'],
            completedModules: [],
            isActive: true,
            createdAt: new Date().toISOString()
        };
        this.users.set(sampleUser.email, sampleUser);

        // Sample modules
        const sampleModules = [
            {
                id: '1',
                title: 'Introduction to Housekeeping',
                description: 'Learn the basics of professional housekeeping',
                category: 'basics',
                difficulty: 'beginner',
                estimatedTime: 30,
                points: 100,
                content: [],
                quiz: [],
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Room Cleaning Standards',
                description: 'Master the art of efficient room cleaning',
                category: 'cleaning',
                difficulty: 'intermediate',
                estimatedTime: 45,
                points: 150,
                content: [],
                quiz: [],
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                title: 'Safety Protocols',
                description: 'Essential safety guidelines for housekeeping staff',
                category: 'safety',
                difficulty: 'beginner',
                estimatedTime: 25,
                points: 100,
                content: [],
                quiz: [],
                createdAt: new Date().toISOString()
            }
        ];

        sampleModules.forEach(module => {
            this.modules.set(module.id, module);
        });

        // Save to disk
        this.saveToDisk();
        console.log('✅ Sample data initialized and saved to disk');
    }
}

// Create database instance
const fileDatabase = new FileDatabase();

// Mock User Model with file persistence
class User {
    constructor(data) {
        this.id = data.id || Date.now().toString();
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role || 'trainee';
        this.department = data.department;
        this.phone = data.phone;
        this.points = data.points || 0;
        this.level = data.level || 1;
        this.badges = data.badges || [];
        this.completedModules = data.completedModules || [];
        this.isActive = data.isActive !== false;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.lastLogin = data.lastLogin;
    }

    async save() {
        fileDatabase.users.set(this.email, this);
        fileDatabase.saveToDisk();
        return this;
    }

    static async findOne(query) {
        if (query.email) {
            const user = fileDatabase.users.get(query.email);
            return user ? new User(user) : null;
        }
        return null;
    }

    static async findById(id) {
        for (let userData of fileDatabase.users.values()) {
            if (userData.id === id) return new User(userData);
        }
        return null;
    }

    async comparePassword(candidatePassword) {
        return this.password === candidatePassword;
    }

    // Generate JWT token
    generateAuthToken() {
        const jwt = require('jsonwebtoken');
        return jwt.sign(
            { id: this.id, email: this.email, role: this.role },
            process.env.JWT_SECRET || 'default-secret-key',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
    }

    // Get public profile (without password)
    getPublicProfile() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            role: this.role,
            department: this.department,
            phone: this.phone,
            points: this.points,
            level: this.level,
            badges: this.badges,
            completedModules: this.completedModules,
            isActive: this.isActive,
            createdAt: this.createdAt,
            lastLogin: this.lastLogin
        };
    }
}

// Mock Module Model with file persistence
class Module {
    constructor(data) {
        this.id = data.id || Date.now().toString();
        this.title = data.title;
        this.description = data.description;
        this.category = data.category;
        this.difficulty = data.difficulty || 'beginner';
        this.estimatedTime = data.estimatedTime;
        this.points = data.points || 100;
        this.content = data.content || [];
        this.quiz = data.quiz || [];
        this.createdAt = data.createdAt || new Date().toISOString();
    }

    async save() {
        fileDatabase.modules.set(this.id, this);
        fileDatabase.saveToDisk();
        return this;
    }

    static async find() {
        return Array.from(fileDatabase.modules.values());
    }

    static async findById(id) {
        return fileDatabase.modules.get(id) || null;
    }
}

module.exports = {
    User,
    Module,
    fileDatabase
};
