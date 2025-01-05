### Steps to set-up a _Passport-Local_ Package for Authentication

---

To Use Passport.js first install session <br>
` npm i express-session`

Install the Passport Pacakge from <br>
`npm i passport`

Install the Passport-local Pacakge to use Local (Username and password authentication) strategy from <br>`npm install passport-local`

Install the Passport-local-mongoose Package to easly integrate the mongoose model with Passport.js <br> `npm i passport-local-mongoose`

In User Model Write -

```
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const User = new Schema({});
User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);
```

In app.js or server.js or index.js Write

```
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
```

```
app.use(session(sessionOptions));
app.use(passport.initialize()); //initialize passport
app.use(passport.session()); //use passport session
passport.use(new LocalStrategy(User.authenticate())); //use local strategy
passport.serializeUser(User.serializeUser()); //serialize user
passport.deserializeUser(User.deserializeUser()); //deserialize user
```
