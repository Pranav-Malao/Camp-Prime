const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new.ejs');
}

module.exports.createCampground = async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', "successfully made a campground");
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
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
    const images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    campground.images.push(...images);
    await campground.save();
    const deleteImages = req.body.deleteImages;
    if (deleteImages) {
        for (let filename of deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: deleteImages } } } });

    }
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