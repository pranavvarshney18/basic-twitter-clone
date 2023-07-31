const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/user_controller');
const User = require('../models/user');

//update user
router.post('/update/:id', passport.checkAuthentication, userController.update);

router.get('/profile/:id', passport.checkAuthentication, userController.profile);

router.post('/create', userController.create);

router.post('/create-session', passport.authenticate('local', {failureRedirect: '/users/sign-in'}), userController.createSession);


router.get('/sign-up', userController.signUp);
router.get('/sign-in', userController.signIn);

router.get('/sign-out', userController.destroySession);



//click on google sign in and data is fetched from there
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
//google fetches the data and sends back to server
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), userController.createSession);


module.exports = router;