const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/recipes/";

const sequelize = require("../../src/db/models/index").sequelize;
const Recipe = require("../../src/db/models").Recipe;
const User = require("../../src/db/models").User;



describe("routes : recipes", () => {
  beforeEach((done) => {
    this.recipe;
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
              title: "Cluster-Byte",
              ingredients: "Cluster Hops",
              directions: "brew it like this",
            })
            .then((recipe) => {
              this.recipe = recipe;
              done();

            });

        });

    });


    describe("GET /recipes", () => {

      it("should return a status code 200", (done) => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          done();
        });
      });

    });
    describe("GET /recipes/:id", () => {

      it("should render a view with the selected recipe", (done) => {
        request.get(`${base}${this.recipe.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("HopCult");
          done();
        });
      });

    });

    describe("POST /recipes/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "HopCult",
          style: "DIPA"
        }
      };

      it("should create a new recipe and redirect", (done) => {

        request.post(options,

          (err, res, body) => {
            Recipe.findOne({
                where: {
                  title: "HopCult"
                }
              })
              .then((recipe) => {
                expect(res.statusCode).toBe(303);
                expect(recipe.title).toBe("HopCult");
                expect(recipe.style).toBe("DIPA");
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
          }
        );
      });

      describe("GET /recipes/:id/edit", () => {

        it("should render a view with an edit the recipe form", (done) => {
          request.get(`${base}${this.recipe.id}/edit`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Edit Brew");
            expect(body).toContain("HopCult");
            done();
          });
        });

      });
      describe("POST /recipes/:id/destroy", () => {

        it("should delete recipe with the associated ID", (done) => {


          Recipe.all()
            .then((recipes) => {


              const recipeCountBeforeDelete = recipes.length;

              expect(recipeCountBeforeDelete).toBe(1);


              request.post(`${base}${this.recipe.id}/destroy`, (err, res, body) => {
                Recipe.all()
                  .then((recipes) => {
                    expect(err).toBeNull();
                    expect(recipes.length).toBe(recipeCountBeforeDelete - 1);
                    done();
                  })

              });
            });

        });

      });
    });
  });
});