//this middleware is used for the authentication require to access the page 
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) { // it is use forthe authentication required to add a listing but this fails to redirect to the listing page bcz here this if is not triggred 
    req.session.redirectUrl = req.originalUrl;
    
    req.flash("error", "You must be logged in to access the page.");
    return res.redirect("/login");
    }
    next();
}

// this is generally to used to store the redirecturl in the locals to access in the other page
// as soon as the user is logged in, it will redirect to the page where the user was trying to go
module.exports.savedRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

//this middleware generally checks that the owner of the listing can only make changes on the listings

module.exports.isOwner = async (req,res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)) {
      req.flash("error","You are not the owner of this listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

//validatelisting middleware
module.exports.validatelisting = async (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

//validatelisting review middleware
module.exports.validatereview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};


module.exports.isReviewAuthor = async (req,res,next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)) {
      req.flash("error","Can't delete,You are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }
    next();
}