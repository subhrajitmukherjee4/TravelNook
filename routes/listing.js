const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingControllers = require("../controllers/listings.js");

const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage}); 
// const upload = multer({dest:'uploads/'}); //it will create a folder 'uploads' in local and save the file data there.

//router.route("path")
 router.route("/")
 // All are listing router
 .get( wrapAsync(listingControllers.index))
 //Create Route
 .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingControllers.createListing)) ; //for normal data


//New Route-> keep this before show route otherwise 'new' will be considered as 'id'
router.get("/new", isLoggedIn, listingControllers.renderNewForm);

router.route("/:id")

 //Show Route
 .get( wrapAsync(listingControllers.showListing))

 //Update Route
 .put(isLoggedIn, isOwner,  upload.single("listing[image]"), validateListing, wrapAsync(listingControllers.updateListing))

 //Delete Route
 .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.deleteListing))


  //Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingControllers.renderEditForm));
  
  

 

module.exports = router;