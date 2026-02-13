const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected.");

        // Automatically drop the stale productId index if it exists
        // This solves the E11000 duplicate key error after the field was removed
        try {
            await mongoose.connection.collection('products').dropIndex('productId_1');
            console.log("Stale 'productId' index dropped successfully.");
        } catch (indexError) {
            // Index doesn't exist or already dropped, which is fine
        }

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
