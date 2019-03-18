const express = require("express");
const router = express.Router();

const voteController = require("../controllers/voteController");

 // #1
router.get("/recipes/:recipeId/votes/upvote",
  voteController.upvote);

router.get("/recipes/:recipeId/votes/downvote",
  voteController.downvote);

module.exports = router;