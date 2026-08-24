import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true },
    hallName: { type: String, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD iz kalendara
    timeSlot: { type: String, required: true },
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

export default mongoose.model('Reservation', ReservationSchema);
