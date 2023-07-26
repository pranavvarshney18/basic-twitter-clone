const User = require('../models/user');

module.exports.profile = (req, res, next) => {
    User.findById(req.params.id)
        .exec()
        .then(user => {
            return res.render('user_profile', {
                title: "Profile",
                profile_user: user    //we would avoid using "user" as a key as it is already a global variable as locals.user
            });
        })
        .catch(err => {
            req.flash('error', 'unable to fetch user info');
            console.log('unable to fetch user info', err);
            return res.redirect('back');
        });
    
};

//to create new user
module.exports.create = async (req, res, next) => {
    try{
        //check if password and confirm password are same
        if(req.body.password != req.body["confirm-password"]){
            req.flash('error', 'password and confirm password are not matching');
            console.log('password and confirm password are not matching');
            return res.redirect('back');
        }

        let user = await User.findOne({email: req.body.email});

        if(user){
            req.flash('error', 'This user already exists');
            console.log('This user already exists');
            return res.redirect('back');
        }
        else{
            //create new user
            let newUser = await User.create(req.body);
            req.flash('success', 'New user created !!!');
            console.log('New user created !!!', newUser);
            return res.redirect('/users/sign-in');
        }
    }
    catch(err){
        req.flash('error', 'error in creating new user');
        console.log('error in creating new user', err);
        return res.redirect('back');
    }
}


module.exports.createSession = (req, res, next) => {
    req.flash('success', 'logged in successfully');
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


//sign out
module.exports.destroySession = (req, res, next) => {
    //predefined function in passport
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'you have logged out');
        res.redirect('/');
      });

}


//update user
module.exports.update = (req, res, next) => {
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id, req.body)
            .exec()
            .then(updatedUser => {
                req.flash('success', 'profile updated successfully');
                return res.redirect('back');
            })
            .catch(err => {
                req.flash('error', 'error in updating user profile');
                console.log('error in updating user profile', err);
                return res.status(401).send('Unauthorised');
            })
    }
}
