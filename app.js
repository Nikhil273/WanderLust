const express = require("express");
const app = express();
const path = require("path"); //ejs1
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const connectdb = require("./init/index.js");
const listingRoute = require("./routes/listing.routes.js");
const reviewRoute = require("./routes/review.routes.js");
const userRoute = require("./routes/userAuth.routes.js");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
require('dotenv').config()
const PORT = process.env.PORT || 3000;

const sessionOptions = {
  secret: "thisisnotagoodsecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
}

//ejs 2,3,4
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
require('dotenv').config();
connectdb();



app.get("/", (req, res) => {
  res.send("Hi, I am root");
});


app.use(session(sessionOptions));
app.use(flash()); // use before routes  so that flash messages can be used in routes

//passport configuration
app.use(passport.initialize()); //initialize passport 
app.use(passport.session()); //use passport session
passport.use(new LocalStrategy(User.authenticate())); //use local strategy
passport.serializeUser(User.serializeUser()); //serialize user
passport.deserializeUser(User.deserializeUser()); //deserialize user

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;

  next();
});

app.use("/listings", listingRoute);
app.use("/listings/:id/review", reviewRoute);
app.use("/", userRoute);


// It will show error if routes that are not defined are accessed
// app.all("*", (req, res, next) => {
//   next(new ExpressError("Page Not Found", 404));
// });


app.use((err, req, res, next) => {
  let { statusCode = 500, message } = err;
  res.render("error.ejs", { err });
  // res.status(statusCode).send(message);
});



module.exports = app;

// Only listen if not being run by Vercel
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`server is listening to port ${PORT}`);
  });
}