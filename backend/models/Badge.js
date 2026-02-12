const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Badge name is required'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Badge description is required'],
  },
  icon: {
    type: String,
    required: true, // URL or emoji
  },
  category: {
    type: String,
    enum: ['safety', 'equipment', 'service', 'speed', 'quality', 'social', 'milestone'],
    required: true,
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze',
  },
  criteria: {
    type: {
      type: String,
      enum: ['module-completion', 'points-milestone', 'quiz-score', 'streak', 'social-engagement', 'custom'],
      required: true,
    },
    value: mongoose.Schema.Types.Mixed, // Flexible for different criteria
    description: String,
  },
  pointsReward: {
    type: Number,
    default: 50,
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common',
  },
  // Statistics
  totalAwarded: {
    type: Number,
    default: 0,
  },
  awardedTo: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    awardedAt: {
      type: Date,
      default: Date.now,
    },
    tier: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Method to award badge to user
badgeSchema.methods.awardToUser = async function(userId, tier = 'bronze') {
  this.awardedTo.push({
    user: userId,
    tier: tier,
    awardedAt: new Date(),
  });
  this.totalAwarded += 1;
  await this.save();
  
  // Update user's badges
  const User = mongoose.model('User');
  await User.findByIdAndUpdate(userId, {
    $addToSet: { badges: this._id },
    $inc: { points: this.pointsReward },
  });
};

// Static method to check eligibility
badgeSchema.statics.checkEligibility = async function(userId, badgeId) {
  const badge = await this.findById(badgeId);
  if (!badge) return false;
  
  const User = mongoose.model('User');
  const user = await User.findById(userId);
  if (!user) return false;
  
  // Check if user already has this badge
  if (user.badges.includes(badgeId)) return false;
  
  // Check criteria based on badge type
  switch (badge.criteria.type) {
    case 'points-milestone':
      return user.points >= badge.criteria.value;
    
    case 'module-completion':
      return user.completedModules.length >= badge.criteria.value;
    
    case 'quiz-score':
      // Check if user has achieved required score
      const highScores = user.completedModules.filter(m => m.score >= badge.criteria.value);
      return highScores.length > 0;
    
    default:
      return false;
  }
};

const Badge = mongoose.model('Badge', badgeSchema);

module.exports = Badge;
