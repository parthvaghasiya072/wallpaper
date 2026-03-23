const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
    paymentMethod: {
        type: String,
        enum: ['COD', 'Stripe', 'UPI', 'Netbanking'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    stripePaymentId: {
        type: String
    },
    paymentDetails: {
        type: mongoose.Schema.Types.Mixed
    },
    shiprocketOrderId: {
        type: String
    },
    shiprocketAWB: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
