const Joi = require('joi');

module.exports.campgroundValidateSchema = Joi.object({ //campground ek object hoga aisa bataya gaya hai
    campground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        // image: Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.reviewsValidateSchema = Joi.object({ //campground ek object hoga aisa bataya gaya hai
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});