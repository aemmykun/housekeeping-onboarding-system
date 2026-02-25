const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAllTasks,
    createTask,
    completeTask,
    startTask,
    assignTask,
    deleteTask,
} = require('../controllers/taskController');

router.use(protect);

router.route('/')
    .get(getAllTasks)
    .post(authorize('manager', 'front-desk'), createTask);

router.patch('/:id/start', startTask);
router.patch('/:id/complete', completeTask);
router.patch('/:id/assign', authorize('manager', 'front-desk'), assignTask);
router.delete('/:id', authorize('manager'), deleteTask);

module.exports = router;
