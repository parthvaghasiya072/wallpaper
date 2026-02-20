const User = require("../models/userModel");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// Get all users with role 'user'
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update user (with optional image upload)
const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, mobileNo } = req.body;
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Handle image upload - delete old one if new uploaded
        if (req.file) {
            if (user.photo && user.photo !== "") {
                const oldImagePath = path.join(__dirname, "../../uploads", user.photo);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            user.photo = req.file.filename;
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (mobileNo !== undefined) user.mobileNo = mobileNo;

        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.password;

        res.status(200).json({ success: true, message: "User updated successfully", data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete user
// Delete user
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id.trim();

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid User ID format" });
        }

        const user = await User.findById(userId);

        if (!user) {
            console.log(`Delete failed: User with ID ${userId} not found.`);
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Delete user's photo from the server if it exists
        if (user.photo && user.photo !== "") {
            const imagePath = path.join(__dirname, "../../uploads", user.photo);
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log(`Deleted photo: ${user.photo}`);
                }
            } catch (err) {
                console.error(`Failed to delete photo ${user.photo}:`, err.message);
                // Continue with user deletion even if photo deletion fails
            }
        }

        await User.findByIdAndDelete(userId);
        res.status(200).json({ success: true, message: "User deleted successfully", id: userId });
    } catch (error) {
        console.error("Delete User Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};