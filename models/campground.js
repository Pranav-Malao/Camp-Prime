const mongoose = require('mongoose');
const review = require('./review');

const CampgroundSchema = new mongoose.Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    price: Number,
    description: String,
    location: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

//if a camp deleted then delete all reviews associated to it
CampgroundSchema.post('findOneAndDelete', async function (doc) { // mongoose query middleware, ye chalega jab findOneAndDelete ye query hit hogi
    if (doc) {
        await review.deleteMany({
            _id: {$in: doc.reviews}
        })
    } // uss doc ko lo jo delete hua, aur reviews me se deleteMany kar do unko jinki _id doc.reviews me thi

})

module.exports = mongoose.model('Campground', CampgroundSchema);