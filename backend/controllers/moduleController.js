const Module = require('../models/Module');
const User = require('../models/User');

/**
 * Get all modules
 * GET /api/modules
 */
exports.getAllModules = async (req, res) => {
    try {
        const { category, difficulty, search } = req.query;

        // Build query
        let query = {};

        if (category) {
            query.category = category;
        }

        if (difficulty) {
            query.difficulty = difficulty;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const modules = await Module.find(query)
            .sort({ order: 1, createdAt: 1 })
            .select('-quiz.questions.correctAnswer'); // Don't send correct answers

        res.json({
            success: true,
            count: modules.length,
            modules,
        });
    } catch (error) {
        console.error('Get modules error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching modules',
            error: error.message,
        });
    }
};

/**
 * Get single module by ID
 * GET /api/modules/:id
 */
exports.getModuleById = async (req, res) => {
    try {
        const module = await Module.findById(req.params.id)
            .select('-quiz.questions.correctAnswer'); // Don't send correct answers

        if (!module) {
            return res.status(404).json({
                success: false,
                message: 'Module not found',
            });
        }

        // Check if user has completed this module
        let userProgress = null;
        if (req.user) {
            const user = await User.findById(req.user.id);
            const completed = user.completedModules.find(
                (cm) => cm.module.toString() === module._id.toString()
            );

            if (completed) {
                userProgress = {
                    completed: true,
                    completedAt: completed.completedAt,
                    score: completed.score,
                };
            }
        }

        res.json({
            success: true,
            module,
            userProgress,
        });
    } catch (error) {
        console.error('Get module error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching module',
            error: error.message,
        });
    }
};

/**
 * Create new module (Admin/Supervisor only)
 * POST /api/modules
 */
exports.createModule = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            difficulty,
            estimatedTime,
            content,
            videoUrl,
            resources,
            quiz,
            order,
        } = req.body;

        // Validate required fields
        if (!title || !description || !category || !content) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title, description, category, and content',
            });
        }

        const module = new Module({
            title,
            description,
            category,
            difficulty: difficulty || 'beginner',
            estimatedTime,
            content,
            videoUrl,
            resources,
            quiz,
            order,
            createdBy: req.user.id,
        });

        await module.save();

        res.status(201).json({
            success: true,
            message: 'Module created successfully',
            module,
        });
    } catch (error) {
        console.error('Create module error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating module',
            error: error.message,
        });
    }
};

/**
 * Update module (Admin/Supervisor only)
 * PUT /api/modules/:id
 */
exports.updateModule = async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);

        if (!module) {
            return res.status(404).json({
                success: false,
                message: 'Module not found',
            });
        }

        const {
            title,
            description,
            category,
            difficulty,
            estimatedTime,
            content,
            videoUrl,
            resources,
            quiz,
            order,
            isPublished,
        } = req.body;

        // Update fields
        if (title) module.title = title;
        if (description) module.description = description;
        if (category) module.category = category;
        if (difficulty) module.difficulty = difficulty;
        if (estimatedTime) module.estimatedTime = estimatedTime;
        if (content) module.content = content;
        if (videoUrl !== undefined) module.videoUrl = videoUrl;
        if (resources) module.resources = resources;
        if (quiz) module.quiz = quiz;
        if (order !== undefined) module.order = order;
        if (isPublished !== undefined) module.isPublished = isPublished;

        await module.save();

        res.json({
            success: true,
            message: 'Module updated successfully',
            module,
        });
    } catch (error) {
        console.error('Update module error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating module',
            error: error.message,
        });
    }
};

/**
 * Delete module (Admin only)
 * DELETE /api/modules/:id
 */
exports.deleteModule = async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);

        if (!module) {
            return res.status(404).json({
                success: false,
                message: 'Module not found',
            });
        }

        await module.deleteOne();

        res.json({
            success: true,
            message: 'Module deleted successfully',
        });
    } catch (error) {
        console.error('Delete module error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting module',
            error: error.message,
        });
    }
};

/**
 * Submit quiz answers
 * POST /api/modules/:id/quiz
 */
