const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

//create a new post
module.exports.create = async (req, res, next) => {
    try{
        let newPost = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        console.log('new post created');
        //checking for ajax request
        if(req.xhr){
            newPost = await newPost.populate('user', 'name');
            return res.status(200).json({
                data: {
                    post: newPost
                },
                message: "Post created!!"
            })
        }
        req.flash('success', 'New post created !!!');
        return res.redirect('back');
    }
    catch(err){
        req.flash('error', 'error in creating new post');
        console.log('error in creating new post', err);
        return res.redirect('back');
    }
}


//delete post
module.exports.destroy = async (req, res, next) => {
    try{
        let post = await Post.findById(req.params.id);

        if(post && post.user == req.user.id){
            //delete related likes of post as well as comments
            await Like.deleteMany({likeable: post._id, onModel: 'Post'});
            for(commentId of post.comments){
                await Like.deleteMany({likeable: commentId, onModel: 'Comment'});
            }

            await post.deleteOne();
            
            //delete all the comments related to post
            let deletedCommentsCount = await Comment.deleteMany({post: req.params.id});
            console.log('post and its related comments deleted !!!');
            console.log(deletedCommentsCount);
            // console.log(req.xhr);
            if(req.xhr){
                // console.log('entered ', req.xhr);
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: 'Post deleted'
                });
            }
            req.flash('success', 'post and its related comments deleted !!!');
            return res.redirect('back');
        }
        else{
            req.flash('error', 'unable to delete post');
            console.log('unable to delete post');
            return res.redirect('back');
        }
    }
    catch(err){
        req.flash('error', 'error in deleting post');
        console.log('error in deleting post', err);
        return res.redirect('back');
    }
}