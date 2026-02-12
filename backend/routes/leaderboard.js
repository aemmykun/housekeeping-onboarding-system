const express = require('express');
const router = express.Router();
const {
    getLeaderboard,
    getBadges,
    getUserAchievements
} = require('../controllers/leaderboardController');
const { protect } = require('../middleware/auth');

router.get('/', getLeaderboard);
router.get('/badges', getBadges);
router.get('/achievements', protect, getUserAchievements);

module.exports = router;
