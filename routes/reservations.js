import express from 'express';
import Reservation from '../models/Reservations.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

const isValidDate = (date) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
    const parsed = new Date(`${date}T00:00:00Z`);
    return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === date;
};

// JAVNI PRISTUP: Slanje novog zahtjeva
router.post('/', async (req, res) => {
    try {
        const { fullName, email, location, hallName, date, timeSlot, notes, resources } = req.body;
        if (!fullName?.trim() || !email?.trim() || !location?.trim() || !hallName || !date || !timeSlot?.trim()) {
            return res.status(400).json({ msg: 'Sva obavezna polja rezervacije moraju biti popunjena.' });
        }
        const reservationDate = new Date(`${date}T00:00:00`);
        if (!isValidDate(date) || reservationDate < new Date(new Date().setHours(0, 0, 0, 0))) {
            return res.status(400).json({ msg: 'Datum rezervacije nije valjan.' });
        }

        const conflict = await Reservation.exists({
            date,
            hallName,
            timeSlot,
            status: { $in: ['Na čekanju', 'Odobreno'] }
        });
        if (conflict) return res.status(409).json({ msg: 'Odabrani termin je već zauzet.' });

        const newReservation = new Reservation({ fullName, email, location, hallName, date, timeSlot, notes, resources });
        const reservation = await newReservation.save();
        res.status(201).json(reservation);
    } catch (err) {
        const validationFields = err.name === 'ValidationError'
            ? Object.keys(err.errors)
            : [];
        res.status(400).json({
            msg: validationFields.length
                ? `Neispravna polja: ${validationFields.join(', ')}.`
                : 'Validacijska greška ili neispravan format.'
        });
    }
});

// JAVNI PRISTUP: Dohvat zauzetih datuma bez podataka korisnika
router.get('/availability', async (req, res) => {
    try {
        const reservations = await Reservation.find(
            { status: { $in: ['Na čekanju', 'Odobreno'] } },
            { date: 1, _id: 0 }
        );
        const counts = reservations.reduce((result, reservation) => {
            result[reservation.date] = (result[reservation.date] || 0) + 1;
            return result;
        }, {});
        res.json(counts);
    } catch (err) {
        res.status(500).json({ msg: 'Dostupnost trenutno nije dostupna.' });
    }
});

// ZAŠTIĆENI PRISTUP: Dohvat svih rezervacija za admin panel
router.get('/', auth, admin, async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ createdAt: -1 });
        res.json(reservations);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ZAŠTIĆENI PRISTUP: Promjena statusa (Odobreno / Odbijeno)
router.put('/:id', auth, admin, async (req, res) => {
    const { status } = req.body;
    if (!['Odobreno', 'Odbijeno', 'Na čekanju'].includes(status)) {
        return res.status(400).json({ msg: 'Neispravan status.' });
    }
    try {
        let reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({ msg: 'Rezervacija nije pronađena.' });

        reservation.status = status;
        await reservation.save();
        res.json(reservation);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

export default router;
