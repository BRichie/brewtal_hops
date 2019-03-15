const express = require("express");
const router = express.Router();
const validation = require("./validation");


const staticController = require("../controllers/staticController");

router.get("/", staticController.index);

module.exports = router;
