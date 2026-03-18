const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    mobileNo: {
        type: String,
        default: ""
    },
    photo: {
        type: String,
        default: ""
    },
    resetPasswordOTP: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);