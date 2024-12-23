const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");


router.get("/", wrapAsync(async(req,res)=>{
    const users = await User.find();
    res.render("./adminPage/admin.ejs", {users});
 
}));
router.delete("/:id", wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const delUser = await User.findByIdAndDelete(id);
    console.log(delUser);
    res.redirect("/admin");

 
}));

module.exports = router;