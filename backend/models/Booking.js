const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    guestName: {
        type: String,
        required: true,
        trim: true,
    },
    guestPhone: {
        type: String,
        default: '',
        trim: true,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    checkIn: {
        type: Date,
        required: true,
    },
    checkOut: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['confirmed', 'checked-in', 'checked-out', 'cancelled'],
        default: 'confirmed',
    },
    notes: {
        type: String,
        default: '',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    checkedInAt: {
        type: Date,
        default: null,
    },
    checkedOutAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

// Validate checkOut is after checkIn
bookingSchema.pre('save', function (next) {
    if (this.checkOut <= this.checkIn) {
        return next(new Error('Check-out date must be after check-in date'));
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
