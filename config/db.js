import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('Environment varijabla MONGO_URI nije postavljena.');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB uspješno povezan.');
  } catch (err) {
    console.error('Greška pri povezivanju na bazu:', err.message);
    process.exit(1);
  }
};

export default connectDB;