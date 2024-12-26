const express=require("express");
const app=express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

// do not share this on production
if(process.env.NODE_ENV != "production"){
  require('dotenv').config(); 
}


//routers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
app.get("/",(req, res)=>{    //root route would redirect to '/listings' route
  res.redirect ('/listings');
});
const dbUrl = process.env.ATLASDB_URL;

//for session and flash
const session = require("express-session");
const MongoStore = require("connect-mongo"); //for production level
const flash = require("connect-flash");

//for authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


// app.get("/testsample", async (req,res)=>{
//     let sampleData = new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location: "Goa",
//         country:"India",
//     });
//    await sampleData.save();
//    res.send("successful");
// });



async function main() {
  // await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
  await mongoose.connect(dbUrl);
}

main().then(res=>{
    console.log("Database successfully connected");
}).catch(err=>{
    console.log(err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static("/public"));

const store= MongoStore.create({
  mongoUrl: dbUrl,   //session info will store in atlas
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter : 24 * 3600 , //in sec

});

store.on("error", ()=>{
  console.log("error in atlas session store", err);
})
const sessionOptions = {
  store,    //for cloud env
  secret : process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie :{
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,  
    maxAge : 7 * 24 * 60 * 60 * 1000,   //in ms
    httpOnly : true, // for security, search crossScripting
  },
};




//using flash 
app.use(session(sessionOptions)); 
app.use(flash());  //has to be before all routes

// session mw should be executed before this line, as it requires session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash middleware
app.use((req, res, next)=>{   
   res.locals.success = req.flash("success"); //create route in listing.js and index.ejs
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user; //to pass user info to ejs file, as req.user is not accessible in ejs directly.
   next();
});

// // | create a demo user |

// app.get("/demouser" ,async(req,res)=>{
//   let fakeUser = new User({
//     email: "demouser@gmail.com",
//     username:"demo-user",
//   });

// let registeredUser= await User.register(fakeUser,"helloworld");
// // register is a static method, it checks if username is unique.
// res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
// app.use("/admin", adminRouter);

// for non-existing route
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
});
  
//client side error handling middleware
app.use((err,req,res,next)=>{
  let{statusCode=500, message="something went wrong"}=err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
});



app.listen(8080,(req,res)=>{
    console.log("app is lisenning");
});

