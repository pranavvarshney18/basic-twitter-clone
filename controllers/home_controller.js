const Post = require('../models/post');
const User = require('../models/user');


//home page
module.exports.home = async function(req, res, next){
    try{
        let posts = await Post.find()
                        .sort('-createdAt')
                        .populate('user')
                        .populate({
                            path: 'comments',
                            populate: {
                                path: 'user'
                            },
                            populate:{
                                path: 'likes'
                            },
                            options: {sort: '-createdAt'}
                        })
                        .populate('likes');

        let users = await User.find();
        
        //to get friends of signed in user
        let profile_user = null;
        if(req.user){
            profile_user = await User.findById(req.user.id)
                            .populate('friends', 'name');
        }

        return res.render('home', {
            title: 'home',
            posts: posts,
            all_users: users,
            profile_user: profile_user
        });
    }
    catch(err){
        req.flash('error', 'error in fetching the posts');
        console.log('error in fetching all the posts', err);
        return res.end('<h4>page is not working properly</h4>');
    }
};




