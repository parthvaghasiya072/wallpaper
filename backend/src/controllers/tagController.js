const Tag = require("../models/TagsModel");

const createTag = async (req, res) => {

    const { tagTitle, tagDescription } = req.body;

    if (!tagTitle || !tagDescription) {
        return res.status(400).json({ message: "All fields are required." })
    }

    const tags = await Tag.create({
        tagTitle,
        tagDescription
    })

    res.status(201).json({ message: "Tag created successfully.", tags })
}

const getAllTags = async (req, res) => {

    const tags = await Tag.find();
    res.status(200).json({ message: "Tags fetched successfully.", tags });
}

const getTagById = async (req, res) => {
    const { id } = req.params;
    const tag = await Tag.findById(id);

    if (!tag) {
        return res.status(400).json({ message: "Tag not found." })
    }

    res.status(200).json({ message: "Tag fetched successfully.", tag })
}

const updateTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const { tagTitle, tagDescription } = req.body;

        if (!tagTitle || !tagDescription) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const tag = await Tag.findByIdAndUpdate(id, {
            tagTitle,
            tagDescription
        }, { new: true });

        if (!tag) {
            return res.status(404).json({ success: false, message: "Tag not found." });
        }

        res.status(200).json({ success: true, message: "Tag updated successfully.", tag });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const deleteTagById = async (req, res) => {
    try {
        const { id } = req.params;

        const tag = await Tag.findByIdAndDelete(id);

        if (!tag) {
            return res.status(404).json({ success: false, message: "Tag not found." });
        }

        res.status(200).json({ success: true, message: "Tag deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    createTag,
    getAllTags,
    getTagById,
    updateTagById,
    deleteTagById
}