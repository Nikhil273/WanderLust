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

Then use it in your app.js or server.js or index.js file <br>

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

### Steps to set-up a _Passport-Local_ Package for Authentication

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

### Steps to set-up a _Passport-Local_ Package for sign-up and login

---

Create a User Model with only `email` field because `username` and `password` field will automaticaly create by `Passport-Local` Package <br>
