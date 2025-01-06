module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // post the current url so that we can redirect back to the page after login
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be Login in first!");
    return res.redirect("/login");
  }

  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.returnTo = req.session.redirectUrl;
  }

  next();
};