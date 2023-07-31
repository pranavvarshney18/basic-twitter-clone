const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
//setting path
const AVATAR_PATH = path.join('/uploads/users/avatars');

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
    },
    avatar:{
        type: String //to store path of the file
    }
},{
    timestamps: true
});

//disk storage engine for storing files
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

//static methods/functions
userSchema.statics.uploadedAvatar = multer({storage:storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;
  

module.exports = mongoose.model('User', userSchema);

