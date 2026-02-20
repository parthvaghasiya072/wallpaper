const express = require("express");
const router = express.Router();

const { getSingleProduct, getAllProducts } = require("../controllers/productController");
const { getAllCategory, getSingleCategoryById } = require("../controllers/categoryController");
const { getAllUsers, getUserById, updateUser } = require("../controllers/userController");
const upload = require("../middleware/upload");
const { getHeroSections } = require("../controllers/heroController");
const { getAllTags } = require("../controllers/tagController");

// product
router.get("/getAllProducts", getAllProducts);
router.get("/getSingleProduct/:id", getSingleProduct);

// category
router.get("/getAllCategory", getAllCategory);
router.get("/getSingleCategory/:id", getSingleCategoryById);

//User
router.get("/getAllUsers", getAllUsers);
router.get("/getUser/:id", getUserById);
router.put("/updateUser/:id", upload.single("photo"), updateUser);

//Hero
router.get("/getHeroSections", getHeroSections);

//Tags
router.get("/getAllTags", getAllTags);

module.exports = router;