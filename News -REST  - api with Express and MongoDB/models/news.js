const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    text: {
        type: String,
        required:true
    },
    description: {
        type: String,
        required:true
    },
    title: {
        type : String,
        required:true
    },
    date:{
        type: Date,
        required:true,
        default: Date.now
    }
})

module.exports = mongoose.model('News',newsSchema)