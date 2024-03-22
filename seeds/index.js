const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 20; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 2000) + 500;
        const camp = new Campground({
            author: '65f84346b56e8dace596a21d',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore tenetur quaerat ullam ducimus autem distinctio laudantium tempora cum quam dolorem hic quidem nisi eius, esse adipisci quod fugit quibusdam nulla!',
            price: price,
            images: [
                {
                  url: 'https://res.cloudinary.com/decl0mrio/image/upload/v1711117248/YelpCamp/d5gcb4nrjsyjcwbvlzgf.jpg',
                  filename: 'YelpCamp/d5gcb4nrjsyjcwbvlzgf'
                },
                {
                  url: 'https://res.cloudinary.com/decl0mrio/image/upload/v1711117249/YelpCamp/lifh1wjlfiu8objcytg6.jpg',
                  filename: 'YelpCamp/lifh1wjlfiu8objcytg6'
                }
            ]
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})