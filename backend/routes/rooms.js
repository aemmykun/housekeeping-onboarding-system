const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAllRooms,
    getRoom,
    createRoom,
    updateRoom,
    updateStatus,
    assignStaff,
    deleteRoom,
    seedRooms,
    getSummary,
} = require('../controllers/roomController');

// All room routes require authentication
router.use(protect);

router.get('/summary', getSummary);
router.post('/seed', authorize('manager'), seedRooms);

router.route('/')
    .get(getAllRooms)
    .post(authorize('manager'), createRoom);

router.route('/:id')
    .get(getRoom)
    .patch(authorize('manager'), updateRoom)
    .delete(authorize('manager'), deleteRoom);

router.patch('/:id/status', authorize('manager', 'front-desk'), updateStatus);
router.patch('/:id/assign', authorize('manager', 'front-desk'), assignStaff);

module.exports = router;
