const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new googleStrategy({
    clientID: '502004322949-na3l2ief72sgsm7ojn8r52vo8mkegur9.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:8000/users/auth/google/callback'
},
    async function(accessToken, refreshToken, profile, done){
        // find a user
        try{
            let user = await User.findOne({email: profile.emails[0].value});
            if(user){
                // if found, set this user as req.user
                return done(null, user);
            }else{
                // if not found, create the user(sign up) and set it as req.user(sign in)
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                });

                return done(null, user);
                
            }
        }
        catch(err){
            console.log('error in google strategy-passport ', err); 
            return;
        }
    }
))

module.exports = passport;