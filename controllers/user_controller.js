
module.exports.profile = (req, res, next) => {
    return res.render('user_profile', {
        title: "Profile"
    });
};

