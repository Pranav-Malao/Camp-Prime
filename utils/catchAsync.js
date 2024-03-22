function wrapAsync (fn) { // ye bas fn leta hai aur use try-catch se wrap karke deta hai
    return (req, res, next) => {
        fn(req, res, next).catch(next); // same as .catch(error => next(error));
    }
}

module.exports = wrapAsync;