
module.exports.home = function(req, res, next){
    return res.render('home', {
        title: 'home',
    });
}