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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Category.countDocuments();
        const categories = await Category.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            categories,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
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

const updateCategory = async (req, res) => {
    try {
        const { categoryName, categoryDescription, categoryStatus } = req.body;
        const updateData = {
            categoryName,
            categoryDescription,
            categoryStatus
        };

        if (req.file) {
            updateData.categoryImage = `/uploads/${req.file.filename}`;
        }

        const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category updated successfully", category });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id)
        if (!category) {
            return res.status(404).json({ message: "Category Not Found." })
        } else {
            res.status(200).json({ message: "Category Deleted Successfully.", category })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteAllCategories = async (req, res) => {
    try {
        await Category.deleteMany({});
        res.status(200).json({ message: "All categories deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createCategory,
    getAllCategory,
    getSingleCategoryById,
    updateCategory,
    deleteCategory,
    deleteAllCategories
}