const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    floor: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['single', 'double', 'twin', 'suite', 'deluxe'],
        default: 'double',
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'dirty', 'cleaning', 'clean', 'maintenance', 'dnd'],
        default: 'available',
    },
    currentBookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        default: null,
    },
    assignedStaff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    notes: {
        type: String,
        default: '',
    },
    lastCleaned: {
        type: Date,
        default: null,
    },
    outOfOrder: {
        type: Boolean,
        default: false,
    },
    maxOccupancy: {
        type: Number,
        default: 2,
    },
}, {
    timestamps: true,
});

// Virtual: is the room available for check-in
roomSchema.virtual('isAvailable').get(function () {
    return this.status === 'available' && !this.outOfOrder;
});

module.exports = mongoose.model('Room', roomSchema);
