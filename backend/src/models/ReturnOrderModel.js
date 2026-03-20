const mongoose = require('mongoose');

const returnOrderSchema = new mongoose.Schema({
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
                required: true
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
            price: {
                type: Number,
                required: true
            }
        }
    ],
    shippingAddress: {
        fullName: { type: String, required: true },
        mobileNo: { type: String, required: true },
        addressLine: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, default: "India" }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    returnStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
        default: 'Pending'
    },
    originalOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ConfirmOrder'
    }
}, { timestamps: true });

module.exports = mongoose.model('ReturnOrder', returnOrderSchema);
