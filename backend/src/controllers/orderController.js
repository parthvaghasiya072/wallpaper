const Order = require('../models/OrderModel');
const Cart = require('../models/CartModel');
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
            paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending'
        });

        await order.save();

        // If order successful, clear cart
        await Cart.findOneAndDelete({ userId });

        res.status(201).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create Stripe Checkout Session
const createCheckoutSession = async (req, res) => {
    try {
        const { items, orderId } = req.body;

        const line_items = items.map(item => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.titleName,
                    images: [item.image.startsWith('http') ? item.image : `${process.env.API_URL}/uploads/${item.image}`],
                },
                unit_amount: Math.round(item.price * 100 / item.quantity), // Stripe expects amount in cents/paise
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/checkout`,
            metadata: { orderId: orderId.toString() }
        });

        // Update order with session ID
        await Order.findByIdAndUpdate(orderId, { stripeSessionId: session.id });

        res.status(200).json({ success: true, id: session.id, url: session.url });
    } catch (error) {
        console.error("Stripe Error:", error);
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

module.exports = {
    createOrder,
    createCheckoutSession,
    getUserOrders
};
