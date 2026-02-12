const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Register a new user
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, department, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password,
            role: role || 'trainee',
            department: department || 'Housekeeping',
            phone,
        });

        await user.save();

        // Generate token
        const token = user.generateAuthToken();

        // Return user profile and token
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: user.getPublicProfile(),
        });
    } catch (error) {
        console.error('Registration error details:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user account',
            error: error.message,
            stack: error.stack
        });
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user and include password field
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact administrator.'
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = user.generateAuthToken();

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: user.getPublicProfile(),
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
exports.getProfile = async (req, res) => {
    try {
        // req.user is set by auth middleware
        const user = await User.findById(req.user.id)
            .populate('badges')
            .populate('mentorId', 'firstName lastName email profileImage');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: user.getPublicProfile(),
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, profileImage, emergencyContact } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update allowed fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;
        if (profileImage) user.profileImage = profileImage;
        if (emergencyContact) user.emergencyContact = emergencyContact;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: user.getPublicProfile(),
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

/**
 * Logout user (client-side token removal)
 * POST /api/auth/logout
 */
exports.logout = async (req, res) => {
    // With JWT, logout is handled client-side by removing the token
    // This endpoint is optional and can be used for logging/analytics
    res.json({
        success: true,
        message: 'Logout successful',
    });
};

/**
 * Google Login
 * POST /api/auth/google
 */
exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({
                success: false,
                message: 'No Google ID Token provided'
            });
        }

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { sub: googleId, email, given_name: firstName, family_name: lastName, picture: profileImage } = ticket.getPayload();

        // Check if user exists
        let user = await User.findOne({
            $or: [
                { googleId },
                { email: email.toLowerCase() }
            ]
        });

        if (user) {
            // Update existing user with googleId if not present
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // Create new user
            user = new User({
                firstName,
                lastName,
                email: email.toLowerCase(),
                googleId,
                profileImage,
                role: 'trainee',
                department: 'Housekeeping'
            });
            await user.save();
        }

        // Generate token
        const token = user.generateAuthToken();

        res.json({
            success: true,
            message: 'Google login successful',
            token,
            user: user.getPublicProfile(),
        });

    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error authenticating with Google',
            error: error.message
        });
    }
};
