const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    titleName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stocks: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    paperOptions: [{
        paperType: {
            type: String,
            required: true
        },
        pricePerSqFt: {
            type: Number,
            required: true
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);