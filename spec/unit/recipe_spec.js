const sequelize = require("../../src/db/models/index").sequelize;
const Recipe = require("../../src/db/models").Recipe;
const User = require("../../src/db/models").User;

describe("Recipe", ()=>{

	beforeEach((done) => {

     this.recipe;
     this.user;

     sequelize.sync({force: true}).then((res) => {

        User.create({
       	 name: "X",
         email: "x@example.com",
         password: "123456",
         role: "standard"
       })
       .then((user) => {
         this.user = user; 
         Recipe.create({
          title: "Cluster-Byte",
          style:"DIPA",
          ingredients: "Cluster Hops",
          directions: "brew it like this",
          userId: user.id
         })
         .then((recipe) => {
           this.recipe = recipe;
           done();
         })
       })
	 });
	 
	 describe("POST /recipes/:id/update", () => {

		it("should update the recipe with the given values", (done) => {
		   const options = {
			  url: `${base}${this.recipe.id}/update`,
			  form: {
				title: "White Oak Stout",
				style: "DIPA"
			  }
			};
   //#1
			request.post(options,
			  (err, res, body) => {
   
			  expect(err).toBeNull();
   //#2
			  Recipe.findOne({
				where: { id: this.recipe.id }
			  })
			  .then((recipe) => {
				expect(recipe.title).toBe("White Oak Stout");
				done();
			  });
			});
		});
   
	  });
    

	describe("#create()",()=>{
		it("should create a recipe object and store it in the database",(done)=>{
			Recipe.create({
				title: "Cluster-Byte" ,
				style: "DIPA",
                ingredients: "Cluster Hops",
                directions: "brew it like this",
                userId: user.id
			})
			.then((newRecipe)=>{
				expect(newRecipe.title).toBe("Cluster-Byte");
				expect(newRecipe.ingredients).toBe("Cluster Hops");
				done();
			})
			.catch((err)=>{
				expect(err).toBeNull();
				console.log(err);
				done();
			});
		});

		it("should not create a title without a description", (done) =>{
			Recipe.create({
				title:"Recipe without a description"
			})
			.then((newRecipe)=>{
				done();
				//since the code will go to the error, let's catch the error
			})
			.catch((err)=>{
				expect(err.message).toContain("Recipe.style cannot be null");
				expect(err.message).toContain("Recipe.directions cannot be null");
				expect(err.message).toContain("Recipe.ingredients cannot be null");
				



				done();
			})
		});
	});
});
})	