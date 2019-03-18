const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;
const Recipe = require("../../src/db/models").Recipe;
const Comment = require("../../src/db/models").Comment;


describe("routes : users", () => {

  beforeEach((done) => {

    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

  });

  describe("GET /users/signup", () => {

    it("should render a view with a sign up form", (done) => {
      request.get(`${base}signup`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign up");
        done();
      });
    });

  });
  describe("POST /users/signup", () => {

    it("should create a new user with valid values and redirect", (done) => {

      const options = {
        url: `${base}signup`,
        form: {
          name: "X",
          email: "x@example.com",
          password: "passwordtest"
        }
      }

      request.post(options,
        (err, res, body) => {

          // Check the users table for a user with the given email and confirm ID  
          User.findOne({
              where: {
                email: "x@example.com"
              }
            })
            .then((user) => {
              expect(user).not.toBeNull();
              expect(user.email).toBe("x@example.com");
              expect(user.id).toBe(1);
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        });
    });
})
})