const Product = require("../models/ProductModel");

const createProduct = async (req, res) => {
    const { titleName, description, stocks, category, images, paperOptions } = req.body;

    if (!titleName || !description || !stocks || !category || !images || !paperOptions) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const product = await Product.create({
            titleName,
            description,
            stocks,
            category,
            images,
            paperOptions
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct
}
