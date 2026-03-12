const express = require("express");
const router = express.Router();
const { createOrder, createCheckoutSession, getUserOrders } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.post("/createOrder", protect, createOrder);
router.post("/create-checkout-session", protect, createCheckoutSession);
router.get("/my-orders", protect, getUserOrders);

module.exports = router;
