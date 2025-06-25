const router = require("express").Router();

router.get("/auth", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;
