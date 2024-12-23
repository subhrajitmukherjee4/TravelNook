const User = require("../models/user.js");


module.exports.renderSignupForm = (req,res)=>{
    res.render("./users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser= await User.register(newUser, password); //register method is a async method
        console.log(registeredUser);
        // automatically login
        req.login(registeredUser, (err)=>{
            if(err){
               return next(err);
            }
            req.flash("success",`Welcome ${req.user.username}`);
            res.redirect("/listings");
        });
       
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
 
};

module.exports.renderLoginForm= (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = 
 async (req,res) => {
    req.flash("success",` Welcome back ${req.user.username}!`);
    let redirectUrl = res.locals.redirectUrl || '/listings'
    res.redirect(redirectUrl);
    };

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    });
};