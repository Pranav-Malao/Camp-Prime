const express = require('express');
const router = express.Router({ mergeParams: true }); // router yaha jo hai uske req.params alag hai aur app.js ke alag so unko merge karne ke liye


const wrapAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');

// reviews routes, (one to many)
router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.newReview));

// router.put('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//     const review = await Review.findByIdAndUpdate(reviewId, req.body.review );
//     res.redirect(`/campgrounds/${id}`);
// }));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview));

module.exports = router;