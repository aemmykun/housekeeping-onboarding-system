const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        minlength: 6,
        select: false,
    },
    googleId: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        enum: ['manager', 'front-desk', 'housekeeper', 'maintenance', 'trainee', 'admin'],
        default: 'housekeeper',
    },
    department: {
        type: String,
        default: 'Housekeeping',
    },
    phone: {
        type: String,
        default: '',
    },
    profileImage: {
        type: String,
        default: '',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    // Legacy gamification fields (kept for backward compatibility)
    points: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 1,
    },
    badges: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge',
    }],
    completedModules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
    }],
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    emergencyContact: {
        name: String,
        phone: String,
        relationship: String,
    },
}, {
    timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { id: this._id, email: this.email, role: this.role },
        process.env.JWT_SECRET || 'default-secret-key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// Public profile — no password
userSchema.methods.getPublicProfile = function () {
    return {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        role: this.role,
        department: this.department,
        phone: this.phone,
        profileImage: this.profileImage,
        points: this.points,
        level: this.level,
        badges: this.badges,
        completedModules: this.completedModules,
        isActive: this.isActive,
        createdAt: this.createdAt,
        lastLogin: this.lastLogin,
    };
};

module.exports = mongoose.model('User', userSchema);
