import express from 'express';
import Reservation from '../models/Reservation.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// JAVNI PRISTUP: Slanje novog zahtjeva
router.post('/', async (req, res) => {
    try {
        const newReservation = new Reservation(req.body);
        const reservation = await newReservation.save();
        res.status(201).json(reservation);
    } catch (err) {
        res.status(400).json({ msg: 'Validacijska greška ili neispravan format.' });
    }
});

// ZAŠTIĆENI PRISTUP: Dohvat svih rezervacija za admin panel
router.get('/', auth, async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ createdAt: -1 });
        res.json(reservations);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ZAŠTIĆENI PRISTUP: Promjena statusa (Odobreno / Odbijeno)
router.put('/:id', auth, async (req, res) => {
    const { status } = req.body;
    if (!['Odobreno', 'Odbijeno', 'Na čekanju'].includes(status)) {
        return res.status(400).json({ msg: 'Neispravan status.' });
    }
    try {
        let reservation = await Reservation.findById(req.id);
        if (!reservation) return res.status(404).json({ msg: 'Rezervacija nije pronađena.' });

        reservation.status = status;
        await reservation.save();
        res.json(reservation);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

export default router;
