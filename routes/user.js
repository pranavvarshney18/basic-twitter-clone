const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/user_controller');

router.get('/profile', passport.checkAuthentication, userController.profile);

router.post('/create', userController.create);

router.post('/create-session', passport.authenticate('local', {failureRedirect: '/users/sign-in'}), userController.createSession);


router.get('/sign-up', userController.signUp);
router.get('/sign-in', userController.signIn);


module.exports = router;