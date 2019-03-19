const sequelize = require("../../src/db/models/index").sequelize;
const Recipe = require("../../src/db/models").Recipe;
const User = require("../../src/db/models").User;
const Comment = require("../../src/db/models").Comment;

describe("Comment", () => {

  beforeEach((done) => {
    this.user;
    this.recipe;
    this.comment;

    sequelize.sync({
      force: true
    }).then((res) => {

      User.create({
          name: "Bowie",
          email: "starman@tesla.com",
          password: "Trekkie4lyfe",
        })
        .then((user) => {
          this.user = user;

          Recipe.create({
              title: "Galaxy HopShip",
              style: "Triple IPA",
              ingredients: "hops",
              directions: "brew",
              userId: this.user.id
            })
            .then((recipe) => {
              this.recipe = recipe;


              Comment.create({
                  body: "ay caramba!!!!!",
                  userId: this.user.id,
                  recipeId: this.recipe.id
                })
                .then((comment) => {
                  this.comment = comment;
                  done();
                })
                .catch((err) => {
                  console.log(err);
                  done();
                });
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        });
    });
  });

  //test suite
  describe("#create()", () => {

    it("should create a comment object with a body, assigned recipe and user", (done) => {
      Comment.create({
          body: "The geological kind.",
          recipeId: this.recipe.id,
          userId: this.user.id
        })
        .then((comment) => {
          expect(comment.body).toBe("The geological kind.");
          expect(comment.recipeId).toBe(this.recipe.id);
          expect(comment.userId).toBe(this.user.id)
          done();

        })
        .catch((err) => {
          console.log(err);
          done();
        });
    });


    it("should not create a comment with missing body, assigned post or user", (done) => {
      Comment.create({
          body: "Are the inertial dampers still engaged?"
        })
        .then((comment) => {

          // the code in this block will not be evaluated since the validation error
          // will skip it. Instead, we'll catch the error in the catch block below
          // and set the expectations there

          done();

        })
        .catch((err) => {

          expect(err.message).toContain("Comment.userId cannot be null");
          expect(err.message).toContain("Comment.recipeId cannot be null");
          done();

        })
    });

  });

  describe("#setUser()", () => {

    it("should associate a comment and a user together", (done) => {

      User.create({
          name: "bernie",
          email: "bern@2020.com",
          password: "password"
        })
        .then((newUser) => {

          expect(this.comment.userId).toBe(this.user.id); // confirm the comment belongs to another user

          this.comment.setUser(newUser) // then reassign it
            .then((comment) => {

              expect(comment.userId).toBe(newUser.id);
              done();

            });
        })
    });

  });

  describe("#getUser()", () => {

    it("should return the associated user", (done) => {

      this.comment.getUser()
        .then((associatedUser) => {
          expect(associatedUser.email).toBe("starman@tesla.com");
          done();
        });

    });

  });

  describe("#setRecipe()", () => {

    it("should associate a recipe and a comment together", (done) => {

      Recipe.create({
          title: "Galaxy HopShip",
          style: "Triple IPA",
          ingredients: "hops",
          directions: "brew",
          recipeId: this.recipe.id,
          userId: this.user.id
        })
        .then((newRecipe) => {

          expect(this.comment.recipeId).toBe(this.recipe.id);

          this.comment.setRecipe(newRecipe)
            .then((comment) => {

              expect(comment.recipeId).toBe(newRecipe.id); // confirm association took place
              done();

            });
        })
    });

  });
  describe("#getRecipe()", () => {

    it("should return the associated recipe", (done) => {

      this.comment.getRecipe()
        .then((associatedRecipe) => {
          expect(associatedRecipe.title).toBe("Galaxy HopShip");
          done();
        });

    });

  });
});