exports.submitQuiz = async (req, res) => {
    try {
        const { answers } = req.body; // Array of { questionId, selectedAnswer }

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide answers array',
            });
        }

        const module = await Module.findById(req.params.id);

        if (!module) {
            return res.status(404).json({
                success: false,
                message: 'Module not found',
            });
        }

        if (!module.quiz || !module.quiz.questions || module.quiz.questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'This module has no quiz',
            });
        }

        // Calculate score
        let correctAnswers = 0;
        const results = [];

        module.quiz.questions.forEach((question) => {
            const userAnswer = answers.find(
                (a) => a.questionId === question._id.toString()
            );

            const isCorrect = userAnswer && userAnswer.selectedAnswer === question.correctAnswer;

            if (isCorrect) {
                correctAnswers++;
            }

            results.push({
                questionId: question._id,
                question: question.question,
                userAnswer: userAnswer ? userAnswer.selectedAnswer : null,
                correctAnswer: question.correctAnswer,
                isCorrect,
                explanation: question.explanation,
            });
        });

        const totalQuestions = module.quiz.questions.length;
        const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
        const passed = scorePercentage >= (module.quiz.passingScore || 70);

        // Award points based on score
        const pointsEarned = passed ? module.points : Math.floor(module.points * 0.5);

        // Update user progress if passed
        const user = await User.findById(req.user.id);

        if (passed) {
            // Check if already completed
            const alreadyCompleted = user.completedModules.find(
                (cm) => cm.module.toString() === module._id.toString()
            );

            if (!alreadyCompleted) {
                user.completedModules.push({
                    module: module._id,
                    completedAt: new Date(),
                    score: scorePercentage,
                });

                user.points += pointsEarned;

                // Level up logic (every 100 points = 1 level)
                user.level = Math.floor(user.points / 100) + 1;

                await user.save();
            } else {
                // Update score if better
                if (scorePercentage > alreadyCompleted.score) {
                    alreadyCompleted.score = scorePercentage;
                    await user.save();
                }
            }
        }

        res.json({
            success: true,
            passed,
            score: scorePercentage,
            correctAnswers,
            totalQuestions,
            pointsEarned: passed ? pointsEarned : 0,
            results,
            message: passed
                ? `Congratulations! You passed with ${scorePercentage}%`
                : `You scored ${scorePercentage}%. Passing score is ${module.quiz.passingScore || 70}%`,
        });
    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting quiz',
            error: error.message,
        });
    }
};

/**
 * Mark module as completed (for modules without quiz)
 * POST /api/modules/:id/complete
 */
exports.completeModule = async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);

        if (!module) {
            return res.status(404).json({
                success: false,
                message: 'Module not found',
            });
        }

        const user = await User.findById(req.user.id);

        // Check if already completed
        const alreadyCompleted = user.completedModules.find(
            (cm) => cm.module.toString() === module._id.toString()
        );

        if (alreadyCompleted) {
            return res.json({
                success: true,
                message: 'Module already completed',
            });
        }

        // Add to completed modules
        user.completedModules.push({
            module: module._id,
            completedAt: new Date(),
            score: 100,
        });

        user.points += module.points;
        user.level = Math.floor(user.points / 100) + 1;

        await user.save();

        res.json({
            success: true,
            message: 'Module completed successfully',
            pointsEarned: module.points,
            totalPoints: user.points,
            level: user.level,
        });
    } catch (error) {
        console.error('Complete module error:', error);
        res.status(500).json({
            success: false,
            message: 'Error completing module',
            error: error.message,
        });
    }
};

/**
 * Get user's module progress
 * GET /api/modules/progress
 */
exports.getUserProgress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('completedModules.module');

        const totalModules = await Module.countDocuments({ isPublished: true });
        const completedCount = user.completedModules.length;
        const progressPercentage = totalModules > 0
            ? Math.round((completedCount / totalModules) * 100)
            : 0;

        res.json({
            success: true,
            progress: {
                totalModules,
                completedModules: completedCount,
                progressPercentage,
                completedList: user.completedModules,
                points: user.points,
                level: user.level,
            },
        });
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching progress',
            error: error.message,
        });
    }
};
