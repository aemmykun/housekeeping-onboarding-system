const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAllStaff,
    getStaffTasks,
    createShift,
    getShifts,
    deleteShift,
    getPerformance,
} = require('../controllers/staffController');

router.use(protect);
router.use(authorize('manager', 'front-desk'));

router.get('/', getAllStaff);
router.get('/shifts', getShifts);
router.get('/performance', getPerformance);
router.post('/shifts', authorize('manager'), createShift);
router.delete('/shifts/:id', authorize('manager'), deleteShift);
router.get('/:id/tasks', getStaffTasks);

module.exports = router;
