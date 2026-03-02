const Banner = require("../models/BannerModel");

const createBanner = async (req, res) => {
    const { title, description } = req.body;
    const image = req.file;

    if (!title || !description || !image) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const banner = await Banner.create({
            title,
            description,
            image: `/uploads/${image.filename}`
        });
        res.status(201).json(banner);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}





const getAllBanners = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        const query = search ? {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ]
        } : {};

        const totalBanners = await Banner.countDocuments(query);
        const banners = await Banner.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            banners,
            totalBanners,
            totalPages: Math.ceil(totalBanners / limit),
            currentPage: page
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const singleBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: "Banner not found." });
        }
        res.status(200).json(banner);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateBannerById = async (req, res) => {
    try {
        const { title, description } = req.body;
        const updateData = {
            title,
            description
        };

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const banner = await Banner.findByIdAndUpdate(req.params.id, updateData,
            { new: true }
        );

        if (!banner) {
            return res.status(400).json({ message: "Banner not updated successfully." });
        }
        res.status(200).json({ message: "Banner updated successfully", banner });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteBannerById = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) {
            return res.status(400).json({ message: "Banner not found." })
        }
        res.status(200).json({ message: "Banner deleted successfully", banner });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createBanner,
    getAllBanners,
    singleBannerById,
    updateBannerById,
    deleteBannerById
}