const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "List you requested is not found!");
        return res.redirect("/listings");
    }
    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing , originalImage});
}

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // this is used when a new listing is added the owned by tag is added as the username
    newListing.image = { url, filename }; // Set the image URL and filename
    if (!req.file) {
        req.flash("error", "Image upload is required.");
        return res.redirect("/listings/new");
    }
    await newListing.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const price = req.body.listing.price;

    if (price < 0)
        throw new ExpressError(400, "The price should be positive");

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename }; // Update the image URL and filename
        await listing.save();
    }
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) throw new ExpressError(404, "Listing Not Found");
    req.flash("success", "Listing deleted Successfully!");
    res.redirect("/listings");
}

module.exports.renderShowForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "List you requested is not found!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing , mapToken: process.env.MAP_TOKEN });
}