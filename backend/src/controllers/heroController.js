const HeroSection = require("../models/HeroSectionModel");

// Add a new Hero Section Item
const createHeroSection = async (req, res) => {
    try {
        const { title, description } = req.body;

        // Validation
        if (!title || !description) {
            return res.status(400).json({ success: false, message: "Title and Description are required" });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        const imagePath = `/uploads/${req.file.filename}`;

        const newHeroItem = await HeroSection.create({
            title,
            description,
            image: imagePath
        });

        const allSections = await HeroSection.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Hero section added successfully.",
            data: allSections
        });

    } catch (error) {
        console.error("Error creating hero section:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all Hero Sections
const getHeroSections = async (req, res) => {
    try {
        const sections = await HeroSection.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: sections
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update a Hero Section
const updateHeroSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;

        // Update image if provided
        if (req.file) {
            const imagePath = `/uploads/${req.file.filename}`;
            updateData.image = imagePath;
        }

        await HeroSection.findByIdAndUpdate(id, updateData, { new: true });

        // Return updated list
        const allSections = await HeroSection.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Hero section updated successfully",
            data: allSections
        });

    } catch (error) {
        console.error("Error updating hero section:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a Hero Section
const deleteHeroSection = async (req, res) => {
    try {
        const { id } = req.params;

        await HeroSection.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Hero section deleted successfully",
            data: id
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createHeroSection,
    getHeroSections,
    updateHeroSection,
    deleteHeroSection
};