import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    location: { type: String, required: true, trim: true, maxlength: 160 },
    hallName: { type: String, required: true, enum: ['Glavna dvorana', 'Mala dvorana'] },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    timeSlot: { type: String, required: true, trim: true, match: /^([01]\d|2[0-3]):[0-5]\d\s*-\s*([01]\d|2[0-3]):[0-5]\d$/ },
    notes: { type: String, default: '' }, // Napomena iz dizajna
    resources: {
        equipment: { type: Boolean, default: false },
        lockers: { type: Boolean, default: false },
        techDevices: { type: Boolean, default: false }
    },
    status: { 
        type: String, 
        enum: ['Na čekanju', 'Odobreno', 'Odbijeno'], 
        default: 'Na čekanju' 
    }
}, { timestamps: true });

ReservationSchema.index({ date: 1, hallName: 1, timeSlot: 1, status: 1 });

export default mongoose.model('Reservation', ReservationSchema);
