const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
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
const router = require("./routes/listing.routes.js");


//ejs 2,3,4
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
require('dotenv').config();

connectdb();

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

app.use("/listings", router);

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
// Delte Review
app.delete("/listings/:id/review/:reviewId", wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  console.log(id, reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
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