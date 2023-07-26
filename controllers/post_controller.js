const Post = require('../models/post');
const Comment = require('../models/comment');

//create a new post
module.exports.create = async (req, res, next) => {
    try{
        let newPost = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        console.log('new post created');
        return res.redirect('back');
    }
    catch(err){
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
            console.log('post and its related comments deleted !!!');
            console.log(deletedCommentsCount);
            return res.redirect('back');
        }
        else{
            console.log('unable to delete post');
            return res.redirect('back');
        }
    }
    catch(err){
        console.log('error in deleting post', err);
        return res.redirect('back');
    }
}