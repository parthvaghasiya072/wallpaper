const express = require("express");
const router = express.Router();

const { createProduct } = require("../controllers/productController");
const { creareCategory } = require("../controllers/categoryController");

// Product
router.post("/createProduct", createProduct);

// Category
router.post("/createCategory", creareCategory);

module.exports = router;