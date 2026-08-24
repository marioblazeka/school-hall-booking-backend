import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password || password.length < 6) {
        return res.status(400).json({ msg: 'Email i lozinka od najmanje 6 znakova su obavezni.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ msg: 'Korisnik s tim emailom već postoji.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword });
        res.status(201).json({ msg: 'Račun je uspješno kreiran.' });
    } catch (err) {
        res.status(500).json({ msg: 'Registracija trenutno nije moguća.' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Neispravne vjerodajnice.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Neispravne vjerodajnice.' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.post('/forgot-password', async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const user = await User.findOne({ email });
    const response = { msg: 'Ako korisnik postoji, generiran je token za resetiranje.' };

    if (!user) return res.json(response);

    user.resetToken = crypto.randomBytes(32).toString('hex');
    user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    if (process.env.NODE_ENV !== 'production') {
        return res.json({ ...response, resetToken: user.resetToken });
    }

    res.json(response);
});

router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password || password.length < 6) {
        return res.status(400).json({ msg: 'Token i nova lozinka od najmanje 6 znakova su obavezni.' });
    }

    const user = await User.findOne({
        resetToken: token,
        resetTokenExpires: { $gt: new Date() }
    });
    if (!user) return res.status(400).json({ msg: 'Token je neispravan ili je istekao.' });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();
    res.json({ msg: 'Lozinka je uspješno promijenjena.' });
});

export default router;
