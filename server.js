import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv/config';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import reservationRoutes from './routes/reservations.js';


await connectDB();

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
	app.listen(PORT, () => console.log(`Server pokrenut na portu ${PORT}`));
});
