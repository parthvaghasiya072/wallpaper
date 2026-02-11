require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Test Route
app.get('/', (req, res) => {
    res.send('Wallpaper App Backend is Running!');
});

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

// Start Server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
