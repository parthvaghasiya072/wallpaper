const express = require("express");
const router = express.Router();

const { createProduct, deleteProduct, updateProduct } = require("../controllers/productController");
const { createCategory, updateCategory, deleteCategory, getAllCategory } = require("../controllers/categoryController");
const upload = require("../middleware/upload");

// Product
router.post("/createProduct", upload.array("images", 10), createProduct);
router.post("/deleteProductById/:id", deleteProduct)
router.post("/updateProduct/:id", upload.array("images", 10), updateProduct);

// Category
router.post("/createCategory", upload.single("categoryImage"), createCategory);

module.exports = router;