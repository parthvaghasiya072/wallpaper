const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    tagTitle: {
        type : String,
        required : true
    },
    tagDescription: {
        type: String,
        required : true
    }
},{
    timestamps : true
})

module.exports = mongoose.model("Tag",tagSchema);