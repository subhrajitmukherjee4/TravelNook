const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");


//server side data validation using Joi
module.exports.validateListing = (req,res, next)=>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//validate for review
module.exports.validateReview = (req,res, next)=>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
module.exports.isLoggedIn = (req,res, next)=>{
  // console.log(req);
    if(!req.isAuthenticated()){

        //to get the originalUrl value of req obj.
        req.session.redirectUrl = req.originalUrl; // we made a new parameter 'redirectUrl' inside session mw
        req.flash("error","you must be logged in to create a listing");
        return res.redirect("/login"); // if we dont write return,"cannot set header error will appear"
      }
      next();
}
// | when we try to login, any value passed by session erased by passport, 
// but if we save redirectUrl in local variable then passport don't has access to it.

module.exports.saveRedirectUrl = (req, res, next) =>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async(req,res,next)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){  //for server side authorization
      req.flash("error","you don't have access to this listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
  let {id, reviewId} = req.params;
  let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){  //for server side authorization
      req.flash("error","you don't have access to this review");
      return res.redirect(`/listings/${id}`);
    }
    next();
}