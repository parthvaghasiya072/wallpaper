const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

const createUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const pass = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: pass
        });

        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            photo: user.photo,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        res.status(200).json({
            message: "Login successful",
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            photo: user.photo,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    // Check for email credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("CRITICAL: Email credentials missing in .env file (EMAIL_USER/EMAIL_PASS)");
        return res.status(500).json({
            message: "Server email configuration incomplete. Please contact support or check server logs."
        });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP - Lumiere Art Store",
            text: `Your OTP for password reset is: ${otp}. This OTP will expire in 10 minutes.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Error sending OTP via email" });
            }
            res.status(200).json({ message: "OTP sent to your email" });
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        res.status(200).json({
            message: "OTP verified proceed to reset password",
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { userId, newPassword } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user || !user.resetPasswordOTP) {
            return res.status(400).json({ message: "OTP verification failed or session expired" });
        }

        const pass = await bcrypt.hash(newPassword, 10);
        user.password = pass;
        user.resetPasswordOTP = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    loginUser,
    forgotPassword,
    verifyOTP,
    resetPassword
};
