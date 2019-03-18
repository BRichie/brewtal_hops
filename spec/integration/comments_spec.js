const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/recipes/";

const sequelize = require("../../src/db/models/index").sequelize;
const Recipe = require("../../src/db/models").Recipe;
const User = require("../../src/db/models").User;
const Comment = require("../../src/db/models").Comment;

describe("routes : comments", () => {

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
                        // .catch((err) => {
                        //     console.log(err);
                        //     done();
                       // });
                });
        });
    });
    describe("guest attempting to perform CRUD actions for Comment", () => {


        beforeEach((done) => { 
            request.get({ 
                    url: "http://localhost:3000/auth/fake",
                    form: {
                        userId: 0 
                    }
                },
                (err, res, body) => {
                    done();
                }
            );
        });

    });
    describe("POST /recipes/:recipeId/comments/create", () => {

        it("should not create a new comment", (done) => {
            const options = {
                url: `${base}${this.recipe.id}/comments/create`,
                form: {
                    body: "This comment is amazing!"
                }
            };
            request.post(options,
                (err, res, body) => {
                
                    Comment.findOne({
                            where: {
                                body: "This comment is amazing!"
                            }
                        })
                        .then((comment) => {
                            expect(comment).toBeNull();
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                }
            );
        });
    });
    describe("POST /recipes/:recipeId/comments/:id/destroy", () => {

        it("should not delete the comment with the associated ID", (done) => {
            Comment.all()
                .then((comments) => {
                    const commentCountBeforeDelete = comments.length;

                    expect(commentCountBeforeDelete).toBe(1);

                    request.post(
                        `${base}${this.recipe.id}/comments/${this.comment.id}/destroy`,
                        (err, res, body) => {
                            Comment.all()
                                .then((comments) => {
                                    expect(err).toBeNull();
                                    expect(comments.length).toBe(commentCountBeforeDelete);
                                    done();
                                })

                        });
                })
        });
    });
  });
    describe("signed in user performing CRUD actions for Comment", () => {

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
   
  
        describe("POST /recipes/:recipeId/comments/create", () => {
   
          it("should create a new comment and redirect", (done) => {
            const options = {
              url: `${base}${this.recipe.id}/comments/create`,
              form: {
                body: "This comment is amazing!"
              }
            };
            request.post(options,
              (err, res, body) => {
                Comment.findOne({where: {body: "This comment is amazing!"}})
                .then((comment) => {
                  expect(comment).not.toBeNull();
                  expect(comment.body).toBe("This comment is amazing!");
                  expect(comment.id).not.toBeNull();
                  done();
                })
                .catch((err) => {
                  console.log(err);
                  done();
                });
              }
            );
          });
        });
   

        describe("POST /recipes/:recipeId/comments/:id/destroy", () => {
   
          it("should not delete the comment with the associated ID", (done) => {
            Comment.all()
            .then((comments) => {
              const commentCountBeforeDelete = comments.length;
   
              expect(commentCountBeforeDelete).toBe(1);
   
              request.post(
               `${base}${this.recipe.id}/comments/${this.comment.id}/destroy`,
                (err, res, body) => {
               
                Comment.all()
                .then((comments) => {
                  expect(err).toBeNull();
                  expect(comments.length).toBe(commentCountBeforeDelete);
                  done();
                })
   
              });
            })
   
          });
   
        });
   
      }); 
