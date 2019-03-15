const express = require("express");
const router = express.Router();
const recipeQueries = require("../db/queries.recipes.js");
const User = require("../db/models").User;
const Authorizer = require("../policies/application");
const helper = require('../auth/helpers');





module.exports = {



  index(req, res, next) {
    recipeQueries.getAllRecipes((err, recipes) => {


      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.render("recipes", {
          recipes
        });
      }
    })
  },
  new(req, res, next) {
    const authorized = new Authorizer(req.user).new();
    if (authorized) {
      res.render("recipes/new");
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("recipes");
    }
  },

  create(req, res, next) {
    let newRecipe = {
      title: req.body.title,
      style: req.body.style,
      ingredients: req.body.ingredients,
      directions: req.body.directions,
      userId: req.user.id
    };
    recipeQueries.addRecipe(newRecipe, (err, recipe) => {
      if (err) {
        res.redirect(500, "/recipes/new");
      } else {
        res.redirect(303, `/recipes/${recipe.id}`);
      }
    });

  },
  show(req, res, next) {


    recipeQueries.getRecipe(req.params.id, (err, recipe) => {


      if (err || recipe == null) {
        res.redirect(404, "/recipes");
      } else {
        res.render("recipes/show", {
          recipe
        });
      }
    });
  },
  edit(req, res, next) {
    recipeQueries.getRecipe(req.params.id, (err, recipe) => {
      if (err || recipe == null) {
        res.redirect(404, "/");
      } else {

        const authorized = new Authorizer(req.user, recipe).edit();

        if (authorized) {
          res.render("recipes/edit", {
            recipe
          });
        } else {
          req.flash("You are not authorized to do that.")
          res.redirect(`/recipes/${req.params.id}`)
        }
      }
    });
  },
 
  destroy(req, res, next) {
    recipeQueries.destroyRecipe(req, (err, recipe) => {
      if (err) {
        res.redirect(500, `/recipes/${recipe.id}`)
      } else {
        res.redirect(303, "/recipes")
      }
    });
  },


  update(req, res, next) {
    recipeQueries.updateRecipe(req.params.id, req.body, (err, recipe) => {
      if (err || recipe == null) {
        res.redirect(401, `/recipes/${req.params.id}/edit`);
      } else {
        res.redirect(`/recipes/${req.params.id}`);
      }
    });
  }

}