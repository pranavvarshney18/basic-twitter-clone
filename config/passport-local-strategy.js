const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

//authentication using passport 
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true, //this allow us to set the first argument of the below function as 'req', helping us to use 'req.flash()'
    },
    function(req, email, password, done){
        User.findOne({email: email})
            .exec()
            .then(user => {
                // console.log(user);
                if(!user || user.password != password){
                    req.flash('error', 'Invalid credentials');
                    console.log('Invalid credentials');
                    return done(null, false);
                }

                return done(null, user);
            })
            .catch(err => {
                req.flash('error', 'error in finding user');
                console.log('error in finding user --> Passport', err);
                return done(err);
            })
    }
));

//serializing the user, which decides what to keep in cookies
passport.serializeUser((user, done)=>{
    done(null, user.id);
});

//de-serializing the user from the key in the cookies
//this is done when the request reaches the server or db
passport.deserializeUser((id, done) => {
    User.findById(id)
        .exec()
        .then(user => {
            return done(null, user);
        })
        .catch(err => {
            console.log('error in finding the user in deserialize function --> Passport', err);
            return done(err);
        })
});

//middleware to check if user is authenticated or not, and if not then send to sign-in page
passport.checkAuthentication = (req, res, next) => {
    if(req.isAuthenticated()){
        return next(); //calling next is imp for middleware otherwise it wont go to next middleware
    }
    else{
        return res.redirect('/users/sign-in');
    }
}

//middleware, if user is signed in, then user data is sent to passport which will be used in views
passport.setAuthenticatedUser = (req, res, next) => {
    if(req.isAuthenticated()){
        res.locals.user = req.user; //locals is a global variable in views
    }
    return next();
}



module.exports = passport;























