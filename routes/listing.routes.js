const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../Schema.js");



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

//Index Route
router.get("/", validateListing, wrapAsync(async (req, res) => {
  //  by using Listing.find({}) we are trying to fetch the all data from database
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// new route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show 
router.get("/:id", validateListing, wrapAsync(async (req, res) => {

  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews"); // or findOne({ id })
  if (!listing) {
    req.flash("error", "Listing you are looking for is not available");
    res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", { listing });
  }

}));

// create route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
  //adding data to data base and we use new Listing object bcz we follow the schema rule
  const listing = new Listing(req.body.listing);
  await listing.save();
  req.flash("success", "Successfully made a new listing!");
  res.redirect("/listings");

}));

//edit route
router.get("/:id/edit", validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you are looking for is not available");
    res.redirect("/listings");
  } else {
    res.render("listings/edit.ejs", { listing });
  }

}));

//update route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
  if (req.body.listing === " ") {
    throw new ExpressError("Please enter valid data for  listing details", 400)
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Successfully made an update in listing!");
  res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id, { ...req.body.listing });
  req.flash("success", "Listing Deleted Succesfully!");
  res.redirect("/listings")
}));



module.exports = router;