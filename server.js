import express from 'express';

const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/api/test', (req, res) => {
    res.json({ poruka: "Backend server uspješno radi koristeći ES Module!" });
});

app.listen(PORT, () => {
    console.log(`Server je pokrenut na http://localhost:${PORT}`);
});
