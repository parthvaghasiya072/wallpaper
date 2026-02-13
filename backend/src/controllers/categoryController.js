const Category = require("../models/CategoryModel");

const createCategory = async (req, res) => {
    const { categoryName, categoryDescription, categoryStatus } = req.body;
    const categoryImageFile = req.file;

    if (!categoryName || !categoryDescription || !categoryStatus || !categoryImageFile) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const category = await Category.create({
            categoryName,
            categoryImage: `/uploads/${categoryImageFile.filename}`,
            categoryDescription,
            categoryStatus
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllCategory = async (req, res) => {
    try {
        const category = await Category.find();
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getSingleCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createCategory,
    getAllCategory,
    getSingleCategoryById
}