const e = require('express');
const Comment = require('../models/comment');
const Post = require('../models/post');

//create new comment
module.exports.create = (req, res, next) => {
    Post.findById(req.body.post)
        .exec()
        .then(post => {
            if(!post){
                console.log('No post exists for this comment');
                return res.redirect('back');
            }
            
            Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post
            })
            .then(newComment => {
                post.comments.push(newComment._id);
                post.save();

                console.log('new comment created');
                return res.redirect('back');
            })
            .catch(err => {
                console.log('error in creating new comment', err);
                return res.redirect('back');
            })
        })
        .catch(err => {
            console.log('error in finding the desired post for this comment', err);
            return res.redirect('back');
        })
}




//delete comment
module.exports.destroy = (req, res, next) => {
    Comment.findById(req.params.id)
        .exec()
        .then(comment => {
            if(comment && comment.user == req.user.id){
                let postId = comment.post;
                comment.deleteOne();

                //delete comment from its post array
                Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}})
                    .exec()
                    .then(post => {
                        return res.redirect('back');
                    })
                    .catch(err => {
                        console.log('error in removing the id of comment from its post array', err);
                        return res.redirect('back');
                    })
            }
            else{
                console.log('this comment does not exist');
                return res.redirect('back');
            }
        })
        .catch(err => {
            console.log('error in fetching the required comment', err);
            return res.redirect('back');
        })
}