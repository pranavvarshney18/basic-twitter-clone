const express = require('express');
const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');
const commentsMailer = require('../mailers/comments_mailer');

//create new comment
module.exports.create = async (req, res, next) => {
    try{
        let post = await Post.findById(req.body.post);
        if(!post){
            req.flash('error', 'No post exists for this comment');
            console.log('No post exists for this comment');
            return res.redirect('back');
        }

        let newComment = await Comment.create({
            content: req.body.content,
            user: req.user._id,
            post: req.body.post
        });

        post.comments.push(newComment._id);
        await post.save();

        console.log('new comment created !!!');

        newComment = await newComment.populate('user', 'name email');
        // commentsMailer.newComment(newComment);
        // console.log(req.xhr);
        if(req.xhr){ 
            return res.status(200).json({
                data: {
                    comment: newComment
                },
                message: 'comment created!'
            });
        }
        
        req.flash('success', 'New comment created !!!');
        return res.redirect('back');
    }
    catch(err){
        req.flash('error', 'error in creating new comment');
        console.log('error in creating new comment', err);
        return res.redirect('back');
    }
}




//delete comment
module.exports.destroy = async (req, res, next) => {
    try{
        let comment = await Comment.findById(req.params.id);
        if(comment && comment.user == req.user.id){
            //delete related likes for comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            let postId = comment.post;
            await comment.deleteOne();

            //delete comment from its post array
            await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});
            console.log('comment deleted !!!');
            // console.log(req.xhr);
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: 'Comment deleted'
                });
            }
            req.flash('success', 'Comment deleted !!!');
            return res.redirect('back');
        }
        else{
            req.flash('error', "Permission denied");
            console.log('permission denied');
            return res.redirect('back');
        }
    }
    catch(err){
        req.flash('error', 'Error in deleting comment');
        console.log('error in deleting comment', err);
        return res.redirect('back');
    }
}




//delete comment by post creator
module.exports.destoryByPostUser = async (req, res, next) => {
    try{
        let comment = await Comment.findById(req.params.id);
        if(!comment){
            req.flash('error', 'this comment does not exist');
            console.log('this comment does not exist');
            return res.redirect('back');
        }
        let post = await Post.findById(comment.post);
        if(post && post.user == req.user.id){
            //delete related likes for comment 
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            let postId = comment.post;
            await comment.deleteOne();

            await Post.findByIdAndUpdate(postId, {$pull:{comments: req.params.id}});
            console.log('comment deleted !!!');

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }

            req.flash('success', 'comment deleted !!!');
        }
        else {
            req.flash('error', 'permission denied');
            console.log('permission denied');
        }
        return res.redirect('back');
    }
    catch(err){
        req.flash('error', 'error in deleting comment by post creator');
        console.log('error in deleting comment by post creator', err);
        return res.redirect('back');
    }
}