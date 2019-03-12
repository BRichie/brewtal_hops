const User = require("../db/models").User;
const userQueries = require("../db/queries.users");
const passport = require("passport");

module.exports = {
  create(req, res, next){
         let newUser = {
           email: req.body.email,
           password: req.body.password,
           passwordConfirmation: req.body.passwordConfirmation
         };
  
         userQueries.createUser(newUser, (err, user) => {
           if(err){
             req.flash("error", err);
             res.redirect("/users/sign_up");
           } else {
    
    
             passport.authenticate("local")(req, res, () => {
               req.flash("notice", "You've successfully signed in!");
               res.redirect("/");
             })
           }
         });
       },

  signInForm(req, res, next) {
    res.render("users/signin");
  },

  signIn(req, res, next) {
    passport.authenticate("local")(req, res, function () {

      if (!req.user) {
        req.flash("notice", "Sign in failed. Please try again.")
        res.redirect("/users/signin");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    });
  },

  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },
    
    signUp(req, res, next){
        res.render("users/signup");
      
    },
      create(req, res, next) {
        let newUser = {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          passwordConfirm: req.body.passwordConfirm
        };
        userQueries.createUser(newUser, (err, user) => {
          if (err) {
              req.flash("error", err);
              res.redirect("/users/signup");
          } else {
    
            passport.authenticate("local")(req, res, () => {
              req.flash("notice", `Success!!  ${user.name}  , You've successfully signed up!`);
            
              res.redirect("/users/profile");
            })
          }
        })
      },

      profile(req, res, next) {
        res.render("users/profile");
      },

index(req, res, next) {
    res.render("/");
  }
}