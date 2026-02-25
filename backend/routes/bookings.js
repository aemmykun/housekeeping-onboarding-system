const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAllBookings,
    getTodaySummary,
    createBooking,
    checkOut,
    cancelBooking,
} = require('../controllers/bookingController');

router.use(protect);

router.get('/today', getTodaySummary);

router.route('/')
    .get(authorize('manager', 'front-desk'), getAllBookings)
    .post(authorize('manager', 'front-desk'), createBooking);

router.patch('/:id/checkout', authorize('manager', 'front-desk'), checkOut);
router.delete('/:id', authorize('manager'), cancelBooking);

module.exports = router;
