const User = require('../models/user');

module.exports.profile = (req, res, next) => {
    return res.render('user_profile', {
        title: "Profile"
    });
};

//to create new user
module.exports.create = (req, res, next) =>{
    //check if password and confirm password are same 
    if(req.body.password != req.body["confirm-password"]){
        console.log('password and confirm password are not matching');
        return res.redirect('back');
    }
    // console.log('body', req.body);
    //check if the email is unique
    User.findOne({email: req.body.email})
    .exec()
    .then(user => {
        
        if(!user){
            //create user
            User.create(req.body)
                .then(newUser => {
                    console.log('new user created', newUser);
                    return res.redirect('/users/sign-in');
                })
                .catch(err => {
                    console.log('error in creating new user', err);
                    return res.redirect('back');
                })
        }
        else{
            console.log('This user already exists');
            return res.redirect('back');
        }
    })
    .catch(err => {
        console.log('error in creating new user');
        return res.redirect('back');
    })
}


module.exports.createSession = (req, res, next) => {
    return res.redirect('/');
}




//sign up page
module.exports.signUp = (req, res, next) => {
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    res.render('user_sign_up',{
        title: 'Sign Up'
    });
}

//sign in page
module.exports.signIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    res.render('user_sign_in', {
        title: 'Sign In'
    });
}
