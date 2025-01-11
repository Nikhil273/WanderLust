### Steps to set-up this project on your local machine

---

First Clone this repository on your local machine using this command - <br>
`git clone` <br>
Then install all the dependencies using this command - <br>
`npm install` <br>
Then create a `.env` file in the root directory of the project and add these lines - <br>
`PORT=3000` <br>
`DB_URL=mongodb://localhost:27017/wanderlust` <br>
Then run the server using this command - <br>
`npm start` <br>
Then open your browser and go to this link - <br>
`http://localhost:3000` <br>

### Steps to set-up a `Mongoose` Database

---

First Install the Mongoose Package using this command - <br>
`npm install mongoose` <br>
Then require the Mongoose Package in your app.js or server.js or index.js file - <br>
`const mongoose = require("mongoose");` <br>
Then connect to the Mongoose Database using this command - <br>

```javascript
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
```

<br>
Then check if the connection is successful or not using this command - <br>

```javascript
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});
```

#### Use of `mongoose.populate()` to populate the data from another collection

---

If you want to populate the data from another collection then you can use `mongoose.populate()` like this - <br>

```javascript
const listing = await Listing.findById(req.params.id).populate("author");
```

This will populate the author field from the User Collection because in Listing Schema we use pass the referance of the User Collection like this - <br>

```javascript
const ListingSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
```

### Setps to set-up EJS Template Engine for Views

---

First Install the EJS Package using this command - <br>
`npm install ejs` <br>
Then set the view engine in your app.js or server.js or index.js file - <br>

```javascript
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
```

Then create a views directory in the root directory of the project and create a file with `.ejs` extension
<br>
Then render the views in your routes like this - <br>
`res.render("index.ejs");` <br>

### Use `connect-flash` to flash the messages

---

Install pacakage using `npm i connect-flash` <br>

Then require it in your app.js or server.js or index.js file <br>

```javascript
const flash = require("connect-flash");
```

Then use it in your app.js or server.js or index.js file <br>

```javascript
app.use(flash());
```

Then write this in your app.js or server.js or index.js file so that you can use this middleware to send your flash key to your ejs <br>

```javascript
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // you can define your key
  res.locals.error = req.flash("error"); // you can define your key
  next();
});
```

Then you can use it in your routes like this <br>

```javascript
req.flash("success", "Successfully Logged In");
req.flash("error", "Invalid Username or Password");
```

Then you can use it in your views like this <br>

```html
<%= success %> <%= error %>
```

<br>

### Steps to set-up a `Passport-Local` Package for Authentication

---

To Use Passport.js first install session <br>
` npm i express-session`

Install the Passport Pacakge from <br>
`npm i passport`

Install the Passport-local Pacakge to use Local (Username and password authentication) strategy from <br>`npm install passport-local`

Install the Passport-local-mongoose Package to easly integrate the mongoose model with Passport.js <br> `npm i passport-local-mongoose`

In User Model Write -

```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const User = new Schema({});
User.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", User);
```

In app.js or server.js or index.js Write

```javascript
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.use(session(sessionOptions));
app.use(passport.initialize()); //initialize passport
app.use(passport.session()); //use passport session
passport.use(new LocalStrategy(User.authenticate())); //use local strategy
passport.serializeUser(User.serializeUser()); //serialize user
passport.deserializeUser(User.deserializeUser()); //deserialize user
```

### Steps to set-up a _Passport-Local_ Package for sign-up, login and logout

---

Create a User Model with only `email` field because `username` and `password` field will automaticaly create by `Passport-Local` Package <br>

After Creating User Model, Now in Router File -

```javascript
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
```

```javascript
router.get("/signup", (req, res) => {
  res.render("usersAuth/signup.ejs");
});
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { email, username, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("usersAuth/login.ejs");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    res.redirect("/listings");
  })
);

module.exports = router;
```

#### For Authentication

Now After Creating Login and Sign-up Routes, if you want only logged in user can see the listings or can create a new listings then you can use `isAuthenticated()` built in passport function as your middleware like this -

```javascript
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be Login in first!");
    return res.redirect("/login");
  }
  next();
};
```

Now you can use this middleware in your routes like this -

```javascript
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});
```

#### To Logout User

```javascript
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/listings");
});
```

#### To Login after SignUp

Passport's `Login` Method is used to login the user after registering the user like this -

```javascript
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { email, username, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      // console.log(registeredUser);
      // Here we are logging in the user after registering
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);
```

#### For Post Login Redirect

If you want to redirect the user to the page where he was before login then you can use `req.session.returnTo` like this -

Add this code in your isLoggedIn or isAuth Middleware-

```javascript
router.get("/login", (req, res) => {
  req.session.returnTo = req.headers.referer; // this line will store the previous page url
  res.render("usersAuth/login.ejs");
});
```

```javascript
// used to store the previous page url in returnTo local variable so that we can use it in our routes
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.returnTo = req.session.redirectUrl;
  }

  next();
};
```

in your login route use this code -

```javascript
const { saveRedirectUrl } = require("../middleware/isLoggedIn.js");
router.post(
  "/login",
  saveRedirectUrl, // this is the middleware to store the previous page url
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    res.redirect(res.locals.returnTo || "/listings");
  }
);
```
