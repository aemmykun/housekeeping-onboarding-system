const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Module title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Module description is required'],
  },
  category: {
    type: String,
    enum: ['safety', 'cleaning', 'equipment', 'guest-service', 'emergency', 'general'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  estimatedTime: {
    type: Number, // in minutes
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  content: [{
    type: {
      type: String,
      enum: ['text', 'video', 'image', 'ar', 'vr', 'interactive'],
      required: true,
    },
    title: String,
    content: String, // Text content or URL
    duration: Number, // for video content
    order: Number,
  }],
  learningObjectives: [String],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
  }],
  quiz: {
    questions: [{
      question: String,
      type: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'drag-drop', 'photo-challenge'],
      },
      options: [String],
      correctAnswer: mongoose.Schema.Types.Mixed,
      points: {
        type: Number,
        default: 10,
      },
      explanation: String,
    }],
    passingScore: {
      type: Number,
      default: 70,
    },
  },
  // Gamification
  pointsReward: {
    type: Number,
    default: 100,
  },
  badgeReward: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
  },
  // Statistics
  completionCount: {
    type: Number,
    default: 0,
  },
  averageScore: {
    type: Number,
    default: 0,
  },
  averageTime: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Index for searching and filtering
moduleSchema.index({ title: 'text', description: 'text' });
moduleSchema.index({ category: 1, difficulty: 1 });

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
