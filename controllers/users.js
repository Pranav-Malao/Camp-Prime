const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registerdUser = await User.register(user, password);
        req.login(registerdUser, function (err) {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to yelpCamp !!');
            res.redirect('/campgrounds');
        });
    } catch (error) {
        res.flash('error', err.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = (req, res) => {
    req.flash('success', `welcome back ${req.user.username}`);
    res.redirect(res.locals.returnTo || '/campgrounds');
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!👋🏻');
        res.redirect('/campgrounds');
    });
}