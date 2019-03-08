const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Enjoy Brewtal Hops!");
});

module.exports = router;
