const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    const { id } = req.params; // id is the listingId from the merged params so we have to use mergeparams at the top to access the id of the listings
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) throw new ExpressError(404, "Listing Not Found");

    const { rating, comment } = req.body;

    const newReview = new Review({
        rating: parseInt(rating),
        comment,
        createdAt: new Date()
    });
    newReview.author = req.user._id;

    await newReview.save();

    listing.reviews.push(newReview._id); // push ObjectId
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success", "Review deleted Successfully!");
    res.redirect(`/listings/${id}`);
}