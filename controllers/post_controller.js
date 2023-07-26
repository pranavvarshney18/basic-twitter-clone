const Post = require('../models/post');
const Comment = require('../models/comment');

//create a new post
module.exports.create = async (req, res, next) => {
    try{
        let newPost = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        req.flash('success', 'New post created !!!');
        console.log('new post created');
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
            await post.deleteOne();

            //delete all the comments related to post
            let deletedCommentsCount = await Comment.deleteMany({post: req.params.id});
            req.flash('success', 'post and its related comments deleted !!!');
            console.log('post and its related comments deleted !!!');
            console.log(deletedCommentsCount);
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