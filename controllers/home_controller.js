const Post = require('../models/post');
const User = require('../models/user');


//home page
module.exports.home = function(req, res, next){
    Post.find()
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })
        .exec()
        .then(posts => {
            return res.render('home', {
                title: 'home', 
                posts: posts
            });
        })
        .catch(err => {
            console.log('error in fetching all the posts', err);
            return res.end('<h4>page is not working properly</h4>')
        })
};