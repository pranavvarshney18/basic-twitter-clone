const Post = require('../models/post');

//create a new post
module.exports.create = (req, res, next) => {
    Post.create({
        content : req.body.content,
        user: req.user._id
    })
    .then(newPost => {
        console.log('new post created');
        res.redirect('back');
    })
    .catch(err => {
        console.log('error in creating new post ', err);
        res.redirect('back');
    })
};