const User = require('../models/User');
const Badge = require('../models/Badge');

// @desc    Get top users by points
// @route   GET /api/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
    try {
        const timeframe = req.query.timeframe || 'all-time';
        let query = {};

        // In a real app, you might filter by weekly/monthly points
        // For now, we'll just return all-time points

        const topUsers = await User.find(query)
            .select('firstName lastName points level profileImage department')
            .sort({ points: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            count: topUsers.length,
            leaderboard: topUsers
        });
    } catch (err) {
        console.error('Leaderboard fetch error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get all available badges
// @route   GET /api/leaderboard/badges
// @access  Public
exports.getBadges = async (req, res) => {
    try {
        const badges = await Badge.find({ isActive: true });
        res.status(200).json({
            success: true,
            badges
        });
    } catch (err) {
        console.error('Badges fetch error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get user's detailed achievements
// @route   GET /api/leaderboard/achievements
// @access  Private
exports.getUserAchievements = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('badges')
            .select('points level badges completedModules');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            achievements: {
                points: user.points,
                level: user.level,
                badges: user.badges,
                stats: {
                    modulesCompleted: user.completedModules.length,
                    avgQuizScore: user.completedModules.reduce((acc, m) => acc + (m.score || 0), 0) / (user.completedModules.length || 1)
                }
            }
        });
    } catch (err) {
        console.error('Achievements fetch error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
