const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");
const validation = require("./validation");


router.post("/recipes/:recipeId/comments/create",
  validation.validateComments,
  commentController.create);

 
router.post("/recipes/:recipeId/comments/:id/destroy",
  commentController.destroy);

  module.exports = router;