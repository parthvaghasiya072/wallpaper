const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const path = require('path');

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/user', require('./routes/User.route.js'));
app.use('/api/admin', require('./routes/Admin.route.js'));
app.use('/api', require('./routes/Index.route.js'));

// Default Route
app.get('/', (req, res) => {
    res.send('Wallpaper App API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
