const Wishlist = require("../models/wishlistModel");

// Get user's wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        let wishlist = await Wishlist.findOne({ user: userId }).populate("products");

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, products: [] });
        }

        res.status(200).json({
            success: true,
            data: wishlist,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, products: [productId] });
        } else {
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
                await wishlist.save();
            }
        }

        const populatedWishlist = await Wishlist.findById(wishlist._id).populate("products");

        res.status(200).json({
            success: true,
            message: "Product added to wishlist successfully",
            data: populatedWishlist,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found",
            });
        }

        wishlist.products = wishlist.products.filter(
            (id) => id.toString() !== productId.toString()
        );

        await wishlist.save();

        const populatedWishlist = await Wishlist.findById(wishlist._id).populate("products");

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist successfully",
            data: populatedWishlist,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};
