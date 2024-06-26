if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path'); 
const mongoose = require('mongoose');
const methodOverride = require('method-override'); 
const ejsMate = require('ejs-mate');  
const ExpressError = require('./utils/ExpressErrors');
const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport'); 
const localStrategy = require('passport-local'); 
const User = require('./models/user');

const userRoutes = require('./routes/user');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
mongoose.connection.on('error', console.error.bind(console, "connection error:"));
mongoose.connection.once('open', () => {
    console.log("Database connected");
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', userRoutes);
app.use('/', campgroundRoutes); 
app.use('/campgrounds/:id/reviews', reviewRoutes); 

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