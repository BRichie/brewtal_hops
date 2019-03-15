const sequelize = require("../../src/db/models/index").sequelize;
const Recipe = require("../../src/db/models").Recipe;
const Comment = require("../../src/db/models").Comment;

const User = require("../../src/db/models").User;
const Vote = require("../../src/db/models").Vote;

describe("Vote", () => {

    beforeEach((done) => {
        this.user;
        this.recipe;
        this.vote;


        sequelize.sync({
            force: true
        }).then((res) => {

            User.create({
                    email: "starman@tesla.com",
                    password: "Trekkie4lyfe"
                })
                .then((res) => {
                    this.user = res;

                    Recipe.create({
                            title: "My first visit to Proxima Centauri b",
                            style: "I saw some rocks.",
                            ingredients: "hops",
                            directions: "brew",
                            userId: this.user.id

                        })
                        .then((res) => {
                            this.recipe = res;

                            Comment.create({
                                    body: "ay caramba!!!!!",
                                    userId: this.user.id,
                                    recipeId: this.recipe.id
                                })
                                .then((res) => {
                                    this.comment = res;
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
                })
        });
    });
    describe("#create()", () => {

        it("should create an upvote on a recipe for a user", (done) => {

            Vote.create({
                    value: 1,
                    recipeId: this.recipe.id,
                    userId: this.user.id
                })
                .then((vote) => {

                    expect(vote.value).toBe(1);
                    expect(vote.recipeId).toBe(this.recipe.id);
                    expect(vote.userId).toBe(this.user.id);
                    done();

                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });

        it("should create a downvote on a recipe for a user", (done) => {
            Vote.create({
                    value: -1,
                    recipeId: this.recipe.id,
                    userId: this.user.id
                })
                .then((vote) => {
                    expect(vote.value).toBe(-1);
                    expect(vote.recipeId).toBe(this.recipe.id);
                    expect(vote.userId).toBe(this.user.id);
                    done();

                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });

        it("should not create a vote without assigned recipe or user", (done) => {
            Vote.create({
                    value: 1
                })
                .then((vote) => {

                    done();

                })
                .catch((err) => {

                    expect(err.message).toContain("Vote.userId cannot be null");
                    expect(err.message).toContain("Vote.recipeId cannot be null");
                    done();

                })
        });

    });
    describe("#setUser()", () => {

        it("should associate a vote and a user together", (done) => {

            Vote.create({
                    value: -1,
                    recipeId: this.recipe.id,
                    userId: this.user.id
                })
                .then((vote) => {
                    this.vote = vote; // store it
                    expect(vote.userId).toBe(this.user.id); //confirm it was created for this.user

                    User.create({ // create a new user
                            email: "bern@2020.com",
                            password: "password"
                        })
                        .then((newUser) => {

                            this.vote.setUser(newUser) // change the vote's user reference for newUser
                                .then((vote) => {

                                    expect(vote.userId).toBe(newUser.id); //confirm it was updated
                                    done();

                                });
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                })
        });

    });

    // #2
    describe("#getUser()", () => {

        it("should return the associated user", (done) => {
            Vote.create({
                    value: 1,
                    userId: this.user.id,
                    recipeId: this.recipe.id
                })
                .then((vote) => {
                    vote.getUser()
                        .then((user) => {
                            expect(user.id).toBe(this.user.id);
                            done();
                        })
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });

    });
    describe("#setRecipe()", () => {

        it("should associate a recipe and a vote together", (done) => {

            Vote.create({
                    value: -1,
                    recipeId: this.recipe.id,
                    userId: this.user.id
                })
                .then((vote) => {
                    this.vote = vote;

                    Recipe.create({
                            title: "Dress code on Proxima b",
                            style: "Spacesuit, space helmet, space boots, and space gloves",
                            recipeId: this.recipe.id,
                            userId: this.user.id
                        })
                        .then((newPost) => {

                            expect(this.vote.recipeId).toBe(this.recipe.id); 

                            this.vote.setRecipe(newRecipe) 
                                .then((vote) => {

                                    expect(vote.recipeId).toBe(newRecipe.id); 
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

    describe("#getRecipe()", () => {

        it("should return the associated recipe", (done) => {
            Vote.create({
                    value: 1,
                    userId: this.user.id,
                    recipeId: this.recipe.id
                })
                .then((vote) => {
                    this.comment.getRecipe()
                        .then((associatedRecipe) => {
                            expect(associatedRecipe.title).toBe("My first visit to Proxima Centauri b");
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