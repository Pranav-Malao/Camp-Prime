const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage }) 


router.get('/', (req, res) => {
    res.render('home');
});

router.get('/campgrounds', wrapAsync(campgrounds.index));

router.get('/campgrounds/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/campgrounds', isLoggedIn, upload.array('image'), validateCampground, wrapAsync(campgrounds.createCampground));

router.get('/campgrounds/:id', wrapAsync(campgrounds.showCampground));

router.get('/campgrounds/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditCampground));

router.put('/campgrounds/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, wrapAsync(campgrounds.editCampground));

router.delete('/campgrounds/:id', isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground));

module.exports = router;