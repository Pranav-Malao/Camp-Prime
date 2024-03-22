const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.newReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review) // kyuki sab review[] me hai
    review.author = req.user._id; // review ka owner
    campground.reviews.push(review); // one campground me multiple comments ki sirf ids populate karenge tab original data aayega.
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //pull operator removes an object id from the array of object ids of review, which matches a condition
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}