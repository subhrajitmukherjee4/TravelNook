const express = require("express");
const router = express.Router({mergeParams:true}); //mergeParams - to get id values from parent route from app.js
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const reviewController = require("../controllers/review.js");

const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");


//post review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
  
  //delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,  wrapAsync(reviewController.destroyReview));


module.exports = router;