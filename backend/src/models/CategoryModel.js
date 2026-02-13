const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    categoryImage: {
        type: String,
        required: true
    },
    categoryStatus: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    categoryDescription: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Category", categorySchema);    