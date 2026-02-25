const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    shiftType: {
        type: String,
        enum: ['morning', 'afternoon', 'night', 'off'],
        default: 'morning',
    },
    startTime: {
        type: String,
        default: '07:00',
    },
    endTime: {
        type: String,
        default: '15:00',
    },
    notes: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

// One shift entry per staff per date
shiftSchema.index({ staffId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Shift', shiftSchema);
