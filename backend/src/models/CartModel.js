const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            titleName: String,
            image: String,
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            size: {
                width: Number,
                height: Number,
                unit: String
            },
            paperMaterial: {
                paperType: String,
                pricePerSqFt: Number
            },
            totalSqFt: Number,
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
