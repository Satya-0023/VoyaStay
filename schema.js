//schemas.js
const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "Title is required."
    }),
    description: Joi.string().required().messages({
      "string.empty": "Description is required."
    }),
    // image: Joi.string().uri().required().messages({
    //   "string.empty": "Image URL is required.",
    //   "string.uri": "Image must be a valid URL."
    // }),
    price: Joi.number().min(0).required().messages({
      "number.base": "Price must be a number.",
      "number.min": "Price must be a positive value."
    }),
    location: Joi.string().required().messages({
      "string.empty": "Location is required."
    }),
    country: Joi.string().required().messages({
      "string.empty": "Country is required."
    }),
  }).required()
});

module.exports.reviewSchema = Joi.object({
  comment: Joi.string().required().messages({
    "string.empty": "Comment is required."
  }),
  rating: Joi.number().min(1).max(5).required().messages({
    "number.base": "Rating must be a number.",
    "number.min": "Rating must be at least 1.",
    "number.max": "Rating must be at most 5."
  }),
});