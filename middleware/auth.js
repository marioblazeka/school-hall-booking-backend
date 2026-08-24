import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
    const authorization = req.header('Authorization');
    const token = authorization?.startsWith('Bearer ')
        ? authorization.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({ msg: 'Nema autorizacijskog tokena.' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET).user;
        next();
    } catch {
        res.status(401).json({ msg: 'Token nije valjan.' });
    }
}
