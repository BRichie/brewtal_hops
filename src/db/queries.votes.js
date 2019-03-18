
 const Comment = require("./models").Comment;
 const Recipe = require("./models").Recipe;
 const User = require("./models").User;
 const Vote = require("./models").Vote;
 
 module.exports = {
   createVote(req, val, callback){
 

     return Vote.findOne({
       where: {
         recipeId: req.params.recipeId,
         userId: req.user.id
       }
     })
     .then((vote) => {
 

       if(vote){
         vote.value = val;
         vote.save()
         .then((vote) => {
           callback(null, vote);
         })
         .catch((err) => {
           callback(err);
         });
       } else {
 
  // #4
         Vote.create({
           value: val,
           recipeId: req.params.recipeId,
           userId: req.user.id
         }).then((vote) => {
           callback(null, vote);
         })
         .catch((err) => {
           callback(err);
         });
       }
     });
   }
 }