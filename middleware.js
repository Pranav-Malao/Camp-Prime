const ExpressError = require('./utils/ExpressErrors');
const Campground = require('./models/campground');
const Review = require('./models/review');
const { campgroundValidateSchema, reviewsValidateSchema } = require('./schemas/schemas');

module.exports.isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // yaha par save kar liya url
        req.flash('error', 'You must be logged in first !');
        return res.redirect('/login');
    } else {
        next();
    }
}

module.exports.storeReturnTo = (req, res, next) => {

    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
    // console.log(req.session.returnTo, res.locals.returnTo);
} // jaise apan bina login ke chalarahe app, aur appanne newcamp page khola toh vo login pe redirect hoga, phir login ke baad sab(session) reset ho jata hai. Lekin apan ko newcamp pe aana chahiye tha (for good UX), so apan original URL ko save kar lenge before hand and phir login ke baad vaha redirect kar denge.
// req.session.returnTo variable me url hai par refresh ke baad chala jata hai so use this middleware for saving it to req.locals.returnTo
// actually locals clear ho jata hai har req-res cycle ke baad, so pehle value session me thi, phir session clear hone par locals me dali kyuki 2 instructions ho rahe hai. Direct locals me dala toh gayab ho jayegi value.


module.exports.validateCampground = (req, res, next) => { // server side validation of campground middleware
    const { error } = campgroundValidateSchema.validate(req.body); //campgroundValidateSchema imported hai (Joi stuff)
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'you dont have permission!!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'you dont have permission!!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => { // server side validation of review middleware
    const { error } = reviewsValidateSchema.validate(req.body); //reviewValidateSchema imported hai (Joi se validate kiya)
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
