const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const reviewControllers = require("../controllers/user.js");
const { saveRedirectUrl } = require("../middleware.js");

router.route("/signup")
   // | for signup |
.get(reviewControllers.renderSignupForm)
.post(wrapAsync(reviewControllers.signup));


router.route("/login")
// | for login |
.get( reviewControllers.renderLoginForm)

.post(saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login", 
    failureFlash: true,
}), 
reviewControllers.login);

// |for logout |
router.get("/logout", reviewControllers.logout);

module.exports = router;