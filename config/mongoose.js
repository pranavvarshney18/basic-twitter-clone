const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/twitter_clone_1');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error coonnecting to mongoDB'));
db.once('open', () => {
    console.log('connected to database :: MongoDB');
});

module.exports = db;