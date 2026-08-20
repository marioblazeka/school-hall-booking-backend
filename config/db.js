import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB uspješno povezan.');
    } catch (err) {
        console.error('Greška pri povezivanju na bazu:', err.message);
        process.exit(1);
    }
};

export default connectDB;
