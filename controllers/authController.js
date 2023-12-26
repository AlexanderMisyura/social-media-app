const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");

module.exports = {
  getLogin: (req, res) => {
    res.render("login", {
      layout: "narrow",
      title: "Socister | Login",
      validationErrors: req.flash("validationErrors"),
      authErrors: req.flash("authErrors"),
    });
  },

  getSignup: (req, res) => {
    res.render("signup", {
      layout: "narrow",
      title: "Socister | Signup",
      validationErrors: req.flash("validationErrors"),
      duplicationErrors: req.flash("duplicationErrors"),
    });
  },

  postLogin: (req, res, next) => {
    const validationErrors = { emailErrors: [], passwordErrors: [] };

    if (!validator.isEmail(req.body.email)) {
      validationErrors.emailErrors.push({
        msg: "Please, enter a valid email address",
      });
    }
    if (validator.isEmpty(req.body.password)) {
      validationErrors.passwordErrors.push({
        msg: "Password cannot be blank",
      });
    }

    if (
      validationErrors.emailErrors.length ||
      validationErrors.passwordErrors.length
    ) {
      req.flash("validationErrors", validationErrors);
      return res.redirect("/login");
    }

    req.body.email = validator.normalizeEmail(req.body.email, {
      gmail_remove_dots: false,
    });

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash("authErrors", info);
        return res.redirect("/login");
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", { msg: "Success! You are logged in." });
        res.redirect(req.session.returnTo || "/");
      });
    })(req, res, next);
  },

  postSignup: (req, res, next) => {
    const validationErrors = {
      userNameErrors: [],
      emailErrors: [],
      passwordErrors: [],
    };

    if (!validator.isLength(req.body.userName, { min: 3, max: 30 })) {
      validationErrors.userNameErrors.push({
        msg: "Username must be a minimum of 3 and a maximum of 30 characters long",
      });
    }
    if (!validator.isEmail(req.body.email)) {
      validationErrors.emailErrors.push({
        msg: "Please enter a valid email address",
      });
    }
    if (!validator.isLength(req.body.password, { min: 8 })) {
      validationErrors.passwordErrors.push({
        msg: "Password must be at least 8 characters long",
      });
    }
    if (req.body.password !== req.body.confirmPassword) {
      validationErrors.passwordErrors.push({ msg: "Passwords do not match" });
    }

    if (
      validationErrors.emailErrors.length ||
      validationErrors.passwordErrors.length
    ) {
      req.flash("validationErrors", validationErrors);
      return res.redirect("/signup");
    }
    req.body.email = validator.normalizeEmail(req.body.email, {
      gmail_remove_dots: false,
    });

    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    });

    User.findOne(
      { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
      (err, existingUser) => {
        if (err) {
          return next(err);
        }
        if (existingUser) {
          req.flash("duplicationErrors", {
            msg: "Account with this email address or username already exists",
          });
          return res.redirect("/signup");
        }
        user.save((err) => {
          if (err) {
            return next(err);
          }
          req.logIn(user, (err) => {
            if (err) {
              return next(err);
            }
            res.redirect("/");
          });
        });
      }
    );
  },

  getLogout: (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  },
};
