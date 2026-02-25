const Task = require('../models/Task');
const Room = require('../models/Room');

/**
 * GET /api/tasks
 * Managers/front-desk see all tasks; housekeepers/maintenance see only their own
 */
exports.getAllTasks = async (req, res) => {
    try {
        const { status, date } = req.query;
        const filter = {};

        // Role-based filtering
        if (['housekeeper', 'maintenance'].includes(req.user.role)) {
            filter.assignedTo = req.user.id;
        }
        if (status) filter.status = status;

        // Date filter — defaults to today
        const targetDate = date ? new Date(date) : new Date();
        targetDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);
        filter.createdAt = { $gte: targetDate, $lt: nextDay };

        const tasks = await Task.find(filter)
            .populate('roomId', 'roomNumber floor type status')
            .populate('assignedTo', 'firstName lastName role')
            .populate('createdBy', 'firstName lastName')
            .sort({ priority: -1, createdAt: 1 }); // urgent first

        res.json({ success: true, count: tasks.length, tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * POST /api/tasks — manager, front-desk
 * Body: { roomId, assignedTo, type, priority, notes, dueDate }
 */
exports.createTask = async (req, res) => {
    try {
        const { roomId, assignedTo, type, priority, notes, dueDate } = req.body;

        // Check room exists
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

        const task = new Task({
            roomId,
            assignedTo: assignedTo || null,
            type: type || 'clean',
            priority: priority || 'normal',
            notes,
            dueDate: dueDate ? new Date(dueDate) : null,
            createdBy: req.user.id,
        });

        await task.save();

        // If assigning to a staff member, also update room.assignedStaff
        if (assignedTo) {
            await Room.findByIdAndUpdate(roomId, { assignedStaff: assignedTo });
        }

        const populated = await task
            .populate('roomId', 'roomNumber floor type')
            .then(t => t.populate('assignedTo', 'firstName lastName role'));

        res.status(201).json({ success: true, task: populated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

/**
 * PATCH /api/tasks/:id/complete — housekeeper, maintenance
 */
exports.completeTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        // Only the assigned staff or manager can complete
        const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user.id.toString();
        const isManager = ['manager', 'front-desk'].includes(req.user.role);
        if (!isAssigned && !isManager) {
            return res.status(403).json({ success: false, message: 'Not authorized to complete this task' });
        }

        task.status = 'done';
        task.completedAt = new Date();
        await task.save();

        // Auto-update room status based on task type
        if (task.type === 'clean') {
            await Room.findByIdAndUpdate(task.roomId, {
                status: 'clean',
                lastCleaned: new Date(),
                assignedStaff: null,
            });
        } else if (task.type === 'inspect') {
            await Room.findByIdAndUpdate(task.roomId, { status: 'available' });
        }

        const populated = await task
            .populate('roomId', 'roomNumber floor status')
            .then(t => t.populate('assignedTo', 'firstName lastName'));

        res.json({ success: true, task: populated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * PATCH /api/tasks/:id/start — housekeeper marks task in-progress
 */
exports.startTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status: 'in-progress', startedAt: new Date() },
            { new: true }
        ).populate('roomId', 'roomNumber');

        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        // Mark room as actively being cleaned
        if (task.type === 'clean') {
            await Room.findByIdAndUpdate(task.roomId, { status: 'cleaning' });
        }

        res.json({ success: true, task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * PATCH /api/tasks/:id/assign — manager reassigns task
 * Body: { staffId }
 */
exports.assignTask = async (req, res) => {
    try {
        const { staffId } = req.body;
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { assignedTo: staffId },
            { new: true }
        )
            .populate('assignedTo', 'firstName lastName role')
            .populate('roomId', 'roomNumber floor');

        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        res.json({ success: true, task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * DELETE /api/tasks/:id — manager only
 */
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json({ success: true, message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
