const Recipe = require("./models").Recipe;
const User = require("./models").User;
const Authorizer = require("../policies/application");
const helper = require('../auth/helpers');


module.exports = {


  getAllRecipes(callback) {
    return Recipe.all()


      .then((recipes) => {
        callback(null, recipes);
      })
      .catch((err) => {
        callback(err);
      })
  },
  getRecipe(id, callback) {
    return Recipe.findById(id)
      .then((recipe) => {

        callback(null, recipe);
      })
      .catch((err) => {
        callback(err);
      })
  },

  addRecipe(newRecipe, callback) {
    return Recipe.create({
        title: newRecipe.title,
        style: newRecipe.style,
        ingredients: newRecipe.ingredients,
        directions: newRecipe.directions,
        userId: newRecipe.userId
      })
      .then((recipe) => {
        callback(null, recipe);
      })
      .catch(err => {
        callback(err);
      });
  },
  destroyRecipe(req, callback) {

    return Recipe.findById(req.params.id)
        .then((recipe) => {
            const authorized = new Authorizer(req.user, recipe).destroy();

            if (authorized) {
                recipe.destroy()
                    .then((res) => {
                        callback(null, recipe);
                    });
            } else {
                req.flash("notice", "You are not authorized to do that.")
                callback(401);
            }
        })
        .catch((err) => {
            callback(err);
        });
},
  

  updateRecipe(req, updatedRecipe, callback) {
    return Recipe.findById(req.params.id)
      .then((recipe) => {
        if (!recipe) {
          return callback("Recipe not found");
        }
        const authorized = new Authorizer(req.user, recipe).update();
        if (authorized) {
          recipe.update(updatedRecipe, {
              fields: Object.keys(updatedRecipe)
            })
            .then(() => {
              callback(null, recipe);
            })
            .catch((err) => {
              callback(err);
            });
        }
      });

  }

}