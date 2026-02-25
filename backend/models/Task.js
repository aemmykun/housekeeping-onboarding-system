const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    type: {
        type: String,
        enum: ['clean', 'inspect', 'maintenance', 'restock', 'turndown'],
        default: 'clean',
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'done'],
        default: 'pending',
    },
    priority: {
        type: String,
        enum: ['low', 'normal', 'urgent'],
        default: 'normal',
    },
    notes: {
        type: String,
        default: '',
    },
    completedAt: {
        type: Date,
        default: null,
    },
    startedAt: {
        type: Date,
        default: null,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    dueDate: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

// Index for quick daily task queries
taskSchema.index({ assignedTo: 1, status: 1, createdAt: -1 });
taskSchema.index({ roomId: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);
