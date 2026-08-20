const mongoose = require('mongoose');
const ReservationSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true }, // Mjesto prebivališta/sjedište
    hallName: { type: String, required: true }, // npr. "Glavna sportska dvorana"
    date: { type: String, required: true }, // YYYY-MM-DD
    timeSlot: { type: String, required: true }, // npr. "18:00 - 19:30"
    resources: {
        equipment: { type: Boolean, default: false }, // sportska oprema
        lockers: { type: Boolean, default: false },   // svlačionice
        techDevices: { type: Boolean, default: false } // tehnički uređaji
    },
    status: { type: String, enum: ['Na čekanju', 'Odobreno', 'Odbijeno'], default: 'Na čekanju' }
}, { timestamps: true });
module.exports = mongoose.model('Reservation', ReservationSchema);
