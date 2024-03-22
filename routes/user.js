const express = require('express');
const wrapAsync = require('../utils/catchAsync');
const passport = require('passport');
const router = express.Router();
const users = require('../controllers/users');
const { storeReturnTo } = require('../middleware');

router.get('/register', users.renderRegister);

router.post('/register', wrapAsync(users.registerUser));

router.get('/login', users.renderLogin);

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser);

router.get('/logout', users.logoutUser);

module.exports = router;