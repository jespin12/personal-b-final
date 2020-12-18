const mongoose = require("mongoose")

// validate it is number
//validate if the value has been passed
// find by id --> document then id is found else --> you may use this id 
const budgetSchema = new mongoose.Schema({
title: {
        type: String,
        required: true, 
        unique: true ,
        uppercase: true,
        
    },
    budget: {
        type: Number, 
        trim: true, 
        required: true,
    },
    color: {
        type:String,
        trim: true,
        unique: true,
        required: true,
        minlength: 7,
        maxlength: 7
    }
}, {collection: 'myBudget'})

module.exports = mongoose.model('myBudget', budgetSchema)