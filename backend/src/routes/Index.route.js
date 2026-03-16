const express = require("express");
const router = express.Router();

const { getSingleProduct, getAllProducts } = require("../controllers/productController");
const { getAllCategory, getSingleCategoryById } = require("../controllers/categoryController");
const { getAllUsers, getUserById, updateUser, changePassword } = require("../controllers/userController");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware");

const { getHeroSections } = require("../controllers/heroController");
const { getAllTags } = require("../controllers/tagController");
const { getAllBanners } = require("../controllers/bannerController");
const { createOrder, createPaymentIntent, updatePaymentStatus } = require("../controllers/orderController");

// Health Check
router.get("/ping", (req, res) => res.json({ success: true, message: "Server is UPDATED", time: new Date() }));

// product
router.get("/getAllProducts", getAllProducts);
router.get("/getSingleProduct/:id", getSingleProduct);

// category
router.get("/getAllCategory", getAllCategory);
router.get("/getSingleCategory/:id", getSingleCategoryById);

//User
router.get("/getAllUsers", protect, getAllUsers);
router.get("/getUser/:id", protect, getUserById);
router.put("/updateUser/:id", protect, upload.single("photo"), updateUser);
router.put("/changePassword/:id", protect, changePassword);

//Hero
router.get("/getHeroSections", getHeroSections);

//Tags
router.get("/getAllTags", getAllTags);

//Banner
router.get("/getAllBanners", getAllBanners);

// Orders (Directly in Index for better priority)
router.post("/user/create-order", protect, createOrder);
router.post("/user/create-payment-intent", protect, createPaymentIntent);

module.exports = router;
