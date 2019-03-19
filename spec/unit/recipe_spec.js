const sequelize = require("../../src/db/models/index").sequelize;
const Recipe = require("../../src/db/models").Recipe;
const User = require("../../src/db/models").User;

describe("Recipe", () => {

			beforeEach((done) => {

						this.recipe;
						this.user;

						sequelize.sync({
							force: true
						}).then((res) => {

							User.create({
									name: "Bowie",
									email: "starman@tesla.com",
									password: "Trekkie4lyfe",
									role: "member"
								})
								.then((user) => {
									this.user = user;
									Recipe.create({
											title: "Galaxy HopShip",
											style: "Triple IPA",
											ingredients: "hops",
											directions: "brew",
											userId: user.id
										})
										.then((recipe) => {
											this.recipe = recipe;
											done();
										})
										.catch((err) => {
											console.log(err);
											done();
										});
								})
						});
					});

						describe("#create()", () => {
							it("should create a recipe object and store it in the database", (done) => {
								Recipe.create({
										title: "Galaxy HopShip",
										style: "Triple IPA",
										ingredients: "hops",
										directions: "brew",
										userId: this.user.id
									})
									.then((newRecipe) => {
										expect(newRecipe.title).toBe("Galaxy HopShip");
										expect(newRecipe.ingredients).toBe("hops");
										done();
									})
									.catch((err) => {
										expect(err).toBeNull();
										console.log(err);
										done();
									});
							});

							it("should not create a recipe missing title or without ingredients", (done) => {
								Recipe.create({
										title: "Recipe without a ingredients"
									})
									.then((recipe) => {
										done();
									})
									.catch((err) => {
										expect(err.message).toContain("Recipe.ingredients cannot be null");

										done();
									})
							});
						});

						
					});

			

					