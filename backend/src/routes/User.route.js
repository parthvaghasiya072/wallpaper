const express = require("express");
const router = express.Router();

const { createUser, loginUser } = require("../controllers/authController");
const { createAddress, getAllAddress, getSingleAddress, updateAddress, deleteAddress } = require("../controllers/addressController");
const { addToCart, getCart, updateCartItem, removeFromCart } = require("../controllers/cartController");
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

module.exports = router;
