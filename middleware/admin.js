export default function admin(req, res, next) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ msg: 'Administratorske ovlasti su potrebne.' });
    }
    next();
}
