const Address = require("../models/AddressModel");

// Create Address
const createAddress = async (req, res) => {
    try {
        const { user, isDefault } = req.body;

        // If this is set as default, unset other default addresses for this user
        if (isDefault) {
            await Address.updateMany({ user }, { isDefault: false });
        }

        const address = await Address.create(req.body);
        res.status(201).json({ success: true, message: "Address added successfully", address });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Addresses for a specific user
const getAllAddress = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const address = await Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
        res.status(200).json({ success: true, address });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Single Address
const getSingleAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }
        res.status(200).json({ success: true, address });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Address
const updateAddress = async (req, res) => {
    try {
        const { isDefault, user } = req.body;
        const addressId = req.params.id;

        // If setting as default, unset others first
        if (isDefault) {
            const existingAddress = await Address.findById(addressId);
            if (existingAddress) {
                await Address.updateMany({ user: existingAddress.user }, { isDefault: false });
            }
        }

        const address = await Address.findByIdAndUpdate(addressId, req.body, { new: true });
        if (!address) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }
        res.status(200).json({ success: true, message: "Address updated successfully", address });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Address
const deleteAddress = async (req, res) => {
    try {
        const addressId = req.params.id;
        const address = await Address.findByIdAndDelete(addressId);
        if (!address) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }
        res.status(200).json({ success: true, message: "Address deleted successfully", id: addressId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createAddress,
    getAllAddress,
    getSingleAddress,
    updateAddress,
    deleteAddress
};