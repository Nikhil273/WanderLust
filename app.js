const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const path = require("path"); //ejs1
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const connectdb = require("./init/index.js");
const ExpressError = require("./utils/ExpressError.js");
const listingRoute = require("./routes/listing.routes.js");
const reviewRoute = require("./routes/review.routes.js");

//ejs 2,3,4
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
require('dotenv').config();

connectdb();

app.use("/listings", listingRoute);
app.use("/listings/:id/review", reviewRoute)


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