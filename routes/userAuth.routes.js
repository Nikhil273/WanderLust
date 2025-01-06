const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');

router.get("/signup", (req, res) => {
  res.render("usersAuth/signup.ejs");
});
router.post("/signup", wrapAsync(async (req, res) => {
  try {
    let { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });

  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
}));

router.get("/login", (req, res) => {
  res.render("usersAuth/login.ejs");
});

router.post("/login", passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), wrapAsync(async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust");
  res.redirect("/listings");
}));

router.get("/logout", (req, res, next) => {
  req.flash("success", "You are Logged Out!");
  req.logout((err) => {
    if (err) return next(err);
  });
  res.redirect("/listings");
});



module.exports = router;