const express = require("express");
const router = express.Router({ mergeParams: true }); // Merge params to access listingId in review routes
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { validatereview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
//reviews routes
//const Review = require("./models/review.js");

router.post("/", isLoggedIn, validatereview, wrapAsync(reviewController.createReview));

// Delete a review from a listing
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;