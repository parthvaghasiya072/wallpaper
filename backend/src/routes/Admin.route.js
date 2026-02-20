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
    deleteCategory,
    getAllCategory
} = require("../controllers/categoryController");

const {
    getAllUsers,
    deleteUser
} = require("../controllers/userController");

const upload = require("../middleware/upload");
const { createHeroSection, getHeroSections, updateHeroSection, deleteHeroSection } = require("../controllers/heroController");
const { createTag, getTagById, updateTagById, deleteTagById } = require("../controllers/tagController");

// --- Product Routes ---
router.post("/createProduct", upload.array("images", 10), createProduct);
router.put("/updateProduct/:id", upload.array("images", 10), updateProduct);
router.delete("/deleteProductById/:id", deleteProduct);

// --- Category Routes ---
router.post("/createCategory", upload.single("categoryImage"), createCategory);
router.put("/updateCategory/:id", upload.single("categoryImage"), updateCategory);
router.delete("/deleteCategory/:id", deleteCategory);

// --- User Routes ---
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

module.exports = router;