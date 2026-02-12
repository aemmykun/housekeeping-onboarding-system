const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

/**
 * Public/Optional Auth routes
 */
router.get('/', optionalAuth, moduleController.getAllModules);
router.get('/:id', optionalAuth, moduleController.getModuleById);

/**
 * Protected routes (require authentication)
 */
router.post('/:id/quiz', protect, moduleController.submitQuiz);
router.post('/:id/complete', protect, moduleController.completeModule);
router.get('/user/progress', protect, moduleController.getUserProgress);

/**
 * Admin/Supervisor routes
 */
router.post(
    '/',
    protect,
    authorize('admin', 'supervisor'),
    moduleController.createModule
);

router.put(
    '/:id',
    protect,
    authorize('admin', 'supervisor'),
    moduleController.updateModule
);

router.delete(
    '/:id',
    protect,
    authorize('admin'),
    moduleController.deleteModule
);

module.exports = router;
