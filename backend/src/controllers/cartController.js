const Cart = require('../models/CartModel');

// Add item to cart
const addToCart = async (req, res) => {
    try {   
        const { productId, titleName, image, quantity, size, paperMaterial, totalSqFt, price } = req.body;
        const userId = req.user._id;
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, titleName, image, quantity, size, paperMaterial, totalSqFt, price }],
                totalAmount: price
            });
        } else {
            // Check if item already exists with SAME options
            const itemIndex = cart.items.findIndex(item =>
                item.productId.toString() === productId &&
                item.paperMaterial.paperType === paperMaterial.paperType &&
                item.size.width === size.width &&
                item.size.height === size.height &&
                item.size.unit === size.unit
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
                // Price should be item total price
                const unitPrice = cart.items[itemIndex].price / (cart.items[itemIndex].quantity - quantity);
                cart.items[itemIndex].price = unitPrice * cart.items[itemIndex].quantity;
            } else {
                cart.items.push({ productId, titleName, image, quantity, size, paperMaterial, totalSqFt, price });
            }

            // Recalculate totalAmount
            cart.totalAmount = cart.items.reduce((total, item) => total + item.price, 0);
        }

        await cart.save();
        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user cart
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(200).json({ success: true, cart: { items: [], totalAmount: 0 } });
        }
        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update cart item quantity
const updateCartItem = async (req, res) => { 
    try {
        const { cartItemId, quantity } = req.body;
        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        const item = cart.items.id(cartItemId);
        if (!item) return res.status(404).json({ success: false, message: "Item not found in cart" });

        const unitPrice = item.price / item.quantity;
        item.quantity = quantity;
        item.price = unitPrice * quantity;

        cart.totalAmount = cart.items.reduce((total, item) => total + item.price, 0);
        await cart.save();

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        cart.items = cart.items.filter(item => item._id.toString() !== cartItemId);
        cart.totalAmount = cart.items.reduce((total, item) => total + item.price, 0);

        await cart.save();
        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart
};