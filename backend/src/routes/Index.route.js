const express = require("express");
const router = express.Router();

const { getSingleProduct, getAllProducts } = require("../controllers/productController");
const { getAllCategory, getSingleCategoryById } = require("../controllers/categoryController");

// product
router.get("/getAllProducts", getAllProducts);
router.get("/getSingleProduct/:id", getSingleProduct);

// category
router.get("/getAllCategory", getAllCategory);
router.get("/getSingleCategory/:id", getSingleCategoryById);


module.exports = router;