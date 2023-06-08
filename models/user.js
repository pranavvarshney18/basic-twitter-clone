const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);

