module.exports = {
    init(app){
      const staticRoutes = require("../routes/static");
      const userRoutes = require("../routes/users");
      const recipeRoutes = require("../routes/recipes");
      const commentRoutes = require("../routes/comments");



      if(process.env.NODE_ENV === "test") {
        const mockAuth = require("../../spec/support/mock-auth.js");
        mockAuth.fakeIt(app);
      }


      app.use(staticRoutes);
      app.use(userRoutes);
      app.use(recipeRoutes);
      app.use(commentRoutes);



    }
  }