const Order = require('../models/OrderModel');
const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel');
const ConfirmOrder = require('../models/ConfirmOrderModel');
const ReturnOrder = require('../models/ReturnOrderModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, totalAmount } = req.body;
        const userId = req.user._id;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "No items in order" });
        }

        const order = new Order({
            userId,
            items,
            shippingAddress,
            paymentMethod,
            totalAmount,
            paymentStatus: 'Pending'
        });

        await order.save();

        // If COD, we can clear cart immediately. For other methods, wait for success.
        if (paymentMethod === 'COD') {
            await Cart.findOneAndDelete({ userId });
        }

        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create Stripe Payment Intent (Securely)
const createPaymentIntent = async (req, res) => {
    try {
        const { orderId } = req.body;

        // 1. Fetch order from DB to ensure amount is correct (Security Best Practice)
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // 2. Create Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.totalAmount * 100), // convert to paise
            currency: 'inr',
            description: `Payment for Order #${orderId}`,
            metadata: {
                orderId: orderId.toString(),
                userId: req.user._id.toString()
            },
            payment_method_types: ['card'],
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error("Stripe Intent Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Payment Status (for Stripe/UPI/COD)
const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId, paymentStatus, stripePaymentId } = req.body;
        const userId = req.user._id;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        order.paymentStatus = paymentStatus;
        if (stripePaymentId) order.stripePaymentId = stripePaymentId;

        if (paymentStatus === 'Completed') {
            // 1. Reduce Stock
            for (const item of order.items) {
                await Product.findOneAndUpdate(
                    {
                        _id: item.productId,
                        "paperOptions.paperType": item.paperMaterial.paperType
                    },
                    {
                        $inc: { "paperOptions.$.stocks": -item.quantity }
                    }
                );
            }

            // 2. Move to ConfirmOrder Section
            const confirmedOrder = new ConfirmOrder({
                ...order.toObject(),
                originalOrderId: order._id,
                paymentStatus: 'Completed'
            });
            // Remove the _id from the object to let Mongoose generate a new one if needed, 
            // but the user wants it "IN CONFIRMORDER SECTION NOT IN ORDER SECTION".
            // Actually, we can keep the same data.
            delete confirmedOrder._id;

            await confirmedOrder.save();

            // 3. Delete from Order section
            await Order.findByIdAndDelete(orderId);

            // 4. Clear Cart
            await Cart.findOneAndDelete({ userId });

            return res.status(200).json({ success: true, message: "Order confirmed and stock reduced", order: confirmedOrder });
        }

        await order.save();
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Update Payment Status Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user orders
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all orders (Admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'fullName email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all confirmed orders (Admin)
const getAllConfirmedOrders = async (req, res) => {
    try {
        const orders = await ConfirmOrder.find().populate('userId', 'fullName email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user confirmed orders
const getUserConfirmedOrders = async (req, res) => {
    try {
        const orders = await ConfirmOrder.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single confirmed order by ID
const getSingleConfirmedOrder = async (req, res) => {
    try {
        const order = await ConfirmOrder.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Return an order
const returnOrder = async (req, res) => {
    try {
        const { orderId, reason } = req.body;
        const userId = req.user._id;

        const order = await ConfirmOrder.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Confirmed order not found" });
        }

        // 1. Create Return Order entry
        const returnOrderData = new ReturnOrder({
            ...order.toObject(),
            originalOrderId: order._id,
            reason: reason,
            returnStatus: 'Pending'
        });
        delete returnOrderData._id; // Let Mongoose generate a new ID

        await returnOrderData.save();

        // 2. Delete from ConfirmOrder section
        await ConfirmOrder.findByIdAndDelete(orderId);

        res.status(200).json({ success: true, message: "Order return request submitted successfully", returnOrder: returnOrderData });
    } catch (error) {
        console.error("Return Order Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user returned orders
const getUserReturnOrders = async (req, res) => {
    try {
        const orders = await ReturnOrder.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createOrder,
    createPaymentIntent,
    updatePaymentStatus,
    getUserOrders,
    getAllOrders,
    getAllConfirmedOrders,
    getUserConfirmedOrders,
    getSingleConfirmedOrder,
    returnOrder,
    getUserReturnOrders
};
