const express = require("express");
const router = express.Router();

const { createUser, loginUser } = require("../controllers/authController");
const { createAddress, getAllAddress, getSingleAddress, updateAddress, deleteAddress } = require("../controllers/addressController");
const { addToCart, getCart, updateCartItem, removeFromCart } = require("../controllers/cartController");
const { getWishlist, addToWishlist, removeFromWishlist } = require("../controllers/wishlistController");
const { createOrder, createPaymentIntent, updatePaymentStatus, getUserOrders, getUserConfirmedOrders } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// --- Auth Routes ---
router.post("/register", createUser);
router.post("/login", loginUser);

// --- Address Routes (Protected) ---
router.post("/createAddress", protect, createAddress);
router.get("/getAllAddress", protect, getAllAddress);
router.get("/getSingleAddressById/:id", protect, getSingleAddress);
router.put("/updateAddressById/:id", protect, updateAddress);
router.delete("/deleteAddressById/:id", protect, deleteAddress);

// --- Cart Routes (Protected) ---
router.post("/addToCart", protect, addToCart);
router.get("/getCart", protect, getCart);
router.put("/updateCart", protect, updateCartItem);
router.delete("/removeFromCart/:cartItemId", protect, removeFromCart);

// --- Wishlist Routes (Protected) ---
router.get("/getWishlist", protect, getWishlist);
router.post("/addToWishlist", protect, addToWishlist);
router.delete("/removeFromWishlist/:productId", protect, removeFromWishlist);

// --- Order Routes (Protected) ---
router.post("/create-order", protect, createOrder);
router.post("/create-payment-intent", protect, createPaymentIntent);
router.post("/update-payment-status", protect, updatePaymentStatus);
router.get("/my-orders", protect, getUserOrders);
router.get("/my-confirmed-orders", protect, getUserConfirmedOrders);

module.exports = router;
