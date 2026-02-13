// Mock User Model for Local Development (No MongoDB)
class User {
    constructor(data) {
        this.id = data.id || Date.now().toString();
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.password = data.password; // In real app, this would be hashed
        this.role = data.role || 'trainee';
        this.department = data.department;
        this.phone = data.phone;
        this.points = data.points || 0;
        this.level = data.level || 1;
        this.badges = data.badges || [];
        this.completedModules = data.completedModules || [];
        this.isActive = data.isActive !== false;
        this.createdAt = data.createdAt || new Date();
        this.lastLogin = data.lastLogin;
    }

    // Mock save method
    async save() {
        mockDatabase.users.set(this.email, this);
        return this;
    }

    // Mock static methods
    static async findOne(query) {
        if (query.email) {
            return mockDatabase.users.get(query.email) || null;
        }
        return null;
    }

    static async findById(id) {
        for (let user of mockDatabase.users.values()) {
            if (user.id === id) return user;
        }
        return null;
    }

    // Mock password comparison
    async comparePassword(candidatePassword) {
        return this.password === candidatePassword;
    }
}

// Mock Module Model
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
        this.createdAt = data.createdAt || new Date();
    }

    async save() {
        mockDatabase.modules.set(this.id, this);
        return this;
    }

    static async find(query = {}) {
        return Array.from(mockDatabase.modules.values());
    }

    static async findById(id) {
        return mockDatabase.modules.get(id) || null;
    }
}

// Mock in-memory database
const mockDatabase = {
    users: new Map(),
    modules: new Map(),

    // Initialize with sample data
    init() {
        // Sample user
        const sampleUser = new User({
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@example.com',
            password: 'password123',
            role: 'trainee',
            department: 'Housekeeping',
            points: 250,
            level: 2,
            badges: ['first-login', 'quick-learner']
        });
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
                points: 100
            },
            {
                id: '2',
                title: 'Room Cleaning Standards',
                description: 'Master the art of efficient room cleaning',
                category: 'cleaning',
                difficulty: 'intermediate',
                estimatedTime: 45,
                points: 150
            },
            {
                id: '3',
                title: 'Safety Protocols',
                description: 'Essential safety guidelines for housekeeping staff',
                category: 'safety',
                difficulty: 'beginner',
                estimatedTime: 25,
                points: 100
            }
        ];

        sampleModules.forEach(data => {
            const module = new Module(data);
            this.modules.set(module.id, module);
        });

        console.log('✅ Mock database initialized with sample data');
        console.log(`   - ${this.users.size} sample user(s)`);
        console.log(`   - ${this.modules.size} sample module(s)`);
    }
};

// Initialize mock database
mockDatabase.init();

module.exports = {
    User,
    Module,
    mockDatabase
};
