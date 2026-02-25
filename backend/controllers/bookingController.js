const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Task = require('../models/Task');

/**
 * GET /api/bookings
 */
exports.getAllBookings = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};

        const bookings = await Booking.find(filter)
            .populate('roomId', 'roomNumber floor type')
            .populate('createdBy', 'firstName lastName')
            .sort({ checkIn: -1 });

        res.json({ success: true, count: bookings.length, bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET /api/bookings/today — departures and arriving today
 */
exports.getTodaySummary = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [arrivals, departures] = await Promise.all([
            Booking.find({ checkIn: { $gte: today, $lt: tomorrow }, status: 'confirmed' })
                .populate('roomId', 'roomNumber floor type'),
            Booking.find({ checkOut: { $gte: today, $lt: tomorrow }, status: 'checked-in' })
                .populate('roomId', 'roomNumber floor type'),
        ]);

        res.json({ success: true, arrivals, departures });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * POST /api/bookings — check-in / create booking
 * Body: { guestName, guestPhone, roomId, checkIn, checkOut, notes }
 */
exports.createBooking = async (req, res) => {
    try {
        const { guestName, guestPhone, roomId, checkIn, checkOut, notes } = req.body;

        // Check room exists and is available
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
        if (room.outOfOrder) return res.status(400).json({ success: false, message: 'Room is out of order' });
        if (room.status === 'occupied') return res.status(400).json({ success: false, message: 'Room is already occupied' });

        const booking = new Booking({
            guestName,
            guestPhone,
            roomId,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            status: 'checked-in',
            notes,
            createdBy: req.user.id,
            checkedInAt: new Date(),
        });

        await booking.save();

        // Mark room as occupied and link booking
        await Room.findByIdAndUpdate(roomId, {
            status: 'occupied',
            currentBookingId: booking._id,
        });

        const populated = await booking.populate('roomId', 'roomNumber floor type');
        res.status(201).json({ success: true, booking: populated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * PATCH /api/bookings/:id/checkout — check-out guest
 * Automatically marks room as dirty and creates a clean task
 */
exports.checkOut = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('roomId');
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
        if (booking.status !== 'checked-in') {
            return res.status(400).json({ success: false, message: 'Booking is not in checked-in state' });
        }

        // Update booking
        booking.status = 'checked-out';
        booking.checkedOutAt = new Date();
        await booking.save();

        // Mark room dirty and clear guest link
        await Room.findByIdAndUpdate(booking.roomId._id, {
            status: 'dirty',
            currentBookingId: null,
        });

        // Auto-create a clean task for the room
        await Task.create({
            roomId: booking.roomId._id,
            type: 'clean',
            status: 'pending',
            priority: 'normal',
            notes: `Check-out clean for ${booking.guestName}`,
            createdBy: req.user.id,
        });

        res.json({ success: true, message: 'Check-out complete. Clean task created.', booking });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * DELETE /api/bookings/:id — cancel booking (manager only)
 */
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

        booking.status = 'cancelled';
        await booking.save();

        // Free the room
        await Room.findByIdAndUpdate(booking.roomId, {
            status: 'available',
            currentBookingId: null,
        });

        res.json({ success: true, message: 'Booking cancelled' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
