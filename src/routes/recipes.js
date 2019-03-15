const express = require("express");
const router = express.Router();

const recipeController = require("../controllers/recipeController");
const helper = require('../auth/helpers');



router.get("/recipes", recipeController.index);
router.get("/recipes/new", recipeController.new);
router.post("/recipes/create",helper.ensureAuthenticated, recipeController.create);
router.get("/recipes/:id", recipeController.show);

router.post("/recipes/:id/destroy", recipeController.destroy);
router.get("/recipes/:id/edit", helper.ensureAuthenticated,recipeController.edit);
router.post("/recipes/:id/update", recipeController.update);

module.exports = router;