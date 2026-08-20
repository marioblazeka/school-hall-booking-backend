const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB uspješno spojen.');
    } catch (err) {
        console.error('Greška pri spajanju na bazu:', err.message);
        process.exit(1);
    }
};
module.exports = connectDB;