const Post = require('../models/post');
const Comment = require('../models/comment');

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


//delete post
module.exports.destroy = (req, res, next) => {
    Post.findById(req.params.id)
        .exec()
        .then(post => {
            if(post && post.user == req.user.id){
                post.deleteOne();

                Comment.deleteMany({post: req.params.id})
                    .then(deletedCount => {
                        return res.redirect('back');
                    })
                    .catch(err => {
                        console.log('error in deleting related comments for this post', err);
                        return res.redirect('back');
                    })
                        
            }
            else {
                console.log('unable to delete post');
                return res.redirect('back');
            }
        })
        .catch(err => {
            console.log('error in finding the required post for deletion', err);
            return res.redirect('back');
        })
}