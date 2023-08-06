const express = require('express');
const router = express.Router();
const passport = require('passport');

const friendship_controller = require('../controllers/friendship_controller');

router.post('/add-remove-friend/:friendId', passport.checkAuthentication, friendship_controller.toggleFriendship);

module.exports = router;