const express = require('express');
const router = express.Router();

let likeController = require('../controllers/like_controller');

router.post('/toggle', likeController.toggleLike);

module.exports = router;