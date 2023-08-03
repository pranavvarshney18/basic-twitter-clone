const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.toggleLike = async function(req, res){
    try{ //likes/toggle?postId=id&type=Post
        let likeable;
        let deleted = false;
        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }
        else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        //check if like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user.id
        })

        //if like already exists, then delete it
        if(existingLike){
            await likeable.likes.pull(existingLike._id);
            await likeable.save();
            await existingLike.deleteOne();
            deleted = true;
        }
        //else make a new like
        else{
            let newLike = await Like.create({
                user: req.user.id,
                likeable: req.query.id,
                onModel: req.query.type
            });
            likeable.likes.push(newLike._id);
            await likeable.save();
        }

        //since toggling like is fully dynamic therefore we are using ajax directly here
        return res.status(200).json({
            message: 'like toggled successfully',
            data: {
                deleted: deleted
            }
        });
        
    }
    catch(err){
        console.log('error in toggling like for post', err);
        return res.status(500).json({
            message: 'error in toggling like'
        });
    }
}