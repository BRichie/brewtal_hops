const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/recipes/";

const sequelize = require("../../src/db/models/index").sequelize;
const Recipe = require("../../src/db/models").Recipe;
const User = require("../../src/db/models").User;
const Vote = require("../../src/db/models").Vote;

describe("routes : votes", () => {

      beforeEach((done) => {


        this.user;
        this.recipe;
        this.vote;


        sequelize.sync({
          force: true
        }).then((res) => {
          User.create({
              name: "Bowie",
              email: "starman@tesla.com",
              password: "Trekkie4lyfe"
            })
            .then((res) => {
              this.user = res;

              Recipe.create({
                  title: "Galaxy HopShip",
                  style: "Triple IPA",
                  ingredients: "hops",
                  directions: "brew",
                  userId: this.user.id
                
              })
              
                .then((res) => {
                  this.recipe = res;
                  done();
                })
                .catch((err) => {
                  console.log(err);
                  done();
                });
            });
        });
      });

      describe("guest attempting to vote on a recipe", () => {

        beforeEach((done) => {
          request.get({
              url: "http://localhost:3000/auth/fake",
              form: {
                userId: 0
              }
            },
            (err, res, body) => {
              done();

            });

        });


        describe("GET /recipes/:recipeId/votes/upvote", () => {

          it("should not create a new vote", (done) => {
            const options = {
              url: `${base}${this.recipe.id}/votes/upvote`
            };
            request.get(options,
              (err, res, body) => {
                Vote.findOne({
                    where: {
                      userId: this.user.id,
                      recipeId: this.recipe.id
                    }
                  })
                  .then((vote) => {
                    expect(vote).toBeNull();
                    done();
                  })
                  .catch((err) => {
                    console.log(err);
                    done();
                  });
              });
          });
        });
      });

        describe("signed in user voting on a recipe", () => {

          beforeEach((done) => {
            request.get({
                url: "http://localhost:3000/auth/fake",
                form: {
                  role: "member",
                  userId: this.user.id
                }
              },
              (err, res, body) => {
                done();
              }
            );
          });

          describe("GET /recipes/:recipeId/votes/upvote", () => {

            it("should create an upvote", (done) => {
              const options = {
                url: `${base}${this.recipe.id}/votes/upvote`
              };
              request.get(options,
                (err, res, body) => {
                  Vote.findOne({
                      where: {
                        userId: this.user.id,
                        recipeId: this.recipe.id
                      }
                    })
                    .then((vote) => { // confirm that an upvote was created
                      expect(vote).not.toBeNull();
                      expect(vote.value).toBe(1);
                      expect(vote.userId).toBe(this.user.id);
                      expect(vote.recipeId).toBe(this.recipe.id);
                      done();
                    })
                    .catch((err) => {
                      console.log(err);
                      done();
                    });
                });
            });
          });


          describe("GET /recipes/:recipeId/votes/downvote", () => {

            it("should create a downvote", (done) => {
              const options = {
                url: `${base}${this.recipe.id}/votes/downvote`
              };
              request.get(options,
                (err, res, body) => {
                  Vote.findOne({
                      where: {
                        userId: this.user.id,
                        recipeId: this.recipe.id
                      }
                    })
                    .then((vote) => {
                      expect(vote).not.toBeNull();
                      expect(vote.value).toBe(-1);
                      expect(vote.userId).toBe(this.user.id);
                      expect(vote.recipeId).toBe(this.recipe.id);
                      done();
                    })
                    .catch((err) => {
                      console.log(err);
                      done();
                    });
                });
            });
          });

        });


      });