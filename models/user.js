const mongoose = require("mongoose")

const user = new mongoose.Schema({
    username:{
        minlength: 7,
        maxlength:20,
        unique: true,
        type: String,
        required:true
    },
    password:{
        minlength: 7,
        password:20,
        type: String,
        required: true
    }

}, {collection: 'info'})

module.exports = mongoose.model('info', user)