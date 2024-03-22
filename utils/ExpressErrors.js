class ExpressError extends Error { // khud ki error class
    constructor (message, status){
        super();
        this.message = message;
        this.status = status;
    }
}
module.exports = ExpressError;