const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://mandaviyahimanshu:Y4kvoe5nufjsUymA@cluster0.h1vo1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
module.exports = connectDB;
