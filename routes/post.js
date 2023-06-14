const express = require('express');
const router = express.Router();
const passport = require('passport');

const postController = require('../controllers/post_controller');

//to create post
router.post('/create', passport.checkAuthentication, postController.create);

//to delete post
router.get('/destroy/:id', passport.checkAuthentication, postController.destroy);

module.exports = router;