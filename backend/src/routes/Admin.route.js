const express = require("express");
const router = express.Router();

const {
    createProduct,
    deleteProduct,
    updateProduct
} = require("../controllers/productController");

const {
    createCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");

const {
    deleteUser,
    getAllUsers
} = require("../controllers/userController");

const upload = require("../middleware/upload");
const { createHeroSection, updateHeroSection, deleteHeroSection } = require("../controllers/heroController");
const { createTag, getTagById, updateTagById, deleteTagById } = require("../controllers/tagController");
const { createBanner, deleteBannerById, updateBannerById, singleBannerById } = require("../controllers/bannerController");
const { getAllOrders, getAllConfirmedOrders, updateOrderTracking } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware"); // Assuming protect is needed and can check for admin but for now just protect

// --- Product Routes ---
router.post("/createProduct", upload.array("images", 10), createProduct);
router.put("/updateProduct/:id", upload.array("images", 10), updateProduct);
router.delete("/deleteProductById/:id", deleteProduct);

// --- Category Routes ---
router.post("/createCategory", upload.single("categoryImage"), createCategory);
router.put("/updateCategory/:id", upload.single("categoryImage"), updateCategory);
router.delete("/deleteCategory/:id", deleteCategory);

// --- User Routes ---
router.get("/getAllUsers", protect, getAllUsers);
router.delete("/deleteUserById/:id", deleteUser);

// Home

// HeroSections
router.post("/createHeroSection", upload.single("image"), createHeroSection);
router.put("/updateHeroSection/:id", upload.single("image"), updateHeroSection);
router.delete("/deleteHeroSection/:id", deleteHeroSection);

// Tags
router.post("/createTag", createTag);
router.get("/getTagById/:id", getTagById);
router.put("/updateTagById/:id", updateTagById);
router.delete("/deleteTagById/:id", deleteTagById);

//Banner
router.post("/createBanner", upload.single("image"), createBanner);
router.get("/getSingleBanner/:id", singleBannerById);
router.put("/updateBannerById/:id", upload.single("image"), updateBannerById);
router.delete("/deleteBannerById/:id", deleteBannerById)

// --- Order Routes ---
router.get("/getAllOrders", protect, getAllOrders);
router.get("/getAllConfirmedOrders", protect, getAllConfirmedOrders);
router.put("/updateOrderTracking", protect, updateOrderTracking);

module.exports = router;