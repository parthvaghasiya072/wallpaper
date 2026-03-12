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

module.exports = router;
