const Room = require('../models/Room');
const Task = require('../models/Task');
const Booking = require('../models/Booking');

/**
 * GET /api/rooms
 * All rooms with populated staff
 */
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find()
            .populate('assignedStaff', 'firstName lastName role')
            .populate('currentBookingId', 'guestName checkIn checkOut')
            .sort({ floor: 1, roomNumber: 1 });

        res.json({ success: true, count: rooms.length, rooms });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET /api/rooms/:id
 */
exports.getRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id)
            .populate('assignedStaff', 'firstName lastName role phone')
            .populate('currentBookingId', 'guestName guestPhone checkIn checkOut status');

        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

        res.json({ success: true, room });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * POST /api/rooms — manager only
 */
exports.createRoom = async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
        res.status(201).json({ success: true, room });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: `Room ${req.body.roomNumber} already exists` });
        }
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * PATCH /api/rooms/:id/status — front-desk, manager
 * Body: { status }
 */
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['available', 'occupied', 'dirty', 'cleaning', 'clean', 'maintenance', 'dnd'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }

        const update = { status };
        if (status === 'clean') update.lastCleaned = new Date();

        const room = await Room.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true, runValidators: true }
        ).populate('assignedStaff', 'firstName lastName');

        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

        res.json({ success: true, room });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * PATCH /api/rooms/:id/assign — manager, front-desk
 * Body: { staffId }
 */
exports.assignStaff = async (req, res) => {
    try {
        const { staffId } = req.body;
        const room = await Room.findByIdAndUpdate(
            req.params.id,
            { assignedStaff: staffId || null },
            { new: true }
        ).populate('assignedStaff', 'firstName lastName role');

        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

        res.json({ success: true, room });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * PATCH /api/rooms/:id — general update (manager only)
 */
exports.updateRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
        res.json({ success: true, room });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * DELETE /api/rooms/:id — manager only
 */
exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
        res.json({ success: true, message: 'Room deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * POST /api/rooms/seed — creates sample rooms, manager only
 */
exports.seedRooms = async (req, res) => {
    try {
        const count = await Room.countDocuments();
        if (count > 0) {
            return res.json({ success: false, message: `${count} rooms already exist. Delete them first.` });
        }

        const sampleRooms = [];
        const types = ['single', 'double', 'double', 'twin', 'suite'];
        for (let floor = 1; floor <= 3; floor++) {
            for (let num = 1; num <= 8; num++) {
                const roomNumber = `${floor}0${num}`;
                sampleRooms.push({
                    roomNumber,
                    floor,
                    type: types[num % types.length],
                    status: 'available',
                    maxOccupancy: num % types.length === 4 ? 4 : 2,
                });
            }
        }

        const rooms = await Room.insertMany(sampleRooms);
        res.status(201).json({ success: true, message: `Created ${rooms.length} rooms`, rooms });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET /api/rooms/summary — dashboard summary stats
 */
exports.getSummary = async (req, res) => {
    try {
        const all = await Room.find();
        const summary = {
            total: all.length,
            available: all.filter(r => r.status === 'available').length,
            occupied: all.filter(r => r.status === 'occupied').length,
            dirty: all.filter(r => r.status === 'dirty').length,
            cleaning: all.filter(r => r.status === 'cleaning').length,
            maintenance: all.filter(r => r.status === 'maintenance').length,
            outOfOrder: all.filter(r => r.outOfOrder).length,
        };
        summary.occupancyPercent = summary.total
            ? Math.round((summary.occupied / summary.total) * 100)
            : 0;

        res.json({ success: true, summary });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
