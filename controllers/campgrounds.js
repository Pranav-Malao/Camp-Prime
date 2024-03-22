const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    rand01 = Math.round(Math.random());
    res.render('campgrounds/index.ejs', { campgrounds, rand01 });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new.ejs');
}

module.exports.createCampground = async (req, res) => {
    const newCampground = new Campground(req.body.campground); // form me campground[title].. hai isse campground se sab link ho gya ab ek hi variable me sab refer ho jayenge.
    newCampground.images = req.files.map(file => ({url: file.path, filename: file.filename})); //req.files if from multer, it contains the uploaded files
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', "successfully made a campground");
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews', // reviews ko populate karo aur har review pe unka author populate karo
        populate: {
            path: 'author'
        }
    }).populate('author'); // reviews ko daal diya objectId ki jagah (populate), campground ke authors
    if (!campground) {
        req.flash('error', "can't find that campground");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show.ejs', { campground });
}

module.exports.renderEditCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', "can't find that campground to edit");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const images = req.files.map(file => ({url: file.path, filename: file.filename}));//array
    campground.images.push(...images); // kyuki apane ko array nahi daalna, usko spread karo
    await campground.save();
    req.flash('success', "successfully edited a campground");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', "can't find that campground to edit");
        return res.redirect('/campgrounds');
    }
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "successfully deleted a campground");
    res.redirect('/campgrounds');
}