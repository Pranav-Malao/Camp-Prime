const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res, next) => {
    try { // khud ka try-catch isliye lagaya kyuki registration me email same ya username same hone pe error page naa dike balki vahi flash ho jaye.
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registerdUser = await User.register(user, password); // this method is on User model by passport-local-mongoose isme rahega (email, _id, username, salt, hash)
        req.login(registerdUser, function (err) { // register karnee ke baad login rehne ke liye
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to yelpCamp !!');
            res.redirect('/campgrounds');
        });
    } catch (error) { // email same, username same etc
        res.flash('error', err.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = (req, res) => { // local ya google ya twitter strategy
    req.flash('success', `welcome back ${req.user.username}`);
    res.redirect(res.locals.returnTo || '/campgrounds'); // jis page pe login ke pehle the vahi redirect
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) { // req.logout func direct nhi chalta aajkal callback leta hai
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!👋🏻');
        res.redirect('/campgrounds');
    });
}