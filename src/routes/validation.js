module.exports = {
  validateUsers(req, res, next) {

    if(req.method === "POST") {
      
      req.checkBody("email", "must be a valid address").isEmail();
      req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6});
      req.checkBody("passwordConfirm", "must match password").optional().matches(req.body.password);
    }

    const errors = req.validationErrors();

    if (errors) {

      req.flash("error", errors);
      return res.redirect(req.headers.referer)
    } else {
      return next();
    }
  }
}
