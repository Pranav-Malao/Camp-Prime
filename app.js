if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path'); // har jagah se access karne ke liye
const mongoose = require('mongoose');
const methodOverride = require('method-override'); // for put, delete request
const ejsMate = require('ejs-mate');  // for boilerplate
const ExpressError = require('./utils/ExpressErrors');
const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport'); // passport ke 3 chize
const localStrategy = require('passport-local'); // iski jagah google ka bhi le sakte
const User = require('./models/user');

const userRoutes = require('./routes/user');
const campgroundRoutes = require('./routes/campground'); // campground routes
const reviewRoutes = require('./routes/review');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
mongoose.connection.on('error', console.error.bind(console, "connection error:"));
mongoose.connection.once('open', () => {
    console.log("Database connected");
});

app.use(express.urlencoded({ extended: true }));  // for parsing form data
app.use(methodOverride('_method'));  // for put, delete request
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // a week
        maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());  // passport ki 5 chize
app.use(passport.session());
passport.use(new localStrategy(User.authenticate())); // hey passport use the local strategy that we imported and uss localstrategy ke liye authentication method locate hogi User model me,
// lekin apanne toh banayi nahi, actually vo plugin ne di hai
passport.serializeUser(User.serializeUser()); // user ko store karna session me
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.engine('ejs', ejsMate); // for boilerplate
app.set('view engine', 'ejs'); // ejs
app.set('views', path.join(__dirname, 'views'));

app.use('/', userRoutes);
app.use('/', campgroundRoutes); // campgroud routes running
app.use('/campgrounds/:id/reviews', reviewRoutes); //review routes running

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) {
        err.message = "Something went wrong";
    }
    res.status(status).render('campgrounds/error', { err });
})
app.listen(3000, () => {
    console.log('listening on port 3000');
});