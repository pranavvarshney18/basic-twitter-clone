const express = require('express');
const router = express.Router();
const passport = require('passport');

const commentController = require('../controllers/comment_controller');

router.post('/create', passport.checkAuthentication, commentController.create);

//delete comment
router.get('/destroy/:id', passport.checkAuthentication, commentController.destroy);
//delete comment by post creator
router.get('/destroy-by-post-user/:id', passport.checkAuthentication, commentController.destoryByPostUser);

module.exports = router;