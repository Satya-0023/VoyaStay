const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { cloudinary, storage } = require("../cloudconfig.js");
const upload = multer({ storage }); // Configure multer to store files in the 'uploads' directory

router
    .route("/")
    .get( wrapAsync(listingController.index))
    .post( isLoggedIn,upload.single('listing[image]'),validatelisting, wrapAsync(listingController.createListing));

router.get("/new", isLoggedIn, listingController.renderNewForm);
//keep the new route above this bcz it got confuse for /new it search like id 
router
    .route("/:id")
    .get( wrapAsync(listingController.renderShowForm))
    .put(isLoggedIn, isOwner,upload.single('listing[image]'), validatelisting, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;