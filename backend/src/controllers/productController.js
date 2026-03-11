const Product = require("../models/ProductModel");

const createProduct = async (req, res) => {
    try {
        const { titleName, description, stocks, category, paperOptions } = req.body;

        // More robust validation
        if (!titleName || !description || category === undefined || paperOptions === undefined) {
            return res.status(400).json({ message: "Mandatory fields (Title, Description, Category, Paper Options) are missing" });
        }

        if (stocks === undefined || stocks === null || stocks === "") {
            return res.status(400).json({ message: "Stock field is required" });
        }

        // Handle images
        const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
        if (imagePaths.length === 0) {
            return res.status(400).json({ message: "At least one artwork asset is required" });
        }

        // Parse paperOptions if it's a string (FormData sends objects as JSON strings)
        let parsedPaperOptions = paperOptions;
        if (typeof paperOptions === 'string') {
            try {
                parsedPaperOptions = JSON.parse(paperOptions);
            } catch (e) {
                return res.status(400).json({ message: "Invalid paper options format" });
            }
        }

        const product = await Product.create({
            titleName,
            description,
            stocks: Number(stocks),
            category,
            images: imagePaths,
            paperOptions: parsedPaperOptions
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        const { category, search, minPrice, maxPrice, sortBy } = req.query;

        // Build Query
        let query = {};
        if (category) {
            // Support comma separated categories
            const categoryArray = category.split(',').map(c => c.trim());
            query.category = { $in: categoryArray };
        }
        if (search) {
            query.$or = [
                { titleName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Price range based on initial paper option
        if (minPrice || maxPrice) {
            query['paperOptions.0.pricePerSqFt'] = {};
            if (minPrice) query['paperOptions.0.pricePerSqFt'].$gte = Number(minPrice);
            if (maxPrice) query['paperOptions.0.pricePerSqFt'].$lte = Number(maxPrice);
        }

        // Build Sort order
        let sort = { createdAt: -1 };
        if (sortBy === 'price-low') sort = { 'paperOptions.pricePerSqFt': 1 };
        if (sortBy === 'price-high') sort = { 'paperOptions.pricePerSqFt': -1 };
        if (sortBy === 'name') sort = { titleName: 1 };

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        res.setHeader('Cache-Control', 'no-store');
        res.status(200).json({
            products,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
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

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            res.status(404).json({ message: "product not found" })
        }
        res.status(200).json({ message: "product deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { titleName, description, stocks, category, paperOptions } = req.body;
        const productId = req.params.id;

        const updateData = {
            titleName,
            description,
            stocks: Number(stocks),
            category,
        }

        // Handle images (Preserve existing + add new)
        let images = [];
        if (req.body.existingImages) {
            try {
                images = JSON.parse(req.body.existingImages);
            } catch (e) {
                images = [];
            }
        }

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/${file.filename}`);
            images = [...images, ...newImages];
        }

        if (images.length > 0) {
            updateData.images = images;
        }

        if (typeof paperOptions === 'string') {
            try {
                updateData.paperOptions = JSON.parse(paperOptions)
            } catch (e) {
                return res.status(400).json({ message: "Invalid paper options format" })
            }
        } else {
            updateData.paperOptions = paperOptions
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true })

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" })
        }

        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    updateProduct
}
