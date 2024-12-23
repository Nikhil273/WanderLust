const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path"); //ejs1
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const connectdb = require("./init/index.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./Schema.js");
const { reviewSchema } = require("./Schema.js");
const Review = require("./models/review.js");

//ejs 2,3,4
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
require('dotenv').config();
connectdb();

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    console.log(error);
    throw new ExpressError(error.message, 400);
  }
  else {
    next();
  };

};

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log(error);
    throw new ExpressError(error.message, 400);
  }
  else {
    next();
  };
};

//Index Route
app.get("/listings", validateListing, wrapAsync(async (req, res) => {
  //  by using Listing.find({}) we are trying to fetch the all data from database
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// create route
app.post("/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    //adding data to data base and we use new Listing object bcz we follow the schema rule
    const listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listings");

  }));

//show 
app.get("/listings/:id", validateListing, wrapAsync(async (req, res) => {

  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews"); // or findOne({ id })
  if (!listing) {
    console.log("Listing not found");
  } else {
    res.render("listings/show.ejs", { listing });
  }

}));

//edit route
app.get("/listings/:id/edit", validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
  if (req.body.listeng === " ") {
    throw new ExpressError("Please enter valid data for  listing details", 400)
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id, { ...req.body.listing });
  res.redirect("/listings")
}));
//Reviews-post route
app.post("/listings/:id/review", validateReview, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  const review = new Review(req.body.review);
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  res.redirect(`/listings/${id}`);
}));



app.get("/", (req, res) => {
  res.send("Hi, I am root");
});


app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
})


app.use((err, req, res, next) => {
  let { statusCode = 500, message } = err;
  res.render("error.ejs", { err });
  // res.status(statusCode).send(message);


})





app.listen(PORT, () => {
  console.log(`server is listening to port ${PORT}`);
});