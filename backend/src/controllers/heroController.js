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
            console.error("No file received or file rejected by Multer");
            return res.status(400).json({
                success: false,
                message: "Image is required or file type/size not supported"
            });
        }

        const imagePath = `/uploads/${req.file.filename}`;

        const newHeroItem = await HeroSection.create({
            title,
            description,
            image: imagePath
        });

        // Fetch refreshed list to keep UI in sync
        const allSections = await HeroSection.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Hero slide published successfully.",
            data: allSections
        });

    } catch (error) {
        console.error("Error creating hero section:", error);
        res.status(500).json({
            success: false,
            message: error.message || "An unexpected error occurred while saving the slide"
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

        console.log('UpdateHeroSection Request:', {
            id,
            body: req.body,
            file: req.file ? req.file.originalname : 'No new file'
        });

        // Verify item exists
        const existingItem = await HeroSection.findById(id);
        if (!existingItem) {
            return res.status(404).json({ success: false, message: "Hero section item not found" });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;

        // Update image if provided
        if (req.file) {
            const imagePath = `/uploads/${req.file.filename}`;
            updateData.image = imagePath;
        }

        const updated = await HeroSection.findByIdAndUpdate(id, updateData, { new: true });

        if (!updated) {
            return res.status(500).json({ success: false, message: "Failed to update item" });
        }

        // Return updated list for UI sync
        const allSections = await HeroSection.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Hero section updated successfully",
            data: allSections
        });

    } catch (error) {
        console.error("Error updating hero section:", error);
        res.status(500).json({
            success: false,
            message: error.name === 'CastError' ? "Invalid ID format" : `Server Error: ${error.message}`,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
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