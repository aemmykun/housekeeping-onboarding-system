const User = require('../models/User');
const Shift = require('../models/Shift');
const Task = require('../models/Task');

/**
 * GET /api/staff — manager only
 * List all staff with their task counts for today
 */
exports.getAllStaff = async (req, res) => {
    try {
        const staff = await User.find({
            role: { $in: ['housekeeper', 'maintenance', 'front-desk', 'manager'] }
        }).select('-password').sort({ role: 1, firstName: 1 });

        // Get today's task counts per staff member
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const taskCounts = await Task.aggregate([
            { $match: { createdAt: { $gte: today, $lt: tomorrow } } },
            { $group: { _id: '$assignedTo', total: { $sum: 1 }, done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } } } }
        ]);

        const countMap = {};
        taskCounts.forEach(tc => { countMap[tc._id] = tc; });

        const staffWithStats = staff.map(s => ({
            ...s.toObject(),
            todayTasks: countMap[s._id] ? countMap[s._id].total : 0,
            doneTasks: countMap[s._id] ? countMap[s._id].done : 0,
        }));

        res.json({ success: true, count: staff.length, staff: staffWithStats });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET /api/staff/:id/tasks — manager sees tasks for a specific staff member
 */
exports.getStaffTasks = async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date ? new Date(date) : new Date();
        targetDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const tasks = await Task.find({
            assignedTo: req.params.id,
            createdAt: { $gte: targetDate, $lt: nextDay },
        })
            .populate('roomId', 'roomNumber floor type status')
            .sort({ priority: -1, createdAt: 1 });

        res.json({ success: true, tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * POST /api/staff/shifts — manager creates a shift
 * Body: { staffId, date, shiftType, startTime, endTime }
 */
exports.createShift = async (req, res) => {
    try {
        const { staffId, date, shiftType, startTime, endTime, notes } = req.body;

        const shift = await Shift.findOneAndUpdate(
            { staffId, date: new Date(date) },
            { shiftType, startTime, endTime, notes },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        const populated = await shift.populate('staffId', 'firstName lastName role');
        res.status(201).json({ success: true, shift: populated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * GET /api/staff/shifts — get shifts for a date range
 * Query: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
exports.getShifts = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const start = startDate ? new Date(startDate) : new Date();
        start.setHours(0, 0, 0, 0);
        const end = endDate ? new Date(endDate) : new Date(start);
        end.setDate(end.getDate() + 7); // default: 1 week

        const shifts = await Shift.find({
            date: { $gte: start, $lte: end },
        })
            .populate('staffId', 'firstName lastName role')
            .sort({ date: 1, shiftType: 1 });

        res.json({ success: true, shifts });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * DELETE /api/staff/shifts/:id — manager removes a shift
 */
exports.deleteShift = async (req, res) => {
    try {
        const shift = await Shift.findByIdAndDelete(req.params.id);
        if (!shift) return res.status(404).json({ success: false, message: 'Shift not found' });
        res.json({ success: true, message: 'Shift deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET /api/staff/performance — today's performance snapshot
 */
exports.getPerformance = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const stats = await Task.aggregate([
            { $match: { createdAt: { $gte: today, $lt: tomorrow }, assignedTo: { $ne: null } } },
            {
                $group: {
                    _id: '$assignedTo',
                    total: { $sum: 1 },
                    done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
                    avgTime: {
                        $avg: {
                            $cond: [
                                { $and: [{ $ne: ['$completedAt', null] }, { $ne: ['$startedAt', null] }] },
                                { $subtract: ['$completedAt', '$startedAt'] },
                                null,
                            ],
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'staff',
                },
            },
            { $unwind: '$staff' },
            {
                $project: {
                    _id: 0,
                    staffId: '$_id',
                    name: { $concat: ['$staff.firstName', ' ', '$staff.lastName'] },
                    role: '$staff.role',
                    total: 1,
                    done: 1,
                    avgMinutes: { $round: [{ $divide: ['$avgTime', 60000] }, 0] },
                },
            },
        ]);

        res.json({ success: true, stats });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
