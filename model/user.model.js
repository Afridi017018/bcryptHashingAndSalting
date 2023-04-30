const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },

    pass: {
        type: String,
        required : true
    },

    created:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("user", userSchema